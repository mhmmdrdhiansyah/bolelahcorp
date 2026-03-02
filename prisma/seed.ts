import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ============================
  // 1. Create Admin User
  // ============================
  const adminEmail = 'admin@bolelahcorp.com';
  const adminPassword = 'admin123'; // Change this in production!

  const hashedPassword = await hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Muhammad Ardhiansyah',
      password: hashedPassword,
      role: 'ADMIN',
      bio: 'Full-stack developer and portfolio owner',
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);
  console.log(`   Password: ${adminPassword}`);

  // ============================
  // 2. Create Categories
  // ============================
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: { name: 'Web Development', slug: 'web-development' },
    }),
    prisma.category.upsert({
      where: { slug: 'mobile-development' },
      update: {},
      create: { name: 'Mobile Development', slug: 'mobile-development' },
    }),
    prisma.category.upsert({
      where: { slug: 'ui-ux-design' },
      update: {},
      create: { name: 'UI/UX Design', slug: 'ui-ux-design' },
    }),
    prisma.category.upsert({
      where: { slug: 'devops' },
      update: {},
      create: { name: 'DevOps', slug: 'devops' },
    }),
    prisma.category.upsert({
      where: { slug: 'tutorial' },
      update: {},
      create: { name: 'Tutorial', slug: 'tutorial' },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // ============================
  // 3. Create Tags
  // ============================
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: { name: 'Next.js', slug: 'nextjs' },
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: { name: 'React', slug: 'react' },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: { name: 'TypeScript', slug: 'typescript' },
    }),
    prisma.tag.upsert({
      where: { slug: 'prisma' },
      update: {},
      create: { name: 'Prisma', slug: 'prisma' },
    }),
    prisma.tag.upsert({
      where: { slug: 'tailwindcss' },
      update: {},
      create: { name: 'Tailwind CSS', slug: 'tailwindcss' },
    }),
    prisma.tag.upsert({
      where: { slug: 'nodejs' },
      update: {},
      create: { name: 'Node.js', slug: 'nodejs' },
    }),
    prisma.tag.upsert({
      where: { slug: 'mysql' },
      update: {},
      create: { name: 'MySQL', slug: 'mysql' },
    }),
    prisma.tag.upsert({
      where: { slug: 'docker' },
      update: {},
      create: { name: 'Docker', slug: 'docker' },
    }),
  ]);

  console.log(`✅ Created ${tags.length} tags`);

  // ============================
  // 4. Create Sample Portfolios
  // ============================
  const portfolios = await Promise.all([
    prisma.portfolio.upsert({
      where: { slug: 'e-commerce-platform' },
      update: {},
      create: {
        title: 'E-Commerce Platform',
        slug: 'e-commerce-platform',
        description: 'Full-stack e-commerce platform with real-time inventory management and payment integration.',
        shortDesc: 'Modern e-commerce solution for online businesses.',
        coverImage: '/images/portfolio/ecommerce.jpg',
        images: ['/images/portfolio/ecommerce-1.jpg', '/images/portfolio/ecommerce-2.jpg'],
        technologies: ['Next.js', 'React', 'Prisma', 'MySQL', 'Stripe'],
        projectUrl: null,
        githubUrl: 'https://github.com/ardhiansyah/ecommerce',
        featured: true,
        order: 1,
        completedAt: new Date('2024-01-15'),
        authorId: admin.id,
      },
    }),
    prisma.portfolio.upsert({
      where: { slug: 'task-management-app' },
      update: {},
      create: {
        title: 'Task Management App',
        slug: 'task-management-app',
        description: 'Collaborative task management application with real-time updates and team collaboration features.',
        shortDesc: 'Project management tool for modern teams.',
        coverImage: '/images/portfolio/taskapp.jpg',
        images: ['/images/portfolio/taskapp-1.jpg'],
        technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Tailwind CSS'],
        projectUrl: 'https://taskapp.demo.com',
        githubUrl: 'https://github.com/ardhiansyah/taskapp',
        featured: true,
        order: 2,
        completedAt: new Date('2024-02-20'),
        authorId: admin.id,
      },
    }),
    prisma.portfolio.upsert({
      where: { slug: 'portfolio-website' },
      update: {},
      create: {
        title: 'Personal Portfolio Website',
        slug: 'portfolio-website',
        description: 'Modern portfolio and blog website with admin panel for content management.',
        shortDesc: 'This website! Built with Next.js and Prisma.',
        coverImage: '/images/portfolio/portfolio.jpg',
        images: ['/images/portfolio/portfolio-1.jpg', '/images/portfolio/portfolio-2.jpg'],
        technologies: ['Next.js', 'Prisma', 'MySQL', 'Tailwind CSS', 'Framer Motion'],
        projectUrl: null,
        githubUrl: 'https://github.com/ardhiansyah/portfolio',
        featured: true,
        order: 3,
        completedAt: new Date('2024-03-01'),
        authorId: admin.id,
      },
    }),
  ]);

  console.log(`✅ Created ${portfolios.length} portfolio items`);

  // ============================
  // 5. Create Sample Blog Posts
  // ============================
  const post1 = await prisma.post.upsert({
    where: { slug: 'getting-started-with-nextjs-14' },
    update: {},
    create: {
      title: 'Getting Started with Next.js 14 App Router',
      slug: 'getting-started-with-nextjs-14',
      excerpt: 'Learn the fundamentals of Next.js 14 App Router and how to build modern web applications.',
      content: `# Getting Started with Next.js 14

Next.js 14 introduced the App Router, a new way to build Next.js applications using React's latest features.

## What is the App Router?

The App Router is a new router that uses React Server Components by default...

## Key Features

- React Server Components
- Streaming and Suspense
- Built-in SEO
- Layouts and UI State
- And much more!

## Conclusion

Next.js 14 App Router is a powerful tool for building modern web applications...`,
      coverImage: '/images/blog/nextjs14.jpg',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: categories[0].id,
      metaTitle: 'Getting Started with Next.js 14',
      metaDescription: 'Learn the fundamentals of Next.js 14 App Router',
    },
  });

  const post2 = await prisma.post.upsert({
    where: { slug: 'prisma-best-practices' },
    update: {},
    create: {
      title: 'Prisma Best Practices for Production Apps',
      slug: 'prisma-best-practices',
      excerpt: 'Discover the best practices for using Prisma ORM in production applications.',
      content: `# Prisma Best Practices

Prisma is a powerful ORM that can help you build type-safe database access...

## Connection Pooling

One of the most important aspects of using Prisma in production is connection pooling...

## Performance Optimization

Learn how to optimize your Prisma queries...

## Conclusion

Following these best practices will help you build robust and scalable applications...`,
      coverImage: '/images/blog/prisma.jpg',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: categories[0].id,
      metaTitle: 'Prisma Best Practices for Production',
      metaDescription: 'Learn Prisma ORM best practices',
    },
  });

  // Add tags to posts
  await prisma.postTag.deleteMany({});
  await Promise.all([
    prisma.postTag.create({
      data: { postId: post1.id, tagId: tags[0].id },
    }),
    prisma.postTag.create({
      data: { postId: post1.id, tagId: tags[2].id },
    }),
    prisma.postTag.create({
      data: { postId: post2.id, tagId: tags[3].id },
    }),
  ]);

  console.log(`✅ Created 2 blog posts`);

  // ============================
  // 6. Create Page Sections
  // ============================
  const sections = [
    {
      page: 'home',
      section: 'hero',
      title: 'Hero Section',
      content: {
        headline: 'Building Digital Experiences',
        subheadline: 'Full-stack developer specializing in modern web technologies',
        ctaText: 'View Portfolio',
        ctaLink: '/portfolio',
        secondaryCtaText: 'Contact Me',
        secondaryCtaLink: '/contact',
      },
      enabled: true,
      order: 1,
    },
    {
      page: 'home',
      section: 'about',
      title: 'About Me',
      content: {
        name: 'Muhammad Ardhiansyah',
        role: 'Full-Stack Developer',
        bio: 'Passionate developer with 5+ years of experience in building web applications.',
        skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Prisma', 'MySQL'],
        avatar: '/images/avatar.jpg',
      },
      enabled: true,
      order: 2,
    },
    {
      page: 'home',
      section: 'services',
      title: 'Services',
      content: {
        items: [
          {
            icon: 'code',
            title: 'Web Development',
            description: 'Modern web apps with React and Next.js',
          },
          {
            icon: 'smartphone',
            title: 'Mobile Development',
            description: 'Cross-platform apps with React Native',
          },
          {
            icon: 'palette',
            title: 'UI/UX Design',
            description: 'Beautiful and functional interfaces',
          },
          {
            icon: 'server',
            title: 'Backend Development',
            description: 'Scalable APIs with Node.js and Prisma',
          },
        ],
      },
      enabled: true,
      order: 3,
    },
  ];

  for (const sectionData of sections) {
    const existing = await prisma.pageSection.findUnique({
      where: {
        page_section: {
          page: sectionData.page,
          section: sectionData.section,
        },
      },
    });

    if (!existing) {
      await prisma.pageSection.create({
        data: sectionData,
      });
    }
  }

  console.log(`✅ Created 3 page sections`);

  // ============================
  // 7. Create Site Settings
  // ============================
  await Promise.all([
    prisma.siteSetting.upsert({
      where: { key: 'site_name' },
      update: {},
      create: {
        key: 'site_name',
        value: 'Bolehah Corp',
      },
    }),
    prisma.siteSetting.upsert({
      where: { key: 'site_description' },
      update: {},
      create: {
        key: 'site_description',
        value: 'Professional portfolio and tech blog',
      },
    }),
    prisma.siteSetting.upsert({
      where: { key: 'seo_title' },
      update: {},
      create: {
        key: 'seo_title',
        value: 'Bolehah Corp - Portfolio & Blog',
      },
    }),
    prisma.siteSetting.upsert({
      where: { key: 'seo_description' },
      update: {},
      create: {
        key: 'seo_description',
        value: 'Professional portfolio and tech blog by Muhammad Ardhiansyah',
      },
    }),
    prisma.siteSetting.upsert({
      where: { key: 'social_links' },
      update: {},
      create: {
        key: 'social_links',
        value: {
          github: 'https://github.com/ardhiansyah',
          linkedin: 'https://linkedin.com/in/ardhiansyah',
          twitter: 'https://twitter.com/ardhiansyah',
          instagram: 'https://instagram.com/ardhiansyah',
        },
      },
    }),
    prisma.siteSetting.upsert({
      where: { key: 'contact_info' },
      update: {},
      create: {
        key: 'contact_info',
        value: {
          email: 'contact@bolelahcorp.com',
          phone: '+62 812 3456 7890',
          location: 'Jakarta, Indonesia',
        },
      },
    }),
  ]);

  console.log('✅ Created site settings');

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📝 Login credentials:');
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log('');
  console.log('⚠️  Remember to change the password in production!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
