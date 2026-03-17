import { dbPool } from '../config/db.js';

export const followUser = async (followerId, followingId) => {
  await dbPool.execute('INSERT IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)', [followerId, followingId]);
};

export const unfollowUser = async (followerId, followingId) => {
  await dbPool.execute('DELETE FROM follows WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
};
