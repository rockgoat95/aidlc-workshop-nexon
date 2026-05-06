import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// Customer table login
router.post('/tables/login', authController.loginTable);

// Admin login
router.post('/admin/login', authController.loginAdmin);

export default router;
