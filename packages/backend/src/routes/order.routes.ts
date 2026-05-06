import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authMiddleware, adminOnly } from '../middlewares/auth';
import { registerSSEClient } from '../sse/order-channel';

const router = Router();
const orderController = new OrderController();

// Customer order routes
router.post('/orders', authMiddleware, orderController.create);
router.get('/orders', authMiddleware, orderController.getBySession);

// Admin order routes
router.get('/admin/orders', authMiddleware, adminOnly, orderController.listAdmin);
router.patch('/admin/orders/:id/status', authMiddleware, adminOnly, orderController.updateStatus);
router.delete('/admin/orders/:id', authMiddleware, adminOnly, orderController.remove);

// SSE stream for admin
router.get('/admin/orders/stream', authMiddleware, adminOnly, async (req, res) => {
  await registerSSEClient(req, res);
});

export default router;
