import { Router } from 'express';
import { MenuController } from '../controllers/menu.controller';
import { CategoryController } from '../controllers/category.controller';
import { authMiddleware, adminOnly } from '../middlewares/auth';

const router = Router();
const menuController = new MenuController();
const categoryController = new CategoryController();

// Customer menu routes (auth required)
router.get('/menus', authMiddleware, menuController.list);
router.get('/menus/:id', authMiddleware, menuController.detail);

// Admin menu routes
router.post('/admin/menus', authMiddleware, adminOnly, menuController.create);
router.put('/admin/menus/:id', authMiddleware, adminOnly, menuController.update);
router.delete('/admin/menus/:id', authMiddleware, adminOnly, menuController.remove);
router.patch('/admin/menus/:id/order', authMiddleware, adminOnly, menuController.updateOrder);

// Admin category routes
router.get('/admin/categories', authMiddleware, adminOnly, categoryController.list);
router.post('/admin/categories', authMiddleware, adminOnly, categoryController.create);
router.put('/admin/categories/:id', authMiddleware, adminOnly, categoryController.update);
router.delete('/admin/categories/:id', authMiddleware, adminOnly, categoryController.remove);

export default router;
