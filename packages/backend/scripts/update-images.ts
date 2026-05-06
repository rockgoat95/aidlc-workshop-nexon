import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const imageUrls: Record<string, string> = {
  'menu-1': 'https://picsum.photos/seed/kimchi-stew/400/300',
  'menu-2': 'https://picsum.photos/seed/doenjang/400/300',
  'menu-3': 'https://picsum.photos/seed/jeyuk/400/300',
  'menu-4': 'https://picsum.photos/seed/bibimbap/400/300',
  'menu-5': 'https://picsum.photos/seed/tonkatsu/400/300',
  'menu-6': 'https://picsum.photos/seed/egg-roll/400/300',
  'menu-7': 'https://picsum.photos/seed/kimchi-pancake/400/300',
  'menu-8': 'https://picsum.photos/seed/tteokbokki/400/300',
  'menu-9': 'https://picsum.photos/seed/cola/400/300',
  'menu-10': 'https://picsum.photos/seed/sprite/400/300',
  'menu-11': 'https://picsum.photos/seed/beer/400/300',
  'menu-12': 'https://picsum.photos/seed/soju/400/300',
};

async function main() {
  for (const [id, url] of Object.entries(imageUrls)) {
    await prisma.menu.update({
      where: { id },
      data: { imageUrl: url },
    });
  }
  console.log('Image URLs updated for all menus');
  await prisma.$disconnect();
}

main();
