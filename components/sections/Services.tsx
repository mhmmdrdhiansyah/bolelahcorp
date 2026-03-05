'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MouseEvent } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

export interface ServicesContent {
  title: string;
  subtitle?: string;
  items: ServiceItem[];
}

interface ServicesProps {
  content?: ServicesContent;
  className?: string;
  id?: string;
}

// ============================================================================
// Icon Components (SVG)
// ============================================================================

interface IconProps {
  className?: string;
}

const icons: Record<string, React.FC<IconProps>> = {
  code: ({ className }: IconProps) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  palette: ({ className }: IconProps) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  database: ({ className }: IconProps) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  server: ({ className }: IconProps) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  ),
};

// ============================================================================
// Animation Variants
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20
    },
  },
};

// ============================================================================
// Service Card Component with Spotlight & Tilt
// ============================================================================

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const IconComponent = icons[service.icon] || icons.code;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      variants={itemVariants}
      className="h-full"
    >
      <div
        className="group relative h-full rounded-3xl border border-white/5 bg-white/5 hover:bg-white/10 p-8 transition-colors duration-500 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Spotlight Effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${mouseX}px ${mouseY}px,
                rgba(230, 57, 70, 0.15),
                transparent 80%
              )
            `,
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Icon Container - Glassmorphic */}
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-inner group-hover:scale-110 group-hover:bg-coral/10 group-hover:border-coral/20 transition-all duration-500">
            <IconComponent className="h-8 w-8 text-mist group-hover:text-coral transition-colors duration-500" />
          </div>

          <h3 className="mb-4 text-2xl font-bold text-off-white tracking-tight">
            {service.title}
          </h3>

          <p className="text-mist/70 leading-relaxed font-light flex-grow">
            {service.description}
          </p>

          <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-mist group-hover:text-coral transition-colors duration-300">
            <span>Learn more</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Services Section Component
// ============================================================================

const defaultServices: ServicesContent = {
  title: 'Specialized Expertise',
  subtitle: 'Delivering end-to-end solutions that drive results and elevate user experiences.',
  items: [
    {
      icon: 'code',
      title: 'Full-Stack Dev',
      description: 'Architecting scalable applications with Next.js, React, and robust Node.js backends. Focus on clean code and performance.',
    },
    {
      icon: 'palette',
      title: 'UI/UX Design',
      description: 'Crafting pixel-perfect, accessible, and highly interactive user interfaces using modern design systems and animations.',
    },
    {
      icon: 'database',
      title: 'Data Architecture',
      description: 'Designing secure, normalized database schemas with PostgreSQL/MySQL and integrating ORMs like Prisma.',
    },
    {
      icon: 'server',
      title: 'API Engineering',
      description: 'Building secure RESTful and GraphQL APIs with comprehensive documentation, type-safety, and rate limiting.',
    },
  ],
};

export function Services({ content = defaultServices, className, id = 'services' }: ServicesProps) {
  return (
    <section id={id} className={cn('section relative py-32 bg-navy', className)}>
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-coral/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-[-10%] w-[600px] h-[600px] bg-steel/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex flex-col items-center">
            <span className="text-coral text-sm font-bold tracking-[0.2em] uppercase mb-4">
              Capabilities
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-off-white mb-6 tracking-tight">
              {content.title}
            </h2>
            <div className="w-16 h-1 bg-coral/50 mb-8 rounded-full" />
            {content.subtitle && (
              <p className="text-mist/80 text-lg md:text-xl font-light leading-relaxed">
                {content.subtitle}
              </p>
            )}
          </div>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {content.items.map((service, index) => (
            <ServiceCard key={`${service.icon}-${index}`} service={service} index={index} />
          ))}
        </motion.div>

        {/* Decorative Divider */}
        <div className="mt-32 w-full max-w-4xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-mist/20 to-transparent" />
      </div>
    </section>
  );
}
