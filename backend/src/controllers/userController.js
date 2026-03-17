import { getCachedUsers, cacheUsers } from '../services/redisService.js';
import { listDiscoverableUsers } from '../services/userService.js';

export const getUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user.userId;
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
    const offset = (page - 1) * limit;

    if (page === 1 && limit === 20) {
      const cached = await getCachedUsers(currentUserId);
      if (cached) {
        return res.json({ users: cached, source: 'cache' });
      }
    }

    const users = await listDiscoverableUsers(currentUserId, limit, offset);
    if (page === 1 && limit === 20) {
      await cacheUsers(currentUserId, users);
    }
    return res.json({ users, source: 'db' });
  } catch (error) {
    return next(error);
  }
};
