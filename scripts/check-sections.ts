const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSections() {
  try {
    const sections = await prisma.pageSection.findMany({
      select: {
        page: true,
        section: true,
        enabled: true,
      },
    });

    console.log('Page Sections in database:');
    console.log('─────────────────────────────────────────────────────────────────');
    sections.forEach((s) => {
      console.log(`${s.page}/${s.section} - enabled: ${s.enabled}`);
    });

    // Check testimonials
    const testimonials = await prisma.pageSection.findUnique({
      where: {
        page_section: {
          page: 'home',
          section: 'testimonials',
        },
      },
    });

    if (testimonials) {
      console.log('\n✅ Testimonials found in database');
      console.log('Content:', JSON.stringify(testimonials.content, null, 2).substring(0, 300) + '...');
    } else {
      console.log('\n❌ Testimonials NOT in database (using default values)');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSections();
