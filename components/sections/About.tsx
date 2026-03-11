'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  foundedYear: number;
  experience: string;
  services: string[];
  technologies: string[];
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  email?: string;
}

interface AboutProps {
  content?: CompanyInfo;
  socialLinks?: SocialLinks;
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
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// ============================================================================
// Social Link Component
// ============================================================================

interface SocialLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function SocialLink({ href, label, icon }: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-mist hover:text-off-white hover:border-coral/50 transition-all duration-300 overflow-hidden"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-coral/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
      <span className="relative z-10">{icon}</span>
    </motion.a>
  );
}

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
// Experience Badge Component
// ============================================================================

interface ExperienceBadgeProps {
  years: string;
  label: string;
}

function ExperienceBadge({ years, label }: ExperienceBadgeProps) {
  return (
    <motion.div
      className="relative inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-coral/20 to-steel/20 backdrop-blur-xl border border-white/10 shadow-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <div className="flex items-baseline gap-1">
        <span className="text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-coral to-coral/60">
          {years}
        </span>
        <span className="text-2xl text-coral font-semibold">+</span>
      </div>
      <div className="text-left">
        <p className="text-off-white font-semibold text-lg">{label}</p>
        <p className="text-mist/60 text-sm">Of Excellence</p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Service Card Component
// ============================================================================

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

function ServiceCard({ icon, title, description, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-coral/20 flex items-center justify-center text-coral">
          {icon}
        </div>
        <div>
          <h4 className="text-off-white font-semibold mb-2">{title}</h4>
          <p className="text-mist/70 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Main Component (Client Component)
// ============================================================================

export function About({ content, socialLinks, className, id = 'about' }: AboutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const logoY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Default company content
  const defaultContent: CompanyInfo = {
    name: 'Bolehah Corp',
    tagline: 'Your Trusted Technology Partner',
    description: 'Bolehah Corp is an IT company with over 5 years of experience in delivering innovative digital solutions. We specialize in building modern web applications using cutting-edge technologies like WordPress, PHP, and Next.js. Our team of full-stack developers creates robust, scalable, and high-performance websites and admin systems tailored to your business needs.',
    foundedYear: 2020,
    experience: '5',
    services: [
      'Custom Website Development',
      'Admin Panel & Dashboard',
      'System Architecture & Integration',
      'Performance Optimization',
    ],
    technologies: [
      'WordPress',
      'PHP',
      'Next.js',
      'React',
      'Node.js',
      'MySQL',
      'PostgreSQL',
      'Linux',
      'Docker',
      'Git',
      'TypeScript',
      'Tailwind CSS',
      'REST API',
      'DevOps',
    ],
  };

  const defaultSocialLinks: SocialLinks = {
    instagram: 'https://instagram.com/bolelahcorp',
  };

  const companyContent = content || defaultContent;
  const social = socialLinks || defaultSocialLinks;

  return (
    <section
      ref={containerRef}
      id={id}
      className={cn('section relative py-32 bg-navy', className)}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-steel/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-coral/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        className="container px-4 sm:px-6 z-10 relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left: Company Logo & Experience Badge */}
          <motion.div variants={itemVariants} className="lg:col-span-5 relative">
            <motion.div
              className="relative mx-auto lg:mx-0 w-72 h-72 sm:w-96 sm:h-96"
              style={{ y: logoY }}
            >
              {/* Background Glow */}
              <motion.div
                className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-coral to-mist opacity-20 blur-[60px]"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 180, 270, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Company Logo Frame */}
              <div className="relative h-full w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] bg-navy/80 backdrop-blur-md">
                <div className="w-full h-full bg-gradient-to-br from-steel/30 to-navy flex items-center justify-center relative overflow-hidden p-8">
                  <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')] bg-center bg-cover" />

                  <motion.div
                    className="relative z-10 w-full h-full flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring" as const, stiffness: 200, damping: 10 }}
                  >
                    <Image
                      src="/images/static/Logo.png"
                      alt="Bolehah Corp Logo"
                      width={300}
                      height={300}
                      className="object-contain w-full h-full"
                      priority
                    />
                  </motion.div>
                </div>
              </div>

              {/* Experience Badge */}
              <motion.div
                className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 z-20"
                animate={{
                  y: [-3, 3, -3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <ExperienceBadge years={companyContent.experience} label="Years Experience" />
              </motion.div>
            </motion.div>

            {/* Social Links - Mobile */}
            <motion.div
              className="mt-16 flex justify-center gap-4 lg:hidden relative z-20"
              variants={itemVariants}
            >
              {social.instagram && <SocialLink href={social.instagram} label="Instagram" icon={socialIcons.instagram} />}
            </motion.div>
          </motion.div>

          {/* Right: Company Info */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 text-center lg:text-left pt-10 lg:pt-0"
          >
            {/* Section Label */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 border border-coral/20 text-coral text-sm font-semibold tracking-wider uppercase mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-coral" />
              About Us
            </motion.div>

            {/* Company Name */}
            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-off-white mb-4 tracking-tight"
            >
              {companyContent.name}
            </motion.h2>

            {/* Tagline */}
            <motion.h3
              variants={itemVariants}
              className="text-2xl lg:text-3xl text-gradient bg-gradient-to-r from-mist to-steel bg-clip-text text-transparent font-medium mb-6"
            >
              {companyContent.tagline}
            </motion.h3>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-mist/80 leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0 font-light"
            >
              {companyContent.description}
            </motion.p>

            {/* Services Cards */}
            <motion.div variants={itemVariants} className="mb-10">
              <h4 className="text-sm font-semibold text-mist/50 uppercase tracking-[0.2em] mb-4">
                What We Do
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <ServiceCard
                  index={0}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  }
                  title="Full-Stack Development"
                  description="WordPress, PHP & Next.js solutions"
                />
                <ServiceCard
                  index={1}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  }
                  title="Admin Systems"
                  description="Custom dashboard & backend integration"
                />
                <ServiceCard
                  index={2}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  }
                  title="DevOps & Deployment"
                  description="Docker, Linux, CI/CD pipeline"
                />
                <ServiceCard
                  index={3}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  }
                  title="Performance Optimization"
                  description="Speed & scalability experts"
                />
              </div>
            </motion.div>

            {/* Technologies */}
            <motion.div variants={itemVariants} className="mb-12">
              <h4 className="text-sm font-semibold text-mist/50 uppercase tracking-[0.2em] mb-4">
                Our Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                {(companyContent.technologies || []).map((tech, index) => (
                  <motion.div
                    key={tech}
                    className="relative group px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-mist text-sm font-medium hover:text-off-white hover:border-coral/30 transition-all duration-300 cursor-default"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.03,
                      duration: 0.3,
                    }}
                    whileHover={{ y: -3 }}
                  >
                    <span className="relative z-10">{tech}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Bottom Actions Row */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-6 lg:gap-8 justify-center lg:justify-start"
            >
              {/* CTA Button */}
              <Link
                href="/#contact"
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-coral text-off-white font-semibold shadow-lg shadow-coral/20 hover:shadow-coral/40 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Project
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>

              {/* Social Links - Desktop Only */}
              <div className="hidden lg:flex gap-3">
                {social.instagram && <SocialLink href={social.instagram} label="Instagram" icon={socialIcons.instagram} />}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
