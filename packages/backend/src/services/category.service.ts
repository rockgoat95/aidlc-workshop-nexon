import { PrismaClient } from '@prisma/client';
import { NotFoundError, ValidationError } from '../errors/app-error';

const prisma = new PrismaClient();

export class CategoryService {
  async getCategories(storeId: string) {
    return prisma.category.findMany({
      where: { storeId },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async createCategory(data: { storeId: string; name: string; displayOrder?: number }) {
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError('Category name is required');
    }

    return prisma.category.create({
      data: {
        storeId: data.storeId,
        name: data.name,
        displayOrder: data.displayOrder || 0,
      },
    });
  }

  async updateCategory(id: string, data: { name?: string; displayOrder?: number }) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Category not found');

    return prisma.category.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      },
    });
  }

  async deleteCategory(id: string) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Category not found');

    await prisma.category.delete({ where: { id } });
  }
}
