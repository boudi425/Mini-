import { redisClient, redisState } from '../config/redis.js';

const safe = async (operation) => {
  if (!redisState.connected || !redisState.enabled) {
    return null;
  }

  try {
    return await operation();
  } catch {
    return null;
  }
};

export const cacheUsers = (currentUserId, users) =>
  safe(() => redisClient.setEx(`users:${currentUserId}`, 60, JSON.stringify(users)));

export const getCachedUsers = async (currentUserId) => {
  const data = await safe(() => redisClient.get(`users:${currentUserId}`));
  return data ? JSON.parse(data) : null;
};

export const clearUsersCache = (currentUserId) => safe(() => redisClient.del(`users:${currentUserId}`));

export const blacklistToken = (token, ttlSeconds) =>
  safe(() => redisClient.setEx(`blacklist:${token}`, Math.max(ttlSeconds, 1), '1'));

export const isTokenBlacklisted = async (token) => {
  const value = await safe(() => redisClient.get(`blacklist:${token}`));
  return Boolean(value);
};

export const addOnlineUser = (userId) => safe(() => redisClient.sAdd('online_users', String(userId)));
export const removeOnlineUser = (userId) => safe(() => redisClient.sRem('online_users', String(userId)));
export const getOnlineUsers = () => safe(() => redisClient.sMembers('online_users'));
