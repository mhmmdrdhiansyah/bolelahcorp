# Database Schema & Structure

## Overview

Database untuk Bolehah Corp menggunakan MySQL 8.0+ dengan Prisma ORM. Schema dirancang untuk mendukung:

- Portfolio management
- Blog dengan kategori & tags
- Admin authentication
- CMS untuk page sections
- Contact form submissions

## ER Diagram

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   users     │───────│  portfolios  │       │  categories │
│─────────────│ 1   N │──────────────│ 1   N │─────────────│
│ id (PK)     │       │ id (PK)      │       │ id (PK)     │
│ email       │       │ author_id    │       │ name        │
│ password    │       │ title        │       └─────────────┘
│ role        │       │ slug         │              │
└─────────────┘       │ technologies │              │ 1
       │              └──────────────┘              │
       │ 1                                           │ N
       │                                              │
       │ N                                     ┌──────────────┐
       │                                      │ blog_posts   │
       │                                      │──────────────│
       │                                      │ id (PK)      │
       │                                      │ author_id    │
       │                                      │ category_id  │
       │                                      └──────────────┘
       │                                              │
       │                                              │ N
       │                                              │
       │                                       ┌──────────────┐
       │                                       │   post_tags  │
       │                                       │──────────────│
       │                                       │ post_id (PK) │
       └───────────────────────────────────────│ tag_id (PK)  │
                                               └──────────────┘
                                                      │
                                                      │ N
                                                      │
                                               ┌──────────────┐
                                               │    tags      │
                                               │──────────────│
                                               │ id (PK)      │
                                               │ name         │
                                               └──────────────┘
```

## Complete Schema

### users table

```sql
CREATE TABLE users (
  id CHAR(25) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  role ENUM('ADMIN', 'USER') DEFAULT 'USER',
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### blog_posts table

```sql
CREATE TABLE blog_posts (
  id CHAR(25) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image VARCHAR(255),
  status ENUM('DRAFT', 'PUBLISHED', 'SCHEDULED') DEFAULT 'DRAFT',
  published_at TIMESTAMP NULL,
  scheduled_at TIMESTAMP NULL,

  -- SEO fields
  meta_title VARCHAR(255),
  meta_description TEXT,
  og_image VARCHAR(255),

  -- Stats
  views INT DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Foreign keys
  author_id CHAR(25) NOT NULL,
  category_id CHAR(25) NULL,

  CONSTRAINT fk_posts_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_posts_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,

  INDEX idx_status_published (status, published_at DESC),
  INDEX idx_slug (slug),
  INDEX idx_author (author_id),
  INDEX idx_category (category_id),
  FULLTEXT INDEX ft_search (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### categories table

```sql
CREATE TABLE categories (
  id CHAR(25) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### tags table

```sql
CREATE TABLE tags (
  id CHAR(25) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,

  INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### post_tags table (Junction)

```sql
CREATE TABLE post_tags (
  post_id CHAR(25) NOT NULL,
  tag_id CHAR(25) NOT NULL,
  PRIMARY KEY (post_id, tag_id),

  CONSTRAINT fk_pt_post FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_pt_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,

  INDEX idx_post (post_id),
  INDEX idx_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### portfolios table

```sql
CREATE TABLE portfolios (
  id CHAR(25) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_desc TEXT,
  cover_image VARCHAR(255) NOT NULL,
  images JSON,                    -- Array of {url, caption}
  technologies JSON,              -- Array of strings
  project_url VARCHAR(255),
  github_url VARCHAR(255),
  featured BOOLEAN DEFAULT FALSE,
  order INT DEFAULT 0,
  completed_at TIMESTAMP NULL,

  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Foreign key
  author_id CHAR(25) NOT NULL,

  CONSTRAINT fk_portfolios_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_featured_order (featured, order),
  INDEX idx_slug (slug),
  INDEX idx_author (author_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### page_sections table

```sql
CREATE TABLE page_sections (
  id CHAR(25) PRIMARY KEY,
  page VARCHAR(255) NOT NULL,      -- 'home', 'about', 'contact'
  section VARCHAR(255) NOT NULL,   -- 'hero', 'about', 'services'
  title VARCHAR(255) NOT NULL,
  content JSON NOT NULL,           -- Flexible content structure
  enabled BOOLEAN DEFAULT TRUE,
  order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY unique_page_section (page, section),
  INDEX idx_page_enabled (page, enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### site_settings table

```sql
CREATE TABLE site_settings (
  id CHAR(25) PRIMARY KEY,
  `key` VARCHAR(255) UNIQUE NOT NULL,
  value JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### contact_submissions table

```sql
CREATE TABLE contact_submissions (
  id CHAR(25) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  replied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_read_created (read, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Sample Data

### Initial Admin User

```sql
-- Password: 'admin123' (hashed with bcrypt)
INSERT INTO users (id, email, name, password, role)
VALUES (
  'clm1234567890abcdefghij',
  'admin@bolelahcorp.com',
  'Muhammad Ardhiansyah',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYpWyMWtOVG',
  'ADMIN'
);
```

### Sample Categories

```sql
INSERT INTO categories (id, name, slug) VALUES
  ('cat1', 'Web Development', 'web-development'),
  ('cat2', 'Mobile Development', 'mobile-development'),
  ('cat3', 'UI/UX Design', 'ui-ux-design'),
  ('cat4', 'DevOps', 'devops'),
  ('cat5', 'Tutorial', 'tutorial');
```

### Sample Tags

```sql
INSERT INTO tags (id, name, slug) VALUES
  ('tag1', 'Next.js', 'nextjs'),
  ('tag2', 'React', 'react'),
  ('tag3', 'TypeScript', 'typescript'),
  ('tag4', 'Prisma', 'prisma'),
  ('tag5', 'Tailwind CSS', 'tailwindcss'),
  ('tag6', 'Node.js', 'nodejs'),
  ('tag7', 'MySQL', 'mysql'),
  ('tag8', 'Docker', 'docker');
```

### Sample Site Settings

```sql
INSERT INTO site_settings (id, `key`, value) VALUES
  ('st1', 'site_name', '"Bolehah Corp"'),
  ('st2', 'site_description', '"Professional portfolio and tech blog"'),
  ('st3', 'seo_title', '"Bolehah Corp - Portfolio & Blog"'),
  ('st4', 'seo_description', '"Professional portfolio and tech blog by Muhammad Ardhiansyah"'),
  ('st5', 'social_links', '{
    "github": "https://github.com/ardhiansyah",
    "linkedin": "https://linkedin.com/in/ardhiansyah",
    "twitter": "https://twitter.com/ardhiansyah"
  }'),
  ('st6', 'contact_info', '{
    "email": "contact@bolelahcorp.com",
    "phone": "+62 812 3456 7890",
    "location": "Jakarta, Indonesia"
  }');
```

## Page Sections Content Structure

### Home Page Sections

```json
// Hero Section
{
  "page": "home",
  "section": "hero",
  "title": "Hero Section",
  "content": {
    "headline": "Building Digital Experiences",
    "subheadline": "Full-stack developer specializing in modern web technologies",
    "cta_text": "View Portfolio",
    "cta_link": "/portfolio",
    "secondary_cta_text": "Contact Me",
    "secondary_cta_link": "/contact",
    "background_image": "/images/hero-bg.jpg"
  }
}

// About Section
{
  "page": "home",
  "section": "about",
  "title": "About Me",
  "content": {
    "name": "Muhammad Ardhiansyah",
    "role": "Full-Stack Developer",
    "bio": "Passionate developer with 5+ years of experience...",
    "skills": ["React", "Next.js", "Node.js", "MySQL", "Docker"],
    "avatar": "/images/avatar.jpg"
  }
}

// Services Section
{
  "page": "home",
  "section": "services",
  "title": "Services",
  "content": {
    "items": [
      {
        "icon": "code",
        "title": "Web Development",
        "description": "Modern web apps with React and Next.js"
      },
      {
        "icon": "smartphone",
        "title": "Mobile Development",
        "description": "Cross-platform apps with React Native"
      },
      {
        "icon": "palette",
        "title": "UI/UX Design",
        "description": "Beautiful and functional interfaces"
      }
    ]
  }
}
```

## Database Maintenance

### Backup Strategy

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mysql"
DB_NAME="bolelahcorp"

# Full backup
mysqldump -u root -p${MYSQL_PASSWORD} \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  ${DB_NAME} > ${BACKUP_DIR}/${DB_NAME}_${DATE}.sql

# Compress
gzip ${BACKUP_DIR}/${DB_NAME}_${DATE}.sql

# Keep last 30 days
find ${BACKUP_DIR} -name "${DB_NAME}_*.sql.gz" -mtime +30 -delete
```

### Restoration

```bash
# Restore from backup
gunzip < /backups/mysql/bolelahcorp_20240301.sql.gz | mysql -u root -p bolelahcorp

# Or with gunzip first
gunzip /backups/mysql/bolelahcorp_20240301.sql.gz
mysql -u root -p bolelahcorp < /backups/mysql/bolelahcorp_20240301.sql
```

### Migration Commands

```bash
# Generate migration from schema changes
npx prisma migrate dev --name describe_changes

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (dev only - destroys all data!)
npx prisma migrate reset

# Generate Prisma client after schema changes
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio
```

## Performance Tuning

### MySQL Configuration (my.cnf)

```ini
[mysqld]
# Connection settings
max_connections = 150
connect_timeout = 10
wait_timeout = 600
interactive_timeout = 600

# Buffer settings
innodb_buffer_pool_size = 512M
innodb_log_file_size = 128M
innodb_flush_log_at_trx_commit = 2

# Query cache (disabled in MySQL 8.0+, use application caching instead)
# query_cache_size = 64M
# query_cache_type = 1

# Slow query log
slow_query_log = 1
long_query_time = 2
slow_query_log_file = /var/log/mysql/slow-query.log

# Character set
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# InnoDB settings
innodb_file_per_table = 1
innodb_stats_on_metadata = 0
```

## Index Strategy

### Critical Indexes

```sql
-- Blog posts - main listing
CREATE INDEX idx_posts_listing ON blog_posts(status, published_at DESC, title, slug, excerpt, cover_image);

-- Blog posts - single post lookup
CREATE INDEX idx_posts_slug_author ON blog_posts(slug, author_id, category_id);

-- Portfolios - featured listing
CREATE INDEX idx_portfolios_featured ON portfolios(featured, `order`, completed_at DESC);

-- Contact - admin listing
CREATE INDEX idx_contact_admin ON contact_submissions(read, replied, created_at DESC);
```

## Security

### User Privileges

```sql
-- Application user (full access to app database)
CREATE USER 'bolelahcorp_app'@'%' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON bolelahcorp.* TO 'bolelahcorp_app'@'%';

-- Read-only user (for reporting/analytics)
CREATE USER 'bolelahcorp_read'@'%' IDENTIFIED BY 'secure_password';
GRANT SELECT ON bolelahcorp.* TO 'bolelahcorp_read'@'%';

-- Backup user
CREATE USER 'bolelahcorp_backup'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, LOCK TABLES, SHOW VIEW, EVENT, TRIGGER ON bolelahcorp.* TO 'bolelahcorp_backup'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;
```

## Resources

- [MySQL 8.0 Reference](https://dev.mysql.com/doc/refman/8.0/en/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Database Normalization](https://www.educative.io/blog/database-normalization)
