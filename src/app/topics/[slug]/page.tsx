import PostCreateForm from "@/components/posts/post-create-form";
import PostList from "@/components/posts/post-list";
import { fetchPostByTopicSlug } from "@/db/queries/posts";

interface TopicShowPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TopicShowPage({ params }: TopicShowPageProps) {
  const { slug } = await params;

  const decodedSlug = decodeURIComponent(slug);

  return (
    <div className="grid grid-cols-4 gap-4 p-4" data-test-id="topic-info">
      <div className="col-span-3">
        <h1 className="text-2xl font-bold mb-2" data-test-id="topic-slug">
          {decodedSlug}
        </h1>
        <PostList fetchData={() => fetchPostByTopicSlug(decodedSlug)} data-test-id="posts" />
      </div>

      <div>
        <PostCreateForm slug={decodedSlug} />
      </div>
    </div>
  )
}