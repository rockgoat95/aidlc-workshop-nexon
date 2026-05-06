import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken, AuthPayload } from '../middlewares/auth';
import { UnauthorizedError, TooManyRequestsError, NotFoundError } from '../errors/app-error';

const prisma = new PrismaClient();

// Simple in-memory login attempt tracking
const loginAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export class AuthService {
  async loginTable(storeId: string, tableNumber: number, password: string) {
    const table = await prisma.table.findUnique({
      where: { storeId_tableNumber: { storeId, tableNumber } },
    });

    if (!table) {
      throw new NotFoundError('Table not found');
    }

    const isValid = await bcrypt.compare(password, table.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid password');
    }

    // Find or create active session
    let session = await prisma.tableSession.findFirst({
      where: { tableId: table.id, endedAt: null },
    });

    if (!session) {
      session = await prisma.tableSession.create({
        data: { tableId: table.id },
      });
    }

    const payload: AuthPayload = {
      userId: table.id,
      role: 'customer',
      storeId,
      tableId: table.id,
      sessionId: session.id,
    };

    const token = generateToken(payload);

    return {
      token,
      tableId: table.id,
      sessionId: session.id,
    };
  }

  async loginAdmin(storeId: string, username: string, password: string) {
    const key = `${storeId}:${username}`;
    this.checkLoginAttempts(key);

    const admin = await prisma.admin.findUnique({
      where: { storeId_username: { storeId, username } },
    });

    if (!admin) {
      this.recordFailedAttempt(key);
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      this.recordFailedAttempt(key);
      throw new UnauthorizedError('Invalid credentials');
    }

    // Reset attempts on success
    loginAttempts.delete(key);

    const payload: AuthPayload = {
      userId: admin.id,
      role: 'admin',
      storeId,
    };

    const token = generateToken(payload);

    return {
      token,
      admin: { id: admin.id, username: admin.username, storeId: admin.storeId },
    };
  }

  private checkLoginAttempts(key: string): void {
    const attempts = loginAttempts.get(key);
    if (!attempts) return;

    if (attempts.count >= MAX_ATTEMPTS) {
      const elapsed = Date.now() - attempts.lastAttempt;
      if (elapsed < LOCKOUT_DURATION) {
        throw new TooManyRequestsError('Too many login attempts. Please try again later.');
      }
      loginAttempts.delete(key);
    }
  }

  private recordFailedAttempt(key: string): void {
    const attempts = loginAttempts.get(key) || { count: 0, lastAttempt: 0 };
    attempts.count += 1;
    attempts.lastAttempt = Date.now();
    loginAttempts.set(key, attempts);
  }
}
