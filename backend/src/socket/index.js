import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { isTokenBlacklisted, addOnlineUser, removeOnlineUser } from '../services/redisService.js';
import { verifyAccessToken } from '../utils/token.js';
import { createMessage } from '../services/messageService.js';

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token || (await isTokenBlacklisted(token))) {
        return next(new Error('Unauthorized socket'));
      }
      const user = verifyAccessToken(token);
      socket.user = user;
      return next();
    } catch {
      return next(new Error('Unauthorized socket'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user.userId;
    socket.join(`user:${userId}`);
    await addOnlineUser(userId);

    socket.on('send_message', async ({ receiverId, content }) => {
      if (!receiverId || !content?.trim()) return;
      const message = await createMessage(userId, Number(receiverId), content.trim());
      io.to(`user:${receiverId}`).emit('receive_message', message);
      socket.emit('receive_message', message);
    });

    socket.on('typing', ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit('typing', { from: userId });
    });

    socket.on('disconnect', async () => {
      await removeOnlineUser(userId);
    });
  });

  return io;
};
