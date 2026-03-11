import { BlogEditor } from '@/components/admin/BlogEditor';

export default function NewBlogPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <a
          href="/admin/blog"
          className="text-mist hover:text-coral transition-colors text-sm mb-2 inline-block"
        >
          ← Back to Blog Posts
        </a>
        <h2 className="text-2xl font-bold text-off-white">New Blog Post</h2>
        <p className="text-mist text-sm mt-1">Create a new blog post to share your thoughts</p>
      </div>
      <BlogEditor />
    </div>
  );
}
