'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
// Rebuilding simple input and textarea directly to manage aesthetics perfectly
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui';

// ============================================================================
// Types
// ============================================================================

export interface ContactContent {
  title: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  location?: string;
}

interface ContactProps {
  content?: ContactContent;
  className?: string;
  id?: string;
}

// ============================================================================
// Validation Schema
// ============================================================================

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const, stiffness: 100, damping: 20
    },
  },
};

// ============================================================================
// Social Icons Component
// ============================================================================

const socialIcons = {
  github: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 1.699-4.919 4.92-.058 1.266-.057 1.645-.069 4.849zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 8.333.014 3.584.012 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  email: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

// ============================================================================
// Main Contact Section Component
// ============================================================================

const defaultContact: ContactContent = {
  title: 'Let\'s Discuss Your Next Idea',
  subtitle: 'Whether you have a specific project in mind or just want to explore possibilities, I\'m ready to listen.',
  email: 'contact@bolelahcorp.com',
  phone: '+62 812 3456 7890',
  location: 'Jakarta, Indonesia',
};

export function Contact({ content = defaultContact, className, id = 'contact' }: ContactProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || 'Message sent successfully!');
        reset();
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id={id} className={cn('section relative bg-navy/80 py-32 overflow-hidden', className)}>
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-coral/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-steel/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-12 gap-16 lg:gap-12 items-start">

          {/* Left: Content & Info */}
          <motion.div
            className="lg:col-span-5 flex flex-col justify-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, type: 'spring', damping: 20 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-coral/10 text-coral border border-coral/20 text-sm font-semibold tracking-wider uppercase mb-6 self-start">
              Initiate Contact
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-off-white mb-6 tracking-tight">
              {content.title}
            </h2>
            <div className="w-16 h-1 bg-coral/50 mb-8 rounded-full" />
            <p className="text-mist/80 text-lg font-light leading-relaxed mb-12">
              {content.subtitle}
            </p>

            {/* Aesthetic Info Cards */}
            <div className="space-y-4 mb-12">
              {content.email && (
                <div className="group flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-coral/30 hover:bg-white/10 transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-coral/10 flex items-center justify-center text-coral group-hover:scale-110 group-hover:bg-coral group-hover:text-white transition-all duration-300 shadow-inner overflow-hidden relative">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <div className="relative z-10">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-mist/60 text-xs font-bold uppercase tracking-widest mb-1">Email</h4>
                    <a href={`mailto:${content.email}`} className="text-off-white font-medium text-lg hover:text-coral transition-colors">{content.email}</a>
                  </div>
                </div>
              )}

              {content.location && (
                <div className="group flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-steel/50 hover:bg-white/10 transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-steel/10 flex items-center justify-center text-steel group-hover:scale-110 group-hover:bg-steel group-hover:text-white transition-all duration-300 shadow-inner overflow-hidden relative">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <div className="relative z-10">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-mist/60 text-xs font-bold uppercase tracking-widest mb-1">Location</h4>
                    <p className="text-off-white font-medium text-lg">{content.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Socials */}
            <div className="flex gap-4">
              <a href="https://instagram.com/bolelahcorp" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-mist hover:text-white hover:border-[#E4405F] hover:bg-[#E4405F]/20 hover:-translate-y-2 transition-all duration-300 shadow-lg block relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#E4405F] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">{socialIcons.instagram}</span>
              </a>
            </div>
          </motion.div>

          {/* Right: Glassmorphic Form */}
          <motion.div
            className="lg:col-span-7"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <div className="relative rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.4)] overflow-hidden">
              {/* Embedded Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-coral/30 blur-[60px]" />

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-bold uppercase tracking-widest text-mist mb-2 ml-1">
                      Name <span className="text-coral">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      {...register('name')}
                      className={cn(
                        "w-full bg-navy/50 border border-white/10 rounded-2xl px-5 py-4 text-off-white placeholder:text-mist/30 focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral transition-colors duration-300",
                        errors.name && 'border-coral/50'
                      )}
                    />
                    {errors.name && <p className="mt-2 text-xs text-coral ml-1">{errors.name.message}</p>}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-bold uppercase tracking-widest text-mist mb-2 ml-1">
                      Email <span className="text-coral">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      {...register('email')}
                      className={cn(
                        "w-full bg-navy/50 border border-white/10 rounded-2xl px-5 py-4 text-off-white placeholder:text-mist/30 focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral transition-colors duration-300",
                        errors.email && 'border-coral/50'
                      )}
                    />
                    {errors.email && <p className="mt-2 text-xs text-coral ml-1">{errors.email.message}</p>}
                  </motion.div>
                </div>

                {/* Subject */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-mist mb-2 ml-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Project Discussion"
                    {...register('subject')}
                    className="w-full bg-navy/50 border border-white/10 rounded-2xl px-5 py-4 text-off-white placeholder:text-mist/30 focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral transition-colors duration-300"
                  />
                </motion.div>

                {/* Message */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-mist mb-2 ml-1">
                    Message <span className="text-coral">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell me about your core ideas..."
                    {...register('message')}
                    className={cn(
                      "w-full bg-navy/50 border border-white/10 rounded-2xl px-5 py-4 text-off-white placeholder:text-mist/30 focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral transition-colors duration-300 resize-none",
                      errors.message && 'border-coral/50'
                    )}
                  />
                  {errors.message && <p className="mt-2 text-xs text-coral ml-1">{errors.message.message}</p>}
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full overflow-hidden rounded-2xl bg-coral px-8 py-5 font-bold text-white transition-all hover:bg-coral-dark shadow-[0_0_40px_rgba(230,57,70,0.3)] disabled:opacity-70"
                  >
                    <div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-12 -translate-x-[200%] group-hover:animate-[shimmer_1.5s_infinite]" />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isSubmitting ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          Send Transmission
                          <svg className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </motion.div>

                {/* Status Message */}
                {submitStatus === 'success' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium text-center">
                    {submitMessage}
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
