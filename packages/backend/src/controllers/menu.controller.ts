import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/menu.service';

const menuService = new MenuService();

export class MenuController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const categoryId = req.query.categoryId as string | undefined;
      const result = await menuService.getMenus(storeId, categoryId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async detail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const menu = await menuService.getMenuById(req.params.id);
      res.json({ menu });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const menu = await menuService.createMenu({ ...req.body, storeId });
      res.status(201).json({ menu });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const menu = await menuService.updateMenu(req.params.id, req.body);
      res.json({ menu });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await menuService.deleteMenu(req.params.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const menu = await menuService.updateDisplayOrder(req.params.id, req.body.displayOrder);
      res.json({ menu });
    } catch (error) {
      next(error);
    }
  }
}
