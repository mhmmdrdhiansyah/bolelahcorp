'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface AboutContent {
  name: string;
  role: string;
  bio: string;
  skills: string[];
  avatar: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  email?: string;
}

interface AboutProps {
  content?: AboutContent;
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut' as const,
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
      className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-steel/30 border border-mist/20 text-mist hover:bg-coral hover:text-off-white hover:border-coral hover:shadow-lg hover:shadow-coral/30 transition-all duration-300"
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
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
// Main Component (Client Component - only animations, no async)
// ============================================================================

export function About({ content, socialLinks, className, id = 'about' }: AboutProps) {
  // Default content if not provided (fallback)
  const defaultContent: AboutContent = {
    name: 'Muhammad Ardhiansyah',
    role: 'Full-Stack Developer',
    bio: 'Passionate developer with 5+ years of experience in building modern web applications. Love turning ideas into reality through clean code and creative solutions.',
    skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Prisma', 'MySQL', 'Tailwind CSS', 'Framer Motion'],
    avatar: '/images/avatar.jpg',
  };

  const defaultSocialLinks: SocialLinks = {
    github: 'https://github.com/ardhiansyah',
    linkedin: 'https://linkedin.com/in/ardhiansyah',
    twitter: 'https://twitter.com/ardhiansyah',
    instagram: 'https://instagram.com/ardhiansyah',
    email: 'mailto:contact@bolelahcorp.com',
  };

  const aboutContent = content || defaultContent;
  const social = socialLinks || defaultSocialLinks;

  return (
    <section
      id={id}
      className={cn('section relative', className)}
    >
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Avatar & Name */}
          <motion.div variants={itemVariants} className="relative">
            {/* Avatar Container */}
            <div className="relative mx-auto lg:mx-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              {/* Background Decorations */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-coral to-mist opacity-20 blur-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              />

              {/* Avatar Image */}
              <motion.div
                className="relative rounded-3xl overflow-hidden border-4 border-mist/20 shadow-2xl bg-steel/30"
                whileHover={{
                  scale: 1.05,
                  rotate: 2,
                  boxShadow: '0 25px 50px -12px rgba(230, 57, 70, 0.25)',
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              >
                {/* Placeholder for avatar - replace with actual image */}
                <div className="w-full h-full bg-gradient-to-br from-steel to-navy flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl lg:text-7xl font-bold text-coral mb-2">
                      {aboutContent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-mist/60 text-sm">Avatar</div>
                  </div>
                </div>
                {/* Remove this block and uncomment when using actual image: */}
                {/* <Image
                  src={aboutContent.avatar}
                  alt={aboutContent.name}
                  fill
                  className="object-cover"
                  priority
                /> */}
              </motion.div>

              {/* Status Badge */}
              <motion.div
                className="absolute -bottom-4 -right-4 lg:bottom-8 lg:-right-8 px-4 py-2 rounded-full bg-coral text-off-white text-sm font-semibold shadow-lg"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                Available for work
              </motion.div>
            </div>

            {/* Social Links - Mobile First */}
            <motion.div
              className="mt-8 flex justify-center gap-3 lg:hidden"
              variants={itemVariants}
            >
              {social.github && <SocialLink href={social.github} label="GitHub" icon={socialIcons.github} />}
              {social.linkedin && <SocialLink href={social.linkedin} label="LinkedIn" icon={socialIcons.linkedin} />}
              {social.twitter && <SocialLink href={social.twitter} label="Twitter" icon={socialIcons.twitter} />}
              {social.instagram && <SocialLink href={social.instagram} label="Instagram" icon={socialIcons.instagram} />}
            </motion.div>
          </motion.div>

          {/* Right: Info & Skills */}
          <motion.div
            variants={itemVariants}
            className="text-center lg:text-left"
          >
            {/* Section Label */}
            <motion.p
              variants={itemVariants}
              className="text-coral font-semibold mb-2"
            >
              ABOUT ME
            </motion.p>

            {/* Name */}
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-off-white mb-2"
            >
              {aboutContent.name}
            </motion.h2>

            {/* Role */}
            <motion.p
              variants={itemVariants}
              className="text-xl text-mist mb-6"
            >
              {aboutContent.role}
            </motion.p>

            {/* Bio */}
            <motion.p
              variants={itemVariants}
              className="text-mist/80 leading-relaxed mb-8"
            >
              {aboutContent.bio}
            </motion.p>

            {/* Skills */}
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-sm font-semibold text-mist/60 uppercase tracking-wider mb-4">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {aboutContent.skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    className="px-4 py-2 rounded-lg bg-steel/30 border border-mist/20 text-mist text-sm font-medium hover:bg-coral/20 hover:border-coral/50 hover:text-off-white transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.3,
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Social Links - Desktop Only */}
            <motion.div
              variants={itemVariants}
              className="hidden lg:flex gap-3"
            >
              {social.github && <SocialLink href={social.github} label="GitHub" icon={socialIcons.github} />}
              {social.linkedin && <SocialLink href={social.linkedin} label="LinkedIn" icon={socialIcons.linkedin} />}
              {social.twitter && <SocialLink href={social.twitter} label="Twitter" icon={socialIcons.twitter} />}
              {social.instagram && <SocialLink href={social.instagram} label="Instagram" icon={socialIcons.instagram} />}
              {social.email && <SocialLink href={social.email} label="Email" icon={socialIcons.email} />}
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants} className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-coral text-off-white font-semibold hover:bg-coral-dark hover:shadow-lg hover:shadow-coral/30 hover:-translate-y-1 transition-all duration-300"
              >
                Get In Touch
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
