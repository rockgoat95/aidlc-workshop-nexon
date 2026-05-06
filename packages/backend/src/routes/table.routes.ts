import { Router } from 'express';
import { TableController } from '../controllers/table.controller';
import { authMiddleware, adminOnly } from '../middlewares/auth';

const router = Router();
const tableController = new TableController();

// Admin table routes
router.get('/admin/tables', authMiddleware, adminOnly, tableController.list);
router.post('/admin/tables/setup', authMiddleware, adminOnly, tableController.setup);
router.post('/admin/tables/:id/complete', authMiddleware, adminOnly, tableController.complete);
router.get('/admin/tables/:id/history', authMiddleware, adminOnly, tableController.history);

export default router;
