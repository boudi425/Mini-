import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { env } from '../config/env.js';

// Add unique JWT IDs to prevent re-issuing byte-identical tokens within the same second.
// Without this, a freshly logged-in token can match a previously blacklisted token.
export const generateAccessToken = (payload) =>
  jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessExpiry, jwtid: randomUUID() });

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiry, jwtid: randomUUID() });

export const verifyAccessToken = (token) => jwt.verify(token, env.jwt.accessSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, env.jwt.refreshSecret);

export const decodeWithoutVerify = (token) => jwt.decode(token);
