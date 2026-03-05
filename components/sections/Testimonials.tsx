'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

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
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20
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
    <div className={cn('flex gap-1.5', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn(
            'w-4 h-4 md:w-5 md:h-5 transition-transform hover:scale-125',
            star <= rating ? 'text-coral drop-shadow-[0_0_8px_rgba(230,57,70,0.8)]' : 'text-mist/20'
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
// Testimonial Card Component (Modernized Carousel Item)
// ============================================================================

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive: boolean;
  onClick: () => void;
}

function TestimonialCard({ testimonial, isActive, onClick }: TestimonialCardProps) {
  const initials = testimonial.name.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-[2.5rem] p-8 md:p-12 transition-all duration-700 cursor-pointer h-full flex flex-col justify-between overflow-hidden",
        isActive
          ? "bg-white/10 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] scale-100 opacity-100 z-10"
          : "bg-white/5 border border-white/5 opacity-40 scale-90 hover:opacity-70 z-0"
      )}
    >
      {/* Glow behind active card */}
      {isActive && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-coral/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      )}

      {/* Quote Icon */}
      <div className="mb-8">
        <svg
          className={cn(
            "w-12 h-12 transition-colors duration-500",
            isActive ? "text-coral/50" : "text-mist/20"
          )}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* Content */}
      <p className={cn(
        "text-lg md:text-2xl font-light leading-relaxed mb-10 transition-colors duration-500 italic flex-grow",
        isActive ? "text-off-white" : "text-mist"
      )}>
        "{testimonial.content}"
      </p>

      {/* Bottom Row */}
      <div className="flex items-center justify-between border-t border-white/10 pt-8">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 overflow-hidden transition-all duration-500",
            isActive ? "border-coral text-off-white bg-gradient-to-br from-navy to-steel" : "border-mist/20 text-mist bg-navy"
          )}>
            {testimonial.avatar ? (
              <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
            ) : initials}
          </div>

          <div>
            <h4 className={cn(
              "font-bold text-lg transition-colors duration-500",
              isActive ? "text-off-white" : "text-mist"
            )}>
              {testimonial.name}
            </h4>
            <p className="text-mist/60 text-sm font-medium tracking-wide">
              {testimonial.role} <span className={isActive ? "text-coral/80" : ""}>@ {testimonial.company}</span>
            </p>
          </div>
        </div>

        {testimonial.rating && (
          <div className="hidden sm:block">
            <StarRating rating={testimonial.rating} />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Default Content
// ============================================================================

const defaultTestimonials: TestimonialsContent = {
  title: 'Client Sentiments',
  subtitle: 'Partnering with visionary teams to build exceptional digital products.',
  items: [
    {
      name: 'Sarah Johnson',
      role: 'VP Product',
      company: 'TechStart',
      content: 'Incredibly rare to find someone who deeply understands both the architecture and the aesthetic layer. Delivered ahead of schedule with zero compromises on quality.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Founder',
      company: 'Digital Solutions',
      content: 'Transformed our legacy monolithic system into a blazing fast, beautifully animated Next.js platform. Our user engagement shot up by 40% in the first month.',
      rating: 5,
    },
    {
      name: 'Emily Davis',
      role: 'Engineering Lead',
      company: 'Innovate Labs',
      content: 'A true professional. Outstanding problem-solving skills, highly communicative, and wrote some of the cleanest, most maintainable code I\'ve reviewed this year.',
      rating: 5,
    },
  ],
};

// ============================================================================
// Testimonials Section Component
// ============================================================================

export function Testimonials({ content = defaultTestimonials, className, id = 'testimonials' }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto rotate 
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % content.items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [content.items.length]);

  return (
    <section id={id} className={cn('section relative bg-navy py-32 overflow-hidden', className)}>
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-coral/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-steel/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 items-center lg:items-stretch">
          {/* Left Header Column */}
          <motion.div
            className="w-full lg:w-1/3 flex flex-col justify-center text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, type: 'spring', damping: 20 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-coral/10 text-coral border border-coral/20 text-sm font-semibold tracking-wider uppercase mb-6 self-center lg:self-start">
              Endorsements
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-off-white mb-6 tracking-tight">
              Trusted By Industry Leaders.
            </h2>
            <div className="w-16 h-1 bg-coral/50 mb-6 rounded-full mx-auto lg:mx-0" />
            <p className="text-mist/80 text-lg font-light leading-relaxed mb-10">
              {content.subtitle}
            </p>

            {/* Navigation Dots */}
            <div className="flex justify-center lg:justify-start gap-3">
              {content.items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className="group relative w-16 h-2 rounded-full overflow-hidden bg-white/10"
                >
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-coral rounded-full"
                    initial={false}
                    animate={{ width: activeIndex === idx ? "100%" : "0%" }}
                    transition={{ duration: activeIndex === idx ? 6 : 0.3, ease: activeIndex === idx ? "linear" : "easeOut" }}
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right Interactive Carousel */}
          <motion.div
            className="w-full lg:w-2/3 relative h-[500px] md:h-[450px]"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {/* Simulated Stack/Carousel */}
            <div className="absolute inset-0 flex justify-center items-center">
              {content.items.map((item, idx) => {
                // Logic to position items relative to activeIndex
                let offset = idx - activeIndex;
                if (offset < -1) offset += content.items.length;
                if (offset > 1) offset -= content.items.length;

                // Only render adjacent ones and active
                if (Math.abs(offset) > 1) return null;

                const isActive = offset === 0;

                return (
                  <motion.div
                    key={idx}
                    className="absolute inset-0 w-full lg:max-w-2xl mx-auto"
                    initial={false}
                    animate={{
                      x: offset * 40,
                      y: Math.abs(offset) * 20,
                      scale: isActive ? 1 : 0.9,
                      zIndex: isActive ? 10 : 0,
                      opacity: isActive ? 1 : 0.5
                    }}
                    transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
                  >
                    <TestimonialCard
                      testimonial={item}
                      isActive={isActive}
                      onClick={() => setActiveIndex(idx)}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
