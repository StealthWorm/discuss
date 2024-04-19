'use server';

import { Post, Prisma } from '@prisma/client'
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { z } from "zod";
import { db } from '@/db';
import paths from '@/paths'
import { revalidatePath } from 'next/cache';

const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10)
})

interface CreatePostFormState {
  errors: {
    title?: string[];
    content?: string[];
    _form?: string[];
  }
}

export async function createPost(
  slug: string,
  formState: CreatePostFormState,
  formData: FormData): Promise<CreatePostFormState> {

  const result = createPostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content')
  })

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors
    }
  }

  // session from server side
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return {
      errors: {
        _form: ['You must be signed in to do this.']
      }
    }
  }

  // find the topic where the post will be attached
  const topic = await db.topic.findFirst({
    where: { slug }
  })

  if (!topic) {
    return {
      errors: {
        _form: ['Cannot find topic.']
      }
    }
  }

  // let post: Post

  const postData: Prisma.PostUncheckedCreateInput = {
    title: result.data.title,
    content: result.data.content,
    userId: session.user.id,
    topicId: topic.id
  };

  try {
    const post = await db.post.create({
      data: postData
    })

    revalidatePath(paths.topicShow(slug))
    redirect(paths.postShow(slug, post.id))
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message]
        }
      }
    } else {
      return {
        errors: {
          _form: ['Failed to create post']
        }
      }
    }
  }

}