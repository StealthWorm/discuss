import { redirect } from "next/navigation"
import { fetchPostBySearchTerm } from "@/db/queries/posts"
import PostList from "@/components/posts/post-list"

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{
    term: string
  }>
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;
  const { term } = searchParams

  if (!term) {
    redirect('/')
  }

  return (
    <div>
      <PostList fetchData={() => fetchPostBySearchTerm(term)} data-test-id="posts-search" />
    </div>
  )
}