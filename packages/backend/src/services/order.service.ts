import { PrismaClient } from '@prisma/client';
import { NotFoundError, ValidationError, ConflictError } from '../errors/app-error';
import { broadcastOrderEvent } from '../sse/order-channel';

const prisma = new PrismaClient();

interface CreateOrderData {
  tableSessionId: string;
  items: { menuId: string; menuName: string; quantity: number; price: number }[];
  totalAmount: number;
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['PREPARING'],
  PREPARING: ['COMPLETED'],
  COMPLETED: [],
};

export class OrderService {
  async createOrder(data: CreateOrderData) {
    if (!data.items || data.items.length === 0) {
      throw new ValidationError('Order must have at least one item');
    }

    // Verify calculated total
    const calculatedTotal = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (calculatedTotal !== data.totalAmount) {
      throw new ValidationError('Total amount mismatch');
    }

    const orderNumber = this.generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        tableSessionId: data.tableSessionId,
        orderNumber,
        totalAmount: data.totalAmount,
        status: 'PENDING',
        items: {
          create: data.items.map((item) => ({
            menuId: item.menuId,
            menuName: item.menuName,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    // Broadcast SSE event
    broadcastOrderEvent({ type: 'new-order', data: order });

    return order;
  }

  async getOrdersBySession(sessionId: string) {
    return prisma.order.findMany({
      where: { tableSessionId: sessionId },
      include: { items: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getOrdersForAdmin(storeId: string, status?: string) {
    const where: any = {
      tableSession: {
        table: { storeId },
        endedAt: null,
      },
    };
    if (status) where.status = status;

    return prisma.order.findMany({
      where,
      include: {
        items: true,
        tableSession: { include: { table: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(id: string, newStatus: string) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundError('Order not found');

    const allowed = VALID_TRANSITIONS[order.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new ConflictError(
        `Cannot transition from ${order.status} to ${newStatus}`
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: newStatus },
      include: { items: true },
    });

    broadcastOrderEvent({
      type: 'order-status-changed',
      data: { orderId: id, status: newStatus },
    });

    return updated;
  }

  async deleteOrder(id: string) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundError('Order not found');

    await prisma.order.delete({ where: { id } });

    broadcastOrderEvent({ type: 'order-deleted', data: { orderId: id } });
  }

  private generateOrderNumber(): string {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${dateStr}-${random}`;
  }
}
