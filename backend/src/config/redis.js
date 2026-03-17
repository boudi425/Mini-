import { createClient } from 'redis';
import { env } from './env.js';

export const redisClient = createClient({
  url: env.redisUrl
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err.message);
});
