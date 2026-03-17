import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import followRoutes from './routes/followRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/follow', followRoutes);
  app.use('/api/messages', messageRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
