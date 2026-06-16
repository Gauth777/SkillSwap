import { Router, Request, Response } from 'express';
import { runQuery } from '../db/neo4j';

const router = Router();

// GET /matches/:userId
router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    // 1. Run the smart matches Cypher query
    const results = await runQuery(
      `
      MATCH (u:User {id: $userId})
      MATCH (p:SwapPost {status: 'open'})<-[:CREATED]-(pAuthor:User)
      WHERE pAuthor.id <> u.id

      // 1. Post offers a skill I want to learn
      OPTIONAL MATCH (p)-[:OFFERS]->(s1:Skill)<-[:WANTS_TO_LEARN]-(u)

      // 2. Post seeks a skill I can teach
      OPTIONAL MATCH (p)-[:SEEKS]->(s2:Skill)<-[:CAN_TEACH]-(u)

      // 3. Mutual swap potential
      OPTIONAL MATCH (u)-[:CAN_TEACH]->(s3:Skill)<-[:WANTS_TO_LEARN]-(pAuthor)
      OPTIONAL MATCH (u)-[:WANTS_TO_LEARN]->(s4:Skill)<-[:CAN_TEACH]-(pAuthor)

      WITH p, pAuthor, 
           (case when s1 is not null then 4 else 0 end) as learnScore,
           (case when s2 is not null then 3 else 0 end) as teachScore,
           (case when s3 is not null and s4 is not null then 5 else 0 end) as mutualScore

      WITH p, pAuthor, 
           (learnScore + teachScore + mutualScore) as totalScore,
           learnScore, teachScore, mutualScore

      WHERE totalScore > 0

      RETURN p { 
        .*, 
        authorId: pAuthor.id, 
        authorName: pAuthor.name 
      } as post,
      totalScore as matchScore,
      case 
        when mutualScore > 0 then "Mutual interest match — both of you have complementary skills to swap!"
        when learnScore > 0 and teachScore > 0 then "Perfect match — this post offers a skill you want and seeks what you teach!"
        when learnScore > 0 then "Provides a skill you want to learn: " + p.skillName
        when teachScore > 0 then "Needs a skill you can teach: " + p.skillName
        else "Recommended based on your preferences"
      end as matchReason
      ORDER BY matchScore DESC, p.createdAt DESC
      `,
      { userId },
      'READ'
    );

    // 2. If we found smart matches, return them
    if (results.length > 0) {
      return res.json(results.map((r) => ({
        ...r.post,
        matchScore: r.matchScore,
        matchReason: r.matchReason,
      })));
    }

    // 3. Fallback: If no match relationships found, return all other users' open posts
    // with a base score and basic explanation, to avoid a completely empty screen.
    const fallbackResults = await runQuery(
      `
      MATCH (p:SwapPost {status: 'open'})<-[:CREATED]-(pAuthor:User)
      WHERE pAuthor.id <> $userId
      RETURN p { 
        .*, 
        authorId: pAuthor.id, 
        authorName: pAuthor.name 
      } as post
      ORDER BY p.createdAt DESC
      `,
      { userId },
      'READ'
    );

    res.json(fallbackResults.map((r) => ({
      ...r.post,
      matchScore: 1,
      matchReason: 'General recommendation from the feed',
    })));
  } catch (error: any) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
