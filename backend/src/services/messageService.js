import { dbPool } from '../config/db.js';

export const createMessage = async (senderId, receiverId, content) => {
  const [result] = await dbPool.execute(
    'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
    [senderId, receiverId, content]
  );
  const [rows] = await dbPool.execute('SELECT * FROM messages WHERE id = ?', [result.insertId]);
  return rows[0];
};

export const getConversation = async (userId, otherId) => {
  const [rows] = await dbPool.execute(
    `SELECT * FROM messages
     WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
     ORDER BY created_at ASC`,
    [userId, otherId, otherId, userId]
  );
  return rows;
};
