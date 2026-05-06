import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';

const categoryService = new CategoryService();

export class CategoryController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const categories = await categoryService.getCategories(storeId);
      res.json({ categories });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const category = await categoryService.createCategory({ ...req.body, storeId });
      res.status(201).json({ category });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.body);
      res.json({ category });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await categoryService.deleteCategory(req.params.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}
