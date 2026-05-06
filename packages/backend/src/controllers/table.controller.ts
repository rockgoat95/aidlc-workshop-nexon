import { Request, Response, NextFunction } from 'express';
import { TableService } from '../services/table.service';

const tableService = new TableService();

export class TableController {
  async setup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tableNumber, password } = req.body;
      const storeId = req.user!.storeId;
      const result = await tableService.setupTable(storeId, tableNumber, password);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async complete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await tableService.completeTable(req.params.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async history(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const orders = await tableService.getTableHistory(
        req.params.id,
        startDate as string | undefined,
        endDate as string | undefined
      );
      res.json({ orders });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.user!.storeId;
      const tables = await tableService.getTables(storeId);
      res.json({ tables });
    } catch (error) {
      next(error);
    }
  }
}
