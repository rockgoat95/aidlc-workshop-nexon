import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create store
  const store = await prisma.store.upsert({
    where: { id: 'store-001' },
    update: {},
    create: {
      id: 'store-001',
      name: '맛있는 식당',
    },
  });

  // Create admin account
  const hashedPassword = await bcrypt.hash('admin1234', 10);
  await prisma.admin.upsert({
    where: { storeId_username: { storeId: store.id, username: 'admin' } },
    update: {},
    create: {
      storeId: store.id,
      username: 'admin',
      password: hashedPassword,
    },
  });

  // Create sample categories
  const categories = ['메인 메뉴', '사이드', '음료'];
  for (let i = 0; i < categories.length; i++) {
    await prisma.category.upsert({
      where: { id: `cat-${i + 1}` },
      update: {},
      create: {
        id: `cat-${i + 1}`,
        storeId: store.id,
        name: categories[i],
        displayOrder: i,
      },
    });
  }

  // Create sample tables
  for (let i = 1; i <= 5; i++) {
    const tablePassword = await bcrypt.hash(`table${i}`, 10);
    await prisma.table.upsert({
      where: { storeId_tableNumber: { storeId: store.id, tableNumber: i } },
      update: {},
      create: {
        storeId: store.id,
        tableNumber: i,
        password: tablePassword,
      },
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
