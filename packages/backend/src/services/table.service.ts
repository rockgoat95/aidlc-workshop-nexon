import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NotFoundError, ValidationError } from '../errors/app-error';
import { broadcastOrderEvent } from '../sse/order-channel';

const prisma = new PrismaClient();

export class TableService {
  async getTables(storeId: string) {
    return prisma.table.findMany({
      where: { storeId },
      include: {
        sessions: {
          where: { endedAt: null },
          include: {
            orders: { include: { items: true } },
          },
        },
      },
      orderBy: { tableNumber: 'asc' },
    });
  }

  async setupTable(storeId: string, tableNumber: number, password: string) {
    if (!tableNumber || !password) {
      throw new ValidationError('Table number and password are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const table = await prisma.table.upsert({
      where: { storeId_tableNumber: { storeId, tableNumber } },
      update: { password: hashedPassword },
      create: {
        storeId,
        tableNumber,
        password: hashedPassword,
      },
    });

    // Create new session (16 hours)
    const session = await prisma.tableSession.create({
      data: { tableId: table.id },
    });

    return { table, session };
  }

  async completeTable(tableId: string) {
    const table = await prisma.table.findUnique({ where: { id: tableId } });
    if (!table) throw new NotFoundError('Table not found');

    // End active session
    const activeSession = await prisma.tableSession.findFirst({
      where: { tableId, endedAt: null },
    });

    if (activeSession) {
      await prisma.tableSession.update({
        where: { id: activeSession.id },
        data: { endedAt: new Date() },
      });
    }

    broadcastOrderEvent({ type: 'table-completed', data: { tableId } });
  }

  async getTableHistory(tableId: string, startDate?: string, endDate?: string) {
    const where: any = {
      tableSession: {
        tableId,
        endedAt: { not: null },
      },
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    return prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
