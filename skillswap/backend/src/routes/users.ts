import { Router, Request, Response } from 'express';
import { runQuery } from '../db/neo4j';

const router = Router();

// Mapping of mock skills to support ID and name normalization
export const SKILLS_LIST = [
  { id: 'sk_js', name: 'JavaScript', category: 'Programming' },
  { id: 'sk_dsa', name: 'DSA', category: 'Data Structures' },
  { id: 'sk_ui', name: 'UI Design', category: 'Design' },
  { id: 'sk_ml', name: 'Machine Learning basics', category: 'Machine Learning' },
  { id: 'sk_py', name: 'Python', category: 'Programming' },
  { id: 'sk_react', name: 'React', category: 'Programming' },
  { id: 'sk_comm', name: 'Communication skills', category: 'Communication' },
  { id: 'sk_resume', name: 'Resume review', category: 'Career' },
  { id: 'sk_figma', name: 'Figma', category: 'Design' },
  { id: 'sk_math', name: 'Linear Algebra', category: 'Math' },
];

export function resolveSkill(identifier: string): { id: string; name: string; category: string } {
  // If it's a skill ID (e.g. "sk_py")
  const skillById = SKILLS_LIST.find((s) => s.id === identifier);
  if (skillById) return skillById;

  // If it's a skill name (e.g. "Python")
  const skillByName = SKILLS_LIST.find((s) => s.name.toLowerCase() === identifier.toLowerCase());
  if (skillByName) return skillByName;

  // Fallback for custom dynamic skills
  const cleanId = 'sk_' + identifier.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return {
    id: cleanId,
    name: identifier,
    category: 'General',
  };
}

// GET /users/:id
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const results = await runQuery(
      `
      MATCH (u:User {id: $id})
      OPTIONAL MATCH (u)-[:CAN_TEACH]->(ts:Skill)
      OPTIONAL MATCH (u)-[:WANTS_TO_LEARN]->(ls:Skill)
      RETURN u { 
        .*, 
        skillsToTeach: collect(distinct ts.id), 
        skillsToLearn: collect(distinct ls.id) 
      } as user
      `,
      { id },
      'READ'
    );
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(results[0].user);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /users (Create or Onboard)
router.post('/', async (req: Request, res: Response) => {
  const { id, name, handle, bio, skillsToTeach = [], skillsToLearn = [] } = req.body;
  
  if (!id || !name || !handle) {
    return res.status(400).json({ error: 'Missing required user fields' });
  }
  
  try {
    // 1. Create/Merge User node. If onboarding, set initial karma balance to 8
    await runQuery(
      `
      MERGE (u:User {id: $id})
      ON CREATE SET 
        u.name = $name,
        u.handle = $handle,
        u.bio = $bio,
        u.karmaBalance = 8,
        u.joinedAt = datetime().toString()
      ON MATCH SET
        u.name = $name,
        u.handle = $handle,
        u.bio = $bio
      RETURN u
      `,
      { id, name, handle, bio: bio || '' }
    );

    // 2. Clear old skill relationships
    await runQuery(
      `
      MATCH (u:User {id: $id})
      OPTIONAL MATCH (u)-[r1:CAN_TEACH]->(:Skill)
      OPTIONAL MATCH (u)-[r2:WANTS_TO_LEARN]->(:Skill)
      DELETE r1, r2
      `,
      { id }
    );

    // 3. Re-create skill nodes and relationships
    for (const skillIdOrName of skillsToTeach) {
      const resolved = resolveSkill(skillIdOrName);
      await runQuery(
        `
        MATCH (u:User {id: $userId})
        MERGE (s:Skill {id: $skillId})
        ON CREATE SET s.name = $skillName, s.category = $skillCategory
        MERGE (u)-[:CAN_TEACH]->(s)
        `,
        { userId: id, skillId: resolved.id, skillName: resolved.name, skillCategory: resolved.category }
      );
    }

    for (const skillIdOrName of skillsToLearn) {
      const resolved = resolveSkill(skillIdOrName);
      await runQuery(
        `
        MATCH (u:User {id: $userId})
        MERGE (s:Skill {id: $skillId})
        ON CREATE SET s.name = $skillName, s.category = $skillCategory
        MERGE (u)-[:WANTS_TO_LEARN]->(s)
        `,
        { userId: id, skillId: resolved.id, skillName: resolved.name, skillCategory: resolved.category }
      );
    }

    // 4. Create welcome bonus transaction if it doesn't already exist
    const txId = `tx_welcome_${id}`;
    await runQuery(
      `
      MATCH (u:User {id: $userId})
      MERGE (t:KarmaTransaction {id: $txId})
      ON CREATE SET 
        t.delta = 7,
        t.type = 'welcome_bonus',
        t.note = 'Welcome to SkillSwap! Here is your starter karma.',
        t.createdAt = datetime().toString()
      MERGE (u)-[:EARNED]->(t)
      `,
      { userId: id, txId }
    );

    // Fetch and return the finalized user profile
    const finalResults = await runQuery(
      `
      MATCH (u:User {id: $id})
      OPTIONAL MATCH (u)-[:CAN_TEACH]->(ts:Skill)
      OPTIONAL MATCH (u)-[:WANTS_TO_LEARN]->(ls:Skill)
      RETURN u { 
        .*, 
        skillsToTeach: collect(distinct ts.id), 
        skillsToLearn: collect(distinct ls.id) 
      } as user
      `,
      { id }
    );

    res.status(201).json(finalResults[0].user);
  } catch (error: any) {
    console.error('Error onboarding user:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// PUT /users/:id/skills
router.put('/:id/skills', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { skillsToTeach = [], skillsToLearn = [] } = req.body;

  try {
    // Check if user exists
    const userCheck = await runQuery(`MATCH (u:User {id: $id}) RETURN u`, { id }, 'READ');
    if (userCheck.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Clear old skill relationships
    await runQuery(
      `
      MATCH (u:User {id: $id})
      OPTIONAL MATCH (u)-[r1:CAN_TEACH]->(:Skill)
      OPTIONAL MATCH (u)-[r2:WANTS_TO_LEARN]->(:Skill)
      DELETE r1, r2
      `,
      { id }
    );

    // Create teach relationships
    for (const skillIdOrName of skillsToTeach) {
      const resolved = resolveSkill(skillIdOrName);
      await runQuery(
        `
        MATCH (u:User {id: $userId})
        MERGE (s:Skill {id: $skillId})
        ON CREATE SET s.name = $skillName, s.category = $skillCategory
        MERGE (u)-[:CAN_TEACH]->(s)
        `,
        { userId: id, skillId: resolved.id, skillName: resolved.name, skillCategory: resolved.category }
      );
    }

    // Create learn relationships
    for (const skillIdOrName of skillsToLearn) {
      const resolved = resolveSkill(skillIdOrName);
      await runQuery(
        `
        MATCH (u:User {id: $userId})
        MERGE (s:Skill {id: $skillId})
        ON CREATE SET s.name = $skillName, s.category = $skillCategory
        MERGE (u)-[:WANTS_TO_LEARN]->(s)
        `,
        { userId: id, skillId: resolved.id, skillName: resolved.name, skillCategory: resolved.category }
      );
    }

    // Fetch and return the updated user
    const finalResults = await runQuery(
      `
      MATCH (u:User {id: $id})
      OPTIONAL MATCH (u)-[:CAN_TEACH]->(ts:Skill)
      OPTIONAL MATCH (u)-[:WANTS_TO_LEARN]->(ls:Skill)
      RETURN u { 
        .*, 
        skillsToTeach: collect(distinct ts.id), 
        skillsToLearn: collect(distinct ls.id) 
      } as user
      `,
      { id }
    );

    res.json(finalResults[0].user);
  } catch (error: any) {
    console.error('Error updating skills:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
