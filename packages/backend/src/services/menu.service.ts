import { PrismaClient } from '@prisma/client';
import { NotFoundError, ValidationError } from '../errors/app-error';

const prisma = new PrismaClient();

interface CreateMenuData {
  storeId: string;
  name: string;
  price: number;
  description?: string;
  categoryId: string;
  imageUrl?: string;
}

export class MenuService {
  async getMenus(storeId: string, categoryId?: string) {
    const where: any = { storeId };
    if (categoryId) where.categoryId = categoryId;

    const [menus, categories] = await Promise.all([
      prisma.menu.findMany({
        where,
        orderBy: { displayOrder: 'asc' },
        include: { category: true },
      }),
      prisma.category.findMany({
        where: { storeId },
        orderBy: { displayOrder: 'asc' },
      }),
    ]);

    return { menus, categories };
  }

  async getMenuById(id: string) {
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!menu) throw new NotFoundError('Menu not found');
    return menu;
  }

  async createMenu(data: CreateMenuData) {
    this.validateMenuData(data);

    return prisma.menu.create({
      data: {
        storeId: data.storeId,
        name: data.name,
        price: data.price,
        description: data.description || null,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl || null,
      },
    });
  }

  async updateMenu(id: string, data: Partial<CreateMenuData>) {
    const existing = await prisma.menu.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Menu not found');

    if (data.price !== undefined) {
      this.validatePrice(data.price);
    }

    return prisma.menu.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      },
    });
  }

  async deleteMenu(id: string) {
    const existing = await prisma.menu.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Menu not found');

    await prisma.menu.delete({ where: { id } });
  }

  async updateDisplayOrder(id: string, displayOrder: number) {
    const existing = await prisma.menu.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Menu not found');

    return prisma.menu.update({
      where: { id },
      data: { displayOrder },
    });
  }

  private validateMenuData(data: CreateMenuData) {
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError('Menu name is required');
    }
    this.validatePrice(data.price);
    if (!data.categoryId) {
      throw new ValidationError('Category is required');
    }
  }

  private validatePrice(price: number) {
    if (price === undefined || price === null) {
      throw new ValidationError('Price is required');
    }
    if (price < 0 || price > 1000000) {
      throw new ValidationError('Price must be between 0 and 1,000,000');
    }
  }
}
