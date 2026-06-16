import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { config, validateConfig } from './config/env';
import { getDriver } from './db/neo4j';
import healthRouter from './routes/health';
import karmaRouter from './routes/karma';
import matchesRouter from './routes/matches';
import postsRouter from './routes/posts';
import swapsRouter from './routes/swaps';
import usersRouter from './routes/users';

const app = express();

validateConfig();

app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json());

app.use('/health', healthRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/matches', matchesRouter);
app.use('/swaps', swapsRouter);
app.use('/karma', karmaRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(config.PORT, () => {
  console.log(`SkillSwap backend listening on port ${config.PORT}`);
});

async function shutdown(signal: NodeJS.Signals) {
  console.log(`${signal} received. Shutting down SkillSwap backend...`);

  server.close(async () => {
    const driver = getDriver();
    if (driver) {
      await driver.close();
    }
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
