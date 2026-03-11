import { notFound } from 'next/navigation';
import { BlogEditor } from '@/components/admin/BlogEditor';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const { prisma } = await import('@/lib/prisma');

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        postTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return notFound();
    }

    // Format the post data for the form
    // Convert null values to undefined for optional fields
    const formData = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? undefined,
      content: post.content,
      coverImage: post.coverImage ?? undefined,
      ogImage: post.ogImage ?? undefined,
      status: post.status,
      categoryId: post.categoryId ?? '',
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
      scheduledAt: post.scheduledAt ? new Date(post.scheduledAt) : undefined,
      metaTitle: post.metaTitle ?? undefined,
      metaDescription: post.metaDescription ?? undefined,
      tagIds: post.postTags.map(pt => pt.tag.id),
      tagNames: post.postTags.map(pt => pt.tag.name),
    };

    return (
      <div className="max-w-4xl">
        <div className="mb-6">
          <a
            href="/admin/blog"
            className="text-mist hover:text-coral transition-colors text-sm mb-2 inline-block"
          >
            ← Back to Blog Posts
          </a>
          <h2 className="text-2xl font-bold text-off-white">Edit Blog Post</h2>
          <p className="text-mist text-sm mt-1">{post.title}</p>
        </div>
        <BlogEditor post={formData} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return notFound();
  }
}
