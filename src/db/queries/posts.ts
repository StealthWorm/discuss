import type { Post } from '@prisma/client'
import { db } from '@/db'

export type PostWithData = Post & {
  topic: { slug: string };
  user: { name: string | null };
  _count: { comments: number };
}

// * essa é uma forma de inferir o tipo esperado de um retorno, sem ter de passar os dados esperados manualmente
// * equivale à tipagem comentada acima
//  * com ela, não é necessário definir a tipagaem da Promise de retorno
// export type PostWithData = Awaited<
//   ReturnType<typeof fetchPostByTopicSlug>
// >[number]

export function fetchPostByTopicSlug(slug: string): Promise<PostWithData[]> {
  return db.post.findMany({
    where: { topic: { slug } },
    include: {
      topic: {
        select: {
          slug: true
        }
      },
      user: {
        select: {
          name: true
        }
      },
      _count: {
        select: {
          comments: true
        }
      }
    }
  })
}