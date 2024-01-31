import PostCreateForm from "@/components/posts/post-create-form";
import PostList from "@/components/posts/post-list";
import { fetchPostByTopicSlug } from "@/db/queries/posts";

interface TopicShowPageProps {
  params: {
    slug: string;
  }
}

export default function TopicShowPage({ params }: TopicShowPageProps) {
  const { slug } = params;

  const decodedSlug = decodeURIComponent(slug);

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="col-span-3">
        <h1 className="text-2xl font-bold mb-2">
          {decodedSlug}
        </h1>
        <PostList fetchData={() => fetchPostByTopicSlug(decodedSlug)} />
      </div>

      <div>
        <PostCreateForm slug={decodedSlug} />
      </div>
    </div>
  )
}