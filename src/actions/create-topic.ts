'use server';

import type { Topic } from '@prisma/client'
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { z } from "zod";
import { db } from '@/db';
import paths from '@/paths'
import { revalidatePath } from 'next/cache';

import * as Sentry from "@sentry/nextjs";

const createTopicSchema = z.object({
    name: z
        .string()
        .min(3)
        .regex(/[a-z-]/, { message: 'Must be lowercase letters or dashes without spaces' }),
    description: z.string().min(10)
})

interface CreateTopicFormState {
    errors: {
        name?: string[];
        description?: string[];
        _form?: string[];
    }
}

export async function createTopic(
    formState: CreateTopicFormState,
    formData: FormData
): Promise<CreateTopicFormState> {
    // const name = formData.get('name')
    // const description = formData.get('description')

    const result = createTopicSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
    });

    if (!result.success) {
        Sentry.captureException(result.error.flatten().fieldErrors);
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    // session from server side
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        Sentry.captureException('User not logged in');
        return {
            errors: {
                _form: ['You must be signed in to do this.']
            }
        }
    }

    let topic: Topic

    try {
        topic = await db.topic.create({
            data: {
                slug: result.data.name,
                description: result.data.description
            }
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
            Sentry.captureException(err.message);
            return {
                errors: {
                    _form: [err.message]
                }
            }
        } else {
            Sentry.captureException('Something went wrong');
            return {
                errors: {
                    _form: ['Something went wrong']
                }
            }
        }
    }

    revalidatePath('/')
    redirect(paths.topicShow(topic.slug))
}