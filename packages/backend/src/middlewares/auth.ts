import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/app-error';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export interface AuthPayload {
  userId: string;
  role: 'customer' | 'admin';
  storeId: string;
  tableId?: string;
  sessionId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    throw new UnauthorizedError('Invalid token');
  }
}

export function adminOnly(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    throw new UnauthorizedError('Admin access required');
  }
  next();
}

export function generateToken(payload: AuthPayload, expiresIn = '16h'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}
