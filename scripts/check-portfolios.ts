const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPortfolios() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        featured: true,
        order: true,
        coverImage: true,
      },
    });

    console.log('Total portfolios:', portfolios.length);
    console.log('Featured portfolios:', portfolios.filter(p => p.featured === true).length);
    console.log('\nPortfolio List:');
    console.log('─────────────────────────────────────────────────────────────────');
    portfolios.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Featured: ${p.featured} (type: ${typeof p.featured})`);
      console.log(`   Order: ${p.order}`);
      console.log(`   Cover: ${p.coverImage ? 'Yes' : 'No'}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkPortfolios();
