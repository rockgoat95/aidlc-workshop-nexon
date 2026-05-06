import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  async loginTable(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId, tableNumber, password } = req.body;
      const result = await authService.loginTable(storeId, tableNumber, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async loginAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId, username, password } = req.body;
      const result = await authService.loginAdmin(storeId, username, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
