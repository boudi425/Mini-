import { isTokenBlacklisted } from '../services/redisService.js';
import { verifyAccessToken } from '../utils/token.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Missing access token' });
  }

  if (await isTokenBlacklisted(token)) {
    return res.status(401).json({ message: 'Token is blacklisted' });
  }

  try {
    req.user = verifyAccessToken(token);
    req.token = token;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
};
