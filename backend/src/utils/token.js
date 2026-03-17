import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generateAccessToken = (payload) => jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessExpiry });

export const generateRefreshToken = (payload) => jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiry });

export const verifyAccessToken = (token) => jwt.verify(token, env.jwt.accessSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, env.jwt.refreshSecret);

export const decodeWithoutVerify = (token) => jwt.decode(token);
