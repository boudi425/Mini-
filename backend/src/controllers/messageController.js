import { createMessage, getConversation } from '../services/messageService.js';

export const getMessages = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const otherUserId = Number(req.params.userId);
    if (!otherUserId) {
      return res.status(400).json({ message: 'Invalid user id' });
    }
    const messages = await getConversation(userId, otherUserId);
    return res.json({ messages });
  } catch (error) {
    return next(error);
  }
};

export const postMessage = async (req, res, next) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, content } = req.body;
    if (!receiverId || !content?.trim()) {
      return res.status(400).json({ message: 'receiverId and non-empty content are required' });
    }

    const message = await createMessage(senderId, Number(receiverId), content.trim());
    const io = req.app.get('io');
    io.to(`user:${receiverId}`).emit('receive_message', message);

    return res.status(201).json({ message });
  } catch (error) {
    return next(error);
  }
};
