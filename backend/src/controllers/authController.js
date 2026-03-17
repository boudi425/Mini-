import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { createUser, findUserByEmail, findUserById } from '../services/userService.js';
import { blacklistToken } from '../services/redisService.js';
import { decodeWithoutVerify, generateAccessToken, generateRefreshToken } from '../utils/token.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: env.cookieSecure,
  path: '/api/auth'
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password || password.length < 6) {
      return res.status(400).json({ message: 'username, email and password(min 6 chars) are required' });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser({ username, email, password: hashedPassword });
    const user = await findUserById(userId);
    return res.status(201).json({ user });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Username or email already in use' });
    }
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { userId: user.id, username: user.username, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      accessToken,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.token;
    if (token) {
      const decoded = decodeWithoutVerify(token);
      const ttl = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 60;
      await blacklistToken(token, ttl);
    }

    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.decode(refreshToken);
      const ttl = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 60;
      await blacklistToken(refreshToken, ttl);
    }

    res.clearCookie('refreshToken', cookieOptions);
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    return next(error);
  }
};
