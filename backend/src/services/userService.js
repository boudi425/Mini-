import { dbPool } from '../config/db.js';

export const createUser = async ({ username, email, password }) => {
  const [result] = await dbPool.execute(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password]
  );
  return result.insertId;
};

export const findUserByEmail = async (email) => {
  const [rows] = await dbPool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

export const findUserById = async (id) => {
  const [rows] = await dbPool.execute('SELECT id, username, email, created_at FROM users WHERE id = ?', [id]);
  return rows[0] || null;
};

export const listDiscoverableUsers = async (currentUserId, limit = 50, offset = 0) => {
  const [rows] = await dbPool.execute(
    `SELECT u.id, u.username, u.email, u.created_at,
            IF(f.id IS NULL, 0, 1) AS is_following
     FROM users u
     LEFT JOIN follows f ON f.follower_id = ? AND f.following_id = u.id
     WHERE u.id != ?
     ORDER BY u.created_at DESC
     LIMIT ? OFFSET ?`,
    [currentUserId, currentUserId, limit, offset]
  );
  return rows;
};
