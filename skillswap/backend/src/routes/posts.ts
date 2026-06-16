import { Router, Request, Response } from 'express';
import { runQuery } from '../db/neo4j';
import { resolveSkill } from './users';

const router = Router();

// GET /posts
router.get('/', async (req: Request, res: Response) => {
  try {
    const results = await runQuery(
      `
      MATCH (p:SwapPost)
      WHERE p.status = 'open'
      MATCH (u:User)-[:CREATED]->(p)
      RETURN p { 
        .*, 
        authorId: u.id, 
        authorName: u.name
      } as post
      ORDER BY p.createdAt DESC
      `,
      {},
      'READ'
    );
    res.json(results.map((r) => r.post));
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /posts
router.post('/', async (req: Request, res: Response) => {
  const {
    id,
    authorId,
    type, // 'teach' | 'learn'
    title,
    description,
    skillName,
    category,
    duration,
    karma,
  } = req.body;

  if (!id || !authorId || !type || !title || !skillName || !category || !duration) {
    return res.status(400).json({ error: 'Missing required post parameters' });
  }

  try {
    // Verify user exists
    const userResult = await runQuery(`MATCH (u:User {id: $authorId}) RETURN u`, { authorId }, 'READ');
    if (userResult.length === 0) {
      return res.status(404).json({ error: 'Author user not found' });
    }

    // Resolve skill to normalize link
    const resolvedSkill = resolveSkill(skillName);

    // Create the SwapPost node and associate with user
    await runQuery(
      `
      MATCH (u:User {id: $authorId})
      MERGE (p:SwapPost {id: $id})
      ON CREATE SET 
        p.type = $type,
        p.title = $title,
        p.description = $description,
        p.skillName = $skillName,
        p.category = $category,
        p.duration = $duration,
        p.karma = $karma,
        p.status = 'open',
        p.createdAt = toString(datetime())
      MERGE (u)-[:CREATED]->(p)
      RETURN p
      `,
      {
        id,
        authorId,
        type,
        title,
        description: description || '',
        skillName,
        category,
        duration: Number(duration),
        karma: Number(karma),
      }
    );

    // Create relationship to the Skill node
    const relationType = type === 'teach' ? 'OFFERS' : 'SEEKS';
    await runQuery(
      `
      MATCH (p:SwapPost {id: $postId})
      MERGE (s:Skill {id: $skillId})
      ON CREATE SET s.name = $skillName, s.category = $skillCategory
      MERGE (p)-[r:${relationType}]->(s)
      `,
      {
        postId: id,
        skillId: resolvedSkill.id,
        skillName: resolvedSkill.name,
        skillCategory: resolvedSkill.category,
      }
    );

    // Fetch final created post to return
    const finalResults = await runQuery(
      `
      MATCH (p:SwapPost {id: $id})<-[:CREATED]-(u:User)
      RETURN p { .*, authorId: u.id, authorName: u.name } as post
      `,
      { id }
    );

    res.status(201).json(finalResults[0].post);
  } catch (error: any) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
