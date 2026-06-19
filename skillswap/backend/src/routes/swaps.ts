import { Router, Request, Response } from 'express';
import { runQuery } from '../db/neo4j';
import { getKarmaForDuration } from '../lib/karma';

const router = Router();

// GET /swaps/user/:userId
router.get('/user/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const results = await runQuery(
      `
      MATCH (s:SwapSession)
      WHERE s.teacherId = $userId OR s.learnerId = $userId
      RETURN s as session
      ORDER BY s.scheduledAt DESC
      `,
      { userId },
      'READ'
    );
    res.json(results.map((r) => r.session));
  } catch (error: any) {
    console.error('Error fetching user swaps:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /swaps/request
router.post('/request', async (req: Request, res: Response) => {
  const { postId, requesterId } = req.body;

  if (!postId || !requesterId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const sessionId = `sess_${Date.now()}`;

  try {
    // 1. Verify post and author exist
    const postQuery = await runQuery(
      `
      MATCH (p:SwapPost {id: $postId})<-[:CREATED]-(author:User)
      RETURN p, author
      `,
      { postId },
      'READ'
    );

    if (postQuery.length === 0) {
      return res.status(404).json({ error: 'Post or author not found' });
    }

    const post = postQuery[0].p;
    const author = postQuery[0].author;

    // 2. Verify requester exists
    const requesterQuery = await runQuery(
      `MATCH (u:User {id: $requesterId}) RETURN u`,
      { requesterId },
      'READ'
    );

    if (requesterQuery.length === 0) {
      return res.status(404).json({ error: 'Requester user not found' });
    }

    const requester = requesterQuery[0].u;

    // 3. Create SwapSession
    const results = await runQuery(
      `
      MATCH (p:SwapPost {id: $postId})<-[:CREATED]-(author:User)
      MATCH (requester:User {id: $requesterId})
      CREATE (s:SwapSession {id: $sessionId})
      SET 
        s.postId = $postId,
        s.teacherId = case when p.type = 'teach' then author.id else requester.id end,
        s.teacherName = case when p.type = 'teach' then author.name else requester.name end,
        s.learnerId = case when p.type = 'teach' then requester.id else author.id end,
        s.learnerName = case when p.type = 'teach' then requester.name else author.name end,
        s.title = p.title,
        s.skillName = p.skillName,
        s.duration = p.duration,
        s.karma = abs(p.karma),
        s.status = 'pending',
        s.scheduledAt = toString(datetime())
      CREATE (s)-[:FOR_POST]->(p)
      CREATE (requester)-[:REQUESTED]->(s)
      RETURN s as session
      `,
      { postId, requesterId, sessionId }
    );

    res.status(201).json(results[0].session);
  } catch (error: any) {
    console.error('Error requesting swap:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /swaps/:id/accept
router.post('/:id/accept', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const results = await runQuery(
      `
      MATCH (s:SwapSession {id: $id})
      WHERE s.status = 'pending'
      SET s.status = 'accepted'
      RETURN s as session
      `,
      { id }
    );

    if (results.length === 0) {
      return res.status(404).json({ error: 'Session not found or not in pending state' });
    }

    res.json(results[0].session);
  } catch (error: any) {
    console.error('Error accepting swap:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /swaps/:id/decline
router.post('/:id/decline', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const results = await runQuery(
      `
      MATCH (s:SwapSession {id: $id})
      WHERE s.status = 'pending'
      SET s.status = 'declined'
      RETURN s as session
      `,
      { id }
    );

    if (results.length === 0) {
      return res.status(404).json({ error: 'Session not found or not in pending state' });
    }

    res.json(results[0].session);
  } catch (error: any) {
    console.error('Error declining swap:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /swaps/:id/complete (Atomic completed transactions)
router.post('/:id/complete', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // 1. Verify session exists and is accepted
    const sessionQuery = await runQuery(
      `MATCH (s:SwapSession {id: $id}) RETURN s as session`,
      { id },
      'READ'
    );

    if (sessionQuery.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = sessionQuery[0].session;
    if (session.status !== 'accepted') {
      return res.status(400).json({ error: `Cannot complete session in '${session.status}' state. Must be accepted.` });
    }

    // 2. Calculate karma based on duration
    const karmaAmount = getKarmaForDuration(session.duration);
    const teacherTxId = `tx_earn_${id}_${Date.now()}`;
    const learnerTxId = `tx_spend_${id}_${Date.now()}`;

    // 3. Atomically update database: transition session, adjust balances, create transaction nodes
    const results = await runQuery(
      `
      MATCH (s:SwapSession {id: $id})
      WHERE s.status = 'accepted'
      
      SET s.status = 'completed', s.completedAt = toString(datetime())
      
      WITH s
      MATCH (teacher:User {id: s.teacherId})
      MATCH (learner:User {id: s.learnerId})
      
      SET teacher.karmaBalance = teacher.karmaBalance + $karmaAmount
      SET learner.karmaBalance = case when learner.karmaBalance - $karmaAmount < 0 then 0 else learner.karmaBalance - $karmaAmount end
      
      CREATE (tTx:KarmaTransaction {
        id: $teacherTxId,
        delta: $karmaAmount,
        type: 'session_completed_earned',
        relatedSessionId: s.id,
        note: 'Taught "' + s.title + '" to ' + s.learnerName,
        createdAt: toString(datetime())
      })
      CREATE (teacher)-[:EARNED]->(tTx)
      
      CREATE (lTx:KarmaTransaction {
        id: $learnerTxId,
        delta: -$karmaAmount,
        type: 'session_completed_spent',
        relatedSessionId: s.id,
        note: 'Learned "' + s.title + '" from ' + s.teacherName,
        createdAt: toString(datetime())
      })
      CREATE (learner)-[:SPENT]->(lTx)
      
      WITH s, tTx, lTx
      OPTIONAL MATCH (s)-[:FOR_POST]->(p:SwapPost)
      SET p.status = 'closed'
      
      RETURN s as session, tTx as teacherTx, lTx as learnerTx
      `,
      {
        id,
        karmaAmount,
        teacherTxId,
        learnerTxId,
      }
    );

    if (results.length === 0) {
      return res.status(500).json({ error: 'Atomically completing session failed. Please retry.' });
    }

    res.json({
      session: results[0].session,
      teacherTransaction: results[0].teacherTx,
      learnerTransaction: results[0].learnerTx,
    });
  } catch (error: any) {
    console.error('Error completing swap:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
