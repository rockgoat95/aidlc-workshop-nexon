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

  // Create sample menus
  const menus = [
    { name: '김치찌개', price: 9000, description: '돼지고기와 묵은지로 끓인 얼큰한 찌개', categoryId: 'cat-1', imageUrl: 'https://picsum.photos/seed/kimchi-stew/400/300' },
    { name: '된장찌개', price: 8000, description: '두부와 야채가 듬뿍 들어간 구수한 찌개', categoryId: 'cat-1', imageUrl: 'https://picsum.photos/seed/doenjang/400/300' },
    { name: '제육볶음', price: 11000, description: '매콤달콤 양념에 볶은 돼지고기', categoryId: 'cat-1', imageUrl: 'https://picsum.photos/seed/jeyuk/400/300' },
    { name: '비빔밥', price: 9500, description: '신선한 나물과 고추장의 조화', categoryId: 'cat-1', imageUrl: 'https://picsum.photos/seed/bibimbap/400/300' },
    { name: '돈까스', price: 10000, description: '바삭한 수제 돈까스', categoryId: 'cat-1', imageUrl: 'https://picsum.photos/seed/tonkatsu/400/300' },
    { name: '계란말이', price: 5000, description: '부드러운 계란말이', categoryId: 'cat-2', imageUrl: 'https://picsum.photos/seed/egg-roll/400/300' },
    { name: '김치전', price: 6000, description: '바삭하게 부친 김치전', categoryId: 'cat-2', imageUrl: 'https://picsum.photos/seed/kimchi-pancake/400/300' },
    { name: '떡볶이', price: 5500, description: '매콤한 떡볶이', categoryId: 'cat-2', imageUrl: 'https://picsum.photos/seed/tteokbokki/400/300' },
    { name: '콜라', price: 2000, description: null, categoryId: 'cat-3', imageUrl: 'https://picsum.photos/seed/cola/400/300' },
    { name: '사이다', price: 2000, description: null, categoryId: 'cat-3', imageUrl: 'https://picsum.photos/seed/sprite/400/300' },
    { name: '맥주', price: 4000, description: '시원한 생맥주 500ml', categoryId: 'cat-3', imageUrl: 'https://picsum.photos/seed/beer/400/300' },
    { name: '소주', price: 4500, description: '참이슬 후레쉬', categoryId: 'cat-3', imageUrl: 'https://picsum.photos/seed/soju/400/300' },
  ];

  for (let i = 0; i < menus.length; i++) {
    await prisma.menu.upsert({
      where: { id: `menu-${i + 1}` },
      update: {},
      create: {
        id: `menu-${i + 1}`,
        storeId: store.id,
        categoryId: menus[i].categoryId,
        name: menus[i].name,
        price: menus[i].price,
        description: menus[i].description,
        imageUrl: menus[i].imageUrl,
        displayOrder: i,
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
