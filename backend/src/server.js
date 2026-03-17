import http from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { dbPool } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { initSocket } from './socket/index.js';

const startServer = async () => {
  await dbPool.query('SELECT 1');
  await connectRedis();

  const app = createApp();
  const httpServer = http.createServer(app);
  const io = initSocket(httpServer);
  app.set('io', io);

  httpServer.listen(env.port, () => {
    console.log(`API server running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
