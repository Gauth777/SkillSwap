import { Router, Request, Response } from 'express';
import { verifyConnectivity } from '../db/neo4j';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const dbConnected = await verifyConnectivity();
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      connected: dbConnected,
      message: dbConnected ? 'Connected to Neo4j database' : 'Neo4j connectivity check failed',
    },
  });
});

export default router;
