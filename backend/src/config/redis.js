import { createClient } from 'redis';
import { env } from './env.js';

export const redisClient = createClient({
  url: env.redisUrl
});

export const redisState = {
  connected: false,
  enabled: true
};

let lastErrorLogAt = 0;
const ERROR_LOG_COOLDOWN_MS = 15000;

redisClient.on('ready', () => {
  redisState.connected = true;
  redisState.enabled = true;
  console.log('Redis connected.');
});

redisClient.on('end', () => {
  redisState.connected = false;
});

redisClient.on('error', (err) => {
  redisState.connected = false;
  const now = Date.now();
  if (now - lastErrorLogAt > ERROR_LOG_COOLDOWN_MS) {
    console.warn('Redis unavailable, continuing without cache/blacklist features:', err.message);
    lastErrorLogAt = now;
  }
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    redisState.connected = false;
    redisState.enabled = false;
    console.warn('Redis startup connection failed; app will run in degraded mode.');
  }
};
