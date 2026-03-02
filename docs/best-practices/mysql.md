# MySQL Query Best Practices

## Connection Setup

### 1. Prisma Configuration

```bash
# .env file
DATABASE_URL="mysql://user:password@localhost:3306/bolelahcorp?schema=public&connection_limit=10&pool_timeout=20"

# Production example with pooling
DATABASE_URL="mysql://user:password@production-host:3306/bolelahcorp?connection_limit=10&pool_timeout=20&socket_timeout=5"
```

### 2. Direct MySQL Connection (if needed)

```ts
// lib/mysql.ts
import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE || 'bolelahcorp',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    })
  }
  return pool
}

async function query(sql: string, params?: any[]) {
  const pool = getPool()
  const [rows] = await pool.execute(sql, params)
  return rows
}
```

## Query Optimization

### 1. Use EXPLAIN to Analyze Queries

```sql
-- Check query execution plan
EXPLAIN SELECT * FROM blog_posts WHERE status = 'PUBLISHED' ORDER BY published_at DESC;

-- Detailed execution plan
EXPLAIN FORMAT=JSON
SELECT * FROM blog_posts WHERE status = 'PUBLISHED' ORDER BY published_at DESC;
```

### 2. Proper Indexing

```sql
-- Single column index
CREATE INDEX idx_posts_status ON blog_posts(status);
CREATE INDEX idx_posts_slug ON blog_posts(slug);

-- Composite index (order matters!)
-- Good for: WHERE status = 'PUBLISHED' ORDER BY published_at DESC
CREATE INDEX idx_posts_status_published ON blog_posts(status, published_at DESC);

-- Covering index (includes all columns needed)
CREATE INDEX idx_posts_covering ON blog_posts(status, published_at, title, slug);

-- Full-text search index
CREATE FULLTEXT INDEX idx_posts_fulltext ON blog_posts(title, content);

-- Index for JSON operations (MySQL 8.0+)
CREATE INDEX idx_portfolios_tech ON portfolios((CAST(technologies AS CHAR(255) ARRAY)));

-- Check existing indexes
SHOW INDEX FROM blog_posts;

-- Remove index
DROP INDEX idx_posts_status ON blog_posts;
```

### 3. Optimizing SELECT Queries

```sql
-- ✅ Good - Select only needed columns
SELECT id, title, slug, excerpt, cover_image, published_at
FROM blog_posts
WHERE status = 'PUBLISHED'
ORDER BY published_at DESC
LIMIT 10;

-- ❌ Bad - Selects all columns including large content
SELECT * FROM blog_posts
WHERE status = 'PUBLISHED'
ORDER BY published_at DESC
LIMIT 10;

-- ✅ Good - Use EXISTS instead of IN for subqueries
SELECT p.* FROM portfolios p
WHERE EXISTS (
  SELECT 1 FROM portfolio_tags pt
  JOIN tags t ON pt.tag_id = t.id
  WHERE pt.portfolio_id = p.id AND t.name = 'Next.js'
);

-- ❌ Bad - IN can be slower with large datasets
SELECT p.* FROM portfolios p
WHERE p.id IN (
  SELECT pt.portfolio_id FROM portfolio_tags pt
  JOIN tags t ON pt.tag_id = t.id
  WHERE t.name = 'Next.js'
);
```

### 4. Pagination Queries

```sql
-- ✅ Good - Offset-based pagination (traditional)
SELECT id, title, slug, published_at
FROM blog_posts
WHERE status = 'PUBLISHED'
ORDER BY published_at DESC
LIMIT 10 OFFSET 20; -- Page 3 (20 items skipped)

-- ✅ Good - Cursor-based pagination (better for infinite scroll)
-- First page
SELECT id, title, slug, published_at
FROM blog_posts
WHERE status = 'PUBLISHED'
ORDER BY published_at DESC
LIMIT 11; -- Get 1 extra to check if there's more

-- Next page (using last item's timestamp and id)
SELECT id, title, slug, published_at
FROM blog_posts
WHERE status = 'PUBLISHED'
  AND (published_at < '2024-01-15 10:00:00' OR (published_at = '2024-01-15 10:00:00' AND id < 'abc123'))
ORDER BY published_at DESC, id DESC
LIMIT 11;

-- Get total count efficiently (separate query)
SELECT COUNT(*) FROM blog_posts WHERE status = 'PUBLISHED';
```

### 5. JOIN Optimization

```sql
-- ✅ Good - Explicit JOIN with indexed columns
SELECT
  p.id, p.title, p.slug, p.published_at,
  a.name AS author_name, a.image AS author_image,
  c.name AS category_name, c.slug AS category_slug
FROM blog_posts p
INNER JOIN users a ON p.author_id = a.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'PUBLISHED'
ORDER BY p.published_at DESC
LIMIT 10;

-- ✅ Good - JOIN for many-to-many with proper indexing
SELECT
  p.id, p.title, p.slug,
  GROUP_CONCAT(t.name SEPARATOR ', ') AS tags
FROM blog_posts p
INNER JOIN post_tags pt ON p.id = pt.post_id
INNER JOIN tags t ON pt.tag_id = t.id
WHERE p.status = 'PUBLISHED'
GROUP BY p.id, p.title, p.slug
ORDER BY p.published_at DESC;
```

### 6. Full-Text Search

```sql
-- Natural language search
SELECT
  id, title, slug,
  MATCH(title, content) AGAINST('nextjs tutorial' IN NATURAL LANGUAGE MODE) AS relevance
FROM blog_posts
WHERE status = 'PUBLISHED'
  AND MATCH(title, content) AGAINST('nextjs tutorial' IN NATURAL LANGUAGE MODE)
ORDER BY relevance DESC
LIMIT 20;

-- Boolean search (more control)
SELECT id, title, slug
FROM blog_posts
WHERE status = 'PUBLISHED'
  AND MATCH(title, content) AGAINST('+nextjs +tutorial -react' IN BOOLEAN MODE)
ORDER BY published_at DESC;

-- With query expansion (find related terms)
SELECT id, title, slug
FROM blog_posts
WHERE MATCH(title, content) AGAINST('nextjs' WITH QUERY EXPANSION);
```

### 7. JSON Operations (MySQL 8.0+)

```sql
-- Query JSON array
SELECT id, title, technologies
FROM portfolios
WHERE JSON_CONTAINS(technologies, '"Next.js"');

-- Get specific JSON value
SELECT
  id,
  title,
  JSON_EXTRACT(images, '$[0].url') AS cover_image
FROM portfolios;

-- Update JSON value
UPDATE portfolios
SET technologies = JSON_ARRAY_APPEND(technologies, '$', 'TypeScript')
WHERE id = 'abc123';

-- Search within JSON
SELECT id, title
FROM portfolios
WHERE JSON_SEARCH(technologies, 'one', 'Next.js') IS NOT NULL;
```

## Common Query Patterns

### 1. Blog Listing

```sql
-- Get published posts with pagination
SELECT
  p.id, p.title, p.slug, p.excerpt, p.cover_image,
  p.published_at, p.views,
  a.name AS author_name, a.image AS author_image,
  c.name AS category_name, c.slug AS category_slug
FROM blog_posts p
INNER JOIN users a ON p.author_id = a.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'PUBLISHED'
  AND p.published_at <= NOW()
ORDER BY p.published_at DESC
LIMIT 10 OFFSET 0;

-- With tags (requires subquery or JOIN)
SELECT
  p.id, p.title, p.slug, p.excerpt,
  GROUP_CONCAT(t.name ORDER BY t.name SEPARATOR ', ') AS tags
FROM blog_posts p
INNER JOIN users a ON p.author_id = a.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.status = 'PUBLISHED'
GROUP BY p.id, p.title, p.slug, p.excerpt
ORDER BY p.published_at DESC
LIMIT 10;
```

### 2. Single Post with Tags

```sql
-- Get single post with all related data
SELECT
  p.*,
  a.name AS author_name, a.image AS author_image, a.bio AS author_bio,
  c.name AS category_name, c.slug AS category_slug
FROM blog_posts p
INNER JOIN users a ON p.author_id = a.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.slug = 'my-post-slug'
  AND p.status = 'PUBLISHED';

-- Get tags for this post
SELECT t.id, t.name, t.slug
FROM tags t
INNER JOIN post_tags pt ON t.id = pt.tag_id
WHERE pt.post_id = (SELECT id FROM blog_posts WHERE slug = 'my-post-slug')
ORDER BY t.name;
```

### 3. Related Posts

```sql
-- Get related posts by category (excluding current post)
SELECT
  p.id, p.title, p.slug, p.cover_image, p.published_at
FROM blog_posts p
WHERE p.status = 'PUBLISHED'
  AND p.category_id = (SELECT category_id FROM blog_posts WHERE slug = 'current-post')
  AND p.id != (SELECT id FROM blog_posts WHERE slug = 'current-post')
ORDER BY p.published_at DESC
LIMIT 4;

-- Related posts by tags
SELECT DISTINCT
  p.id, p.title, p.slug, p.cover_image,
  COUNT(pt.tag_id) AS common_tags
FROM blog_posts p
INNER JOIN post_tags pt ON p.id = pt.post_id
WHERE pt.tag_id IN (
  SELECT tag_id FROM post_tags WHERE post_id = 'current-post-id'
)
  AND p.id != 'current-post-id'
  AND p.status = 'PUBLISHED'
GROUP BY p.id, p.title, p.slug, p.cover_image
ORDER BY common_tags DESC, p.published_at DESC
LIMIT 4;
```

### 4. Portfolio Queries

```sql
-- Get featured portfolios
SELECT id, title, slug, description, cover_image, technologies
FROM portfolios
WHERE featured = 1
ORDER BY `order` ASC;

-- Get all portfolios with tech filter
SELECT id, title, slug, cover_image
FROM portfolios
WHERE JSON_CONTAINS(technologies, '"Next.js"')
ORDER BY `order` ASC, completed_at DESC;

-- Portfolio with images
SELECT
  id, title, slug, description, cover_image,
  technologies,
  project_url, github_url,
  completed_at
FROM portfolios
WHERE slug = 'my-portfolio';
```

### 5. Statistics Queries

```sql
-- Post count by status
SELECT status, COUNT(*) AS count
FROM blog_posts
GROUP BY status;

-- Post count by category
SELECT
  c.name,
  c.slug,
  COUNT(p.id) AS post_count
FROM categories c
LEFT JOIN blog_posts p ON c.id = p.category_id AND p.status = 'PUBLISHED'
GROUP BY c.id, c.name, c.slug
ORDER BY post_count DESC;

-- Most viewed posts
SELECT id, title, slug, views
FROM blog_posts
WHERE status = 'PUBLISHED'
ORDER BY views DESC
LIMIT 10;

-- Recent posts stats
SELECT
  DATE(published_at) AS date,
  COUNT(*) AS posts_count
FROM blog_posts
WHERE status = 'PUBLISHED'
  AND published_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(published_at)
ORDER BY date DESC;
```

### 6. Search Queries

```sql
-- Simple search
SELECT id, title, slug, excerpt
FROM blog_posts
WHERE status = 'PUBLISHED'
  AND (
    title LIKE '%search term%'
    OR content LIKE '%search term%'
  )
ORDER BY published_at DESC
LIMIT 20;

-- Full-text search with relevance
SELECT
  id, title, slug, excerpt,
  MATCH(title, content) AGAINST('search term' IN NATURAL LANGUAGE MODE) AS relevance
FROM blog_posts
WHERE status = 'PUBLISHED'
  AND MATCH(title, content) AGAINST('search term' IN NATURAL LANGUAGE MODE)
ORDER BY relevance DESC, published_at DESC
LIMIT 20;
```

## Performance Tips

### 1. Use Covering Indexes

```sql
-- Create index that covers all selected columns
CREATE INDEX idx_posts_listing
ON blog_posts(status, published_at DESC, title, slug, excerpt, cover_image);

-- Now this query uses only the index (no table lookup)
SELECT title, slug, excerpt, cover_image, published_at
FROM blog_posts
WHERE status = 'PUBLISHED'
ORDER BY published_at DESC
LIMIT 10;
```

### 2. Avoid SELECT DISTINCT When Possible

```sql
-- ✅ Good - Use GROUP BY if you need aggregation
SELECT p.id, p.title, COUNT(c.id) AS comment_count
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id
GROUP BY p.id, p.title;

-- ❌ Bad - DISTINCT can be slower
SELECT DISTINCT p.id, p.title
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id;
```

### 3. Use UNION ALL Instead of UNION

```sql
-- ✅ Good - UNION ALL is faster (no duplicate removal)
SELECT id, title FROM portfolios
UNION ALL
SELECT id, title FROM blog_posts;

-- ❌ Bad - UNION removes duplicates (slower)
SELECT id, title FROM portfolios
UNION
SELECT id, title FROM blog_posts;
```

### 4. Batch Inserts

```sql
-- ✅ Good - Single insert statement
INSERT INTO post_tags (post_id, tag_id) VALUES
  ('post1', 'tag1'),
  ('post1', 'tag2'),
  ('post2', 'tag1');

-- ❌ Bad - Multiple round trips
INSERT INTO post_tags (post_id, tag_id) VALUES ('post1', 'tag1');
INSERT INTO post_tags (post_id, tag_id) VALUES ('post1', 'tag2');
INSERT INTO post_tags (post_id, tag_id) VALUES ('post2', 'tag1');
```

### 5. Use Prepared Statements

```ts
// ✅ Good - Prepared statement (prevents SQL injection)
const [posts] = await pool.execute(
  'SELECT * FROM blog_posts WHERE slug = ? AND status = ?',
  [slug, 'PUBLISHED']
)

// ❌ Bad - Direct interpolation (SQL injection risk)
const posts = await pool.query(
  `SELECT * FROM blog_posts WHERE slug = '${slug}' AND status = 'PUBLISHED'`
)
```

## Maintenance Queries

### 1. Analyze Table

```sql
-- Check table size
SELECT
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'bolelahcorp'
ORDER BY (data_length + index_length) DESC;

-- Check row count
SELECT
  table_name,
  table_rows
FROM information_schema.tables
WHERE table_schema = 'bolelahcorp'
ORDER BY table_rows DESC;
```

### 2. Optimize Tables

```sql
-- Optimize table (rebuilds table, reclaims space)
OPTIMIZE TABLE blog_posts;

-- Analyze table (update index statistics)
ANALYZE TABLE blog_posts;

-- Check table for issues
CHECK TABLE blog_posts;
```

### 3. Slow Query Log

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2; -- Log queries taking > 2 seconds

-- View slow queries
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;
```

## Security Best Practices

### 1. Use Parameterized Queries

```ts
// ✅ Good - Parameterized
const result = await db.execute(
  'SELECT * FROM users WHERE email = ?',
  [userEmail]
)

// ❌ Bad - String concatenation
const result = await db.query(
  `SELECT * FROM users WHERE email = '${userEmail}'`
)
```

### 2. Limit Returned Rows

```sql
-- Always use LIMIT
SELECT * FROM blog_posts LIMIT 100;

-- For large exports, use batches
SELECT * FROM blog_posts LIMIT 1000 OFFSET 0;
SELECT * FROM blog_posts LIMIT 1000 OFFSET 1000;
-- etc.
```

### 3. Use Read-Only Accounts for Queries

```sql
-- Create read-only user
CREATE USER 'readonly'@'%' IDENTIFIED BY 'secure_password';
GRANT SELECT ON bolelahcorp.* TO 'readonly'@'%';

-- Use for reporting/analytics queries
```

## MySQL Functions Reference

```sql
-- String functions
CONCAT(first_name, ' ', last_name)
SUBSTRING(title, 1, 50)
LOWER(email)
UPPER(name)
TRIM(description)
REPLACE(content, 'old', 'new')

-- Date functions
NOW()
CURDATE()
DATE_FORMAT(published_at, '%M %d, %Y')
DATE_ADD(created_at, INTERVAL 7 DAY)
DATEDIFF(NOW(), published_at)

-- Conditional
CASE
  WHEN status = 'PUBLISHED' THEN 'Live'
  WHEN status = 'DRAFT' THEN 'Draft'
  ELSE 'Other'
END

IFNULL(cover_image, '/default.jpg')
COALESCE(phone, email, 'No contact')

-- Aggregate
COUNT(*)
SUM(views)
AVG(rating)
MAX(published_at)
MIN(created_at)
GROUP_CONCAT(tags.name SEPARATOR ', ')
```

## Resources

- [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)
- [MySQL Performance Guide](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [Prisma MySQL Guide](https://www.prisma.io/docs/concepts/database-connectors/mysql)
