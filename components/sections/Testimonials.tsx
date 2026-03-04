'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
  rating?: number; // 1-5 stars
}

export interface TestimonialsContent {
  title: string;
  subtitle?: string;
  items: Testimonial[];
}

interface TestimonialsProps {
  content?: TestimonialsContent;
  className?: string;
  id?: string;
}

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
// Star Rating Component
// ============================================================================

interface StarRatingProps {
  rating: number;
  className?: string;
}

function StarRating({ rating, className }: StarRatingProps) {
  return (
    <div className={cn('flex gap-1', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn(
            'w-5 h-5',
            star <= rating ? 'text-coral' : 'text-mist/30'
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ============================================================================
// Testimonial Card Component
// ============================================================================

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  // Get initials for avatar placeholder
  const initials = testimonial.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      variants={itemVariants}
      className="group flex-shrink-0 w-full snap-start"
    >
      <motion.div
        className="card card-hover h-full p-8 rounded-2xl bg-steel/20 border border-mist/10 backdrop-blur-sm"
        whileHover={{
          y: -8,
          transition: { duration: 0.3, ease: 'easeOut' },
        }}
      >
        {/* Quote Icon */}
        <div className="mb-6">
          <svg
            className="w-10 h-10 text-coral/40"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Testimonial Content */}
        <p className="text-mist/90 leading-relaxed mb-6 text-sm sm:text-base">
          &ldquo;{testimonial.content}&rdquo;
        </p>

        {/* Star Rating */}
        {testimonial.rating && (
          <div className="mb-6">
            <StarRating rating={testimonial.rating} />
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-coral/30 to-steel/30 flex items-center justify-center text-off-white font-semibold text-sm border border-mist/20 group-hover:scale-110 transition-transform duration-300"
            whileHover={{ rotate: 5 }}
          >
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </motion.div>

          {/* Name & Role */}
          <div>
            <h4 className="text-off-white font-semibold text-base group-hover:text-coral transition-colors duration-300">
              {testimonial.name}
            </h4>
            <p className="text-mist/60 text-sm">
              {testimonial.role}
              {testimonial.company && (
                <span>
                  {' '}
                  @ {testimonial.company}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-coral/30 group-hover:bg-coral group-hover:scale-150 transition-all duration-300" />
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// Default Content
// ============================================================================

const defaultTestimonials: TestimonialsContent = {
  title: 'Client Testimonials',
  subtitle: 'What people say about working with me',
  items: [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      company: 'TechStart Inc.',
      content: 'Exceptional work on our web application. Delivered on time with great attention to detail. The code quality was outstanding and communication throughout the project was excellent.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      company: 'Digital Solutions',
      content: 'Highly skilled developer with deep understanding of modern web technologies. Transformed our legacy system into a cutting-edge platform. Highly recommend for any complex project.',
      rating: 5,
    },
    {
      name: 'Emily Davis',
      role: 'Founder',
      company: 'Creative Studio',
      content: 'Great communication throughout the project. The final result exceeded our expectations. True professional who knows how to deliver quality work while keeping clients informed at every step.',
      rating: 5,
    },
    {
      name: 'David Park',
      role: 'Engineering Lead',
      company: 'Innovate Labs',
      content: 'Incredible problem-solving skills and attention to detail. Delivered a robust solution that has significantly improved our workflow. A pleasure to work with.',
      rating: 5,
    },
  ],
};

// ============================================================================
// Testimonials Section Component
// ============================================================================

export function Testimonials({ content = defaultTestimonials, className, id = 'testimonials' }: TestimonialsProps) {
  return (
    <section id={id} className={cn('section relative bg-navy py-24 overflow-hidden', className)}>
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-coral/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-steel/10 rounded-full filter blur-3xl" />
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
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-off-white mb-4 tracking-tight">
            {content.title || 'Client Testimonials'}
          </h2>
          {content.subtitle && (
            <p className="text-mist text-lg">
              {content.subtitle}
            </p>
          )}
        </motion.div>

        {/* Testimonials Grid - Desktop */}
        <motion.div
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {content.items.map((testimonial, index) => (
            <TestimonialCard key={`${testimonial.name}-${index}`} testimonial={testimonial} index={index} />
          ))}
        </motion.div>

        {/* Testimonials Scroll - Mobile */}
        <motion.div
          className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
        >
          {content.items.map((testimonial, index) => (
            <div key={`${testimonial.name}-${index}`} className="snap-center shrink-0 w-[85vw] max-w-sm">
              <TestimonialCard testimonial={testimonial} index={index} />
            </div>
          ))}
        </motion.div>

        {/* Scroll Indicator - Mobile Only */}
        <motion.div
          className="md:hidden flex justify-center gap-2 mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {content.items.slice(0, 4).map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-mist/30"
            />
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
            Want to share your experience? Let's work together!
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-coral text-off-white font-semibold hover:bg-coral/90 hover:shadow-lg hover:shadow-coral/30 hover:-translate-y-1 transition-all duration-300"
          >
            Start a Project
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
