import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';

const orderService = new OrderService();

export class OrderController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.user?.sessionId;
      if (!sessionId) {
        res.status(400).json({ error: 'Session ID is required. Please login first.' });
        return;
      }
      const { items, totalAmount } = req.body;
      const order = await orderService.createOrder({
        tableSessionId: sessionId,
        items,
        totalAmount,
      });
      res.status(201).json({ order, orderNumber: order.orderNumber });
    } catch (error) {
      next(error);
    }
  }

  async getBySession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.query.sessionId as string || req.user!.sessionId!;
      const orders = await orderService.getOrdersBySession(sessionId);
      res.json({ orders });
    } catch (error) {
      next(error);
    }
  }

  // Admin endpoints
  async listAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const status = req.query.status as string | undefined;
      const orders = await orderService.getOrdersForAdmin(storeId, status);
      res.json({ orders });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const order = await orderService.updateOrderStatus(req.params.id, status);
      res.json({ order });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await orderService.deleteOrder(req.params.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}
