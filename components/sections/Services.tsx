'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  ),
  smartphone: ({ className }: IconProps) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  ),
  palette: ({ className }: IconProps) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
    </svg>
  ),
  database: ({ className }: IconProps) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
      />
    </svg>
  ),
  server: ({ className }: IconProps) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
      />
    </svg>
  ),
  globe: ({ className }: IconProps) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
      />
    </svg>
  ),
  zap: ({ className }: IconProps) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
  layers: ({ className }: IconProps) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
      />
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
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

// ============================================================================
// Service Card Component
// ============================================================================

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const IconComponent = icons[service.icon] || icons.code;

  return (
    <motion.div
      variants={itemVariants}
      className="group relative"
    >
      <motion.div
        className="card card-hover h-full p-8 rounded-2xl bg-steel/20 border border-mist/10 backdrop-blur-sm"
        whileHover={{
          y: -8,
          transition: { duration: 0.3, ease: 'easeOut' },
        }}
      >
        {/* Icon Container */}
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral/20 to-coral/5 border border-coral/20 flex items-center justify-center mb-6 text-coral group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500"
          whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
        >
          <IconComponent className="w-8 h-8" />
        </motion.div>

        {/* Service Title */}
        <h3 className="text-xl font-bold text-off-white mb-3 group-hover:text-coral transition-colors duration-300">
          {service.title}
        </h3>

        {/* Service Description */}
        <p className="text-mist/70 leading-relaxed">
          {service.description}
        </p>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-coral/30 group-hover:bg-coral group-hover:scale-150 transition-all duration-300" />
        <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-mist/20 group-hover:bg-mist/50 group-hover:scale-150 transition-all duration-300" />
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// Services Section Component
// ============================================================================

const defaultServices: ServicesContent = {
  title: 'Services',
  subtitle: 'What I can do for you',
  items: [
    {
      icon: 'code',
      title: 'Full-Stack Development',
      description: 'Building modern web applications with React, Next.js, and Node.js from concept to deployment.',
    },
    {
      icon: 'palette',
      title: 'UI/UX Design',
      description: 'Creating beautiful, intuitive interfaces with focus on user experience and modern design principles.',
    },
    {
      icon: 'database',
      title: 'Database Design',
      description: 'Designing efficient database schemas with MySQL, PostgreSQL, and optimizing query performance.',
    },
    {
      icon: 'server',
      title: 'API Development',
      description: 'Building robust RESTful and GraphQL APIs with proper authentication, validation, and documentation.',
    },
  ],
};

export function Services({ content = defaultServices, className, id = 'services' }: ServicesProps) {
  return (
    <section id={id} className={cn('section relative bg-navy py-24 overflow-hidden', className)}>
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-coral/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-steel/10 rounded-full filter blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-coral/10 text-coral border border-coral/20 text-sm font-semibold tracking-wider uppercase mb-4">
            Services
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-off-white mb-4 tracking-tight">
            {content.title || 'What I Do'}
          </h2>
          {content.subtitle && (
            <p className="text-mist text-lg">
              {content.subtitle}
            </p>
          )}
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {content.items.map((service, index) => (
            <ServiceCard key={`${service.icon}-${index}`} service={service} index={index} />
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-mist/60 text-sm mb-4">
            Need something custom? Let's discuss your project.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-coral text-off-white font-semibold hover:bg-coral/90 hover:shadow-lg hover:shadow-coral/30 hover:-translate-y-1 transition-all duration-300"
          >
            Get In Touch
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
