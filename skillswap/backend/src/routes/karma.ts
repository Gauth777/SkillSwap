import { Router, Request, Response } from 'express';
import { runQuery } from '../db/neo4j';

const router = Router();

// GET /karma/:userId
router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const results = await runQuery(
      `
      MATCH (u:User {id: $userId})
      OPTIONAL MATCH (u)-[:EARNED|SPENT]->(t:KarmaTransaction)
      WITH t WHERE t IS NOT NULL
      RETURN t as transaction
      ORDER BY t.createdAt DESC
      `,
      { userId },
      'READ'
    );
    res.json(results.map((r) => r.transaction));
  } catch (error: any) {
    console.error('Error fetching karma ledger:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
