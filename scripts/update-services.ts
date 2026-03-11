const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateServices() {
  try {
    // Check if services section exists
    const existing = await prisma.pageSection.findUnique({
      where: {
        page_section: {
          page: 'home',
          section: 'services',
        },
      },
    });

    const newContent = {
      title: 'Specialized Expertise',
      subtitle: 'Delivering end-to-end solutions that drive results and elevate user experiences.',
      items: [
        {
          icon: 'code',
          title: 'Fullstack Development',
          description: 'Architecting scalable applications with Next.js, React, and robust Node.js backends. Focus on clean code and performance.',
        },
        {
          icon: 'server',
          title: 'System Admin',
          description: 'Expert Linux server administration, security hardening, and server management for optimal uptime and performance.',
        },
        {
          icon: 'database',
          title: 'DevOps Development',
          description: 'Building CI/CD pipelines, Docker containerization, and automated deployment systems for streamlined development workflows.',
        },
        {
          icon: 'palette',
          title: 'Performance Optimization',
          description: 'Analyzing and optimizing application performance, database queries, and frontend load times for exceptional user experience.',
        },
      ],
    };

    if (existing) {
      // Update existing
      await prisma.pageSection.update({
        where: {
          page_section: {
            page: 'home',
            section: 'services',
          },
        },
        data: {
          content: newContent,
          enabled: true,
        },
      });
      console.log('✅ Services section updated in database');
    } else {
      // Create new
      await prisma.pageSection.create({
        data: {
          page: 'home',
          section: 'services',
          title: 'Services Section',
          content: newContent,
          enabled: true,
          order: 4,
        },
      });
      console.log('✅ Services section created in database');
    }

    // Verify
    const verify = await prisma.pageSection.findUnique({
      where: {
        page_section: {
          page: 'home',
          section: 'services',
        },
      },
    });
    console.log('\nCurrent content in database:');
    console.log(JSON.stringify(verify.content, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateServices();
