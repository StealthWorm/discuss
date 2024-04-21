'use client';

import { useFormState } from 'react-dom'

import {
  Input,
  Button,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@nextui-org/react'

import * as actions from '@/actions'
import FormButton from '@/components/common/form-button'

interface PostCreateFormPorps {
  slug: string
}

export default function PostCreateForm({ slug }: PostCreateFormPorps) {
  // caso o useFormState gere erro no primeiro parametro da ação, provavelmente é algo de tipagem.
  // Basta ir até a ação que ele executará e declarar uma tipagem para o formState (e retornar esse mesmo tipo) 
  // que seja a mesma do valor inicial passado no segundo parametro, nesse caso uma string
  const [formState, action] = useFormState(
    actions.createPost.bind(null, slug), {
    errors: {}
  });

  return (
    <Popover placement='left' id="post-create-form">
      <PopoverTrigger data-test-id="create-post-button">
        <Button color='primary'>Create a Post</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={action} data-test-id="create-post-popover">
          <div className='flex flex-col gap-4 p-4 w-80'>
            <h3 className='text-lg'>Create a Post</h3>
            <Input
              data-test-id="create-post-title-input"
              label="Title"
              name='title'
              labelPlacement='outside'
              placeholder="Title"
              isInvalid={!!formState.errors.title} // como estamos usando next-ui, ele possui um validador interno
              errorMessage={formState.errors.title?.join(', ')}
            />
            <Textarea
              data-test-id="create-post-content-input"
              label="Content"
              name='content'
              labelPlacement='outside'
              placeholder="Content"
              isInvalid={!!formState.errors.content}
              errorMessage={formState.errors.content?.join(', ')}
            />

            {formState.errors._form
              ? <div className='p-2 rounded text-red-400 bg-red-200 border border-red-400'>{formState.errors._form?.join(', ')}</div>
              : null
            }

            <FormButton>Create Post</FormButton>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
