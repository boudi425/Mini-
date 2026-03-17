import { clearUsersCache } from '../services/redisService.js';
import { followUser, unfollowUser } from '../services/followService.js';

export const follow = async (req, res, next) => {
  try {
    const followerId = req.user.userId;
    const followingId = Number(req.params.id);
    if (!followingId || followingId === followerId) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    await followUser(followerId, followingId);
    await clearUsersCache(followerId);
    return res.json({ message: 'Followed user' });
  } catch (error) {
    return next(error);
  }
};

export const unfollow = async (req, res, next) => {
  try {
    const followerId = req.user.userId;
    const followingId = Number(req.params.id);
    if (!followingId || followingId === followerId) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    await unfollowUser(followerId, followingId);
    await clearUsersCache(followerId);
    return res.json({ message: 'Unfollowed user' });
  } catch (error) {
    return next(error);
  }
};
