import { redirect } from "next/navigation"
import { fetchPostBySearchTerm } from "@/db/queries/posts"
import PostList from "@/components/posts/post-list"

interface SearchPageProps {
  searchParams: {
    term: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { term } = searchParams

  if (!term) {
    redirect('/')
  }

  return (
    <div>
      <PostList fetchData={() => fetchPostBySearchTerm(term)} />
    </div>
  )
}