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
import FormButton from '../common/form-button';

export default function TopicCreateForm() {
  // caso o useFormState gere erro no primeiro parametro da ação, provavelmente é algo de tipagem.
  // Basta ir até a ação que ele executará e declarar uma tipagem para o formState (e retornar esse mesmo tipo) 
  // que seja a mesma do valor inicial passado no segundo parametro, nesse caso uma string
  const [formState, action] = useFormState(actions.createTopic, {
    errors: {}
  });

  return (
    <Popover placement='left'>
      <PopoverTrigger data-test-id="create-topic-button">
        <Button color='primary'>Create a Topic</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={action} data-test-id="create-topic-popover">
          <div className='flex flex-col gap-4 p-4 w-80'>
            <h3 className='text-lg'>Create a Topic</h3>
            <Input
              data-test-id="create-topic-name-input"
              label="Name"
              name='name'
              labelPlacement='outside'
              placeholder="Name"
              isInvalid={!!formState.errors.name} // como estamos usando next-ui, ele possui um validador interno
              errorMessage={formState.errors.name?.join(', ')}
            />
            <Textarea
              data-test-id="create-topic-description-input"
              label="Description"
              name='description'
              labelPlacement='outside'
              placeholder="Describe your topic"
              isInvalid={!!formState.errors.description}
              errorMessage={formState.errors.description?.join(', ')}
            />

            {formState.errors._form
              ? <div
                data-test-id="create-topic-form-errors"
                className='p-2 rounded text-red-400 bg-red-200 border border-red-400'
              >
                {formState.errors._form?.join(', ')}
              </div>
              : null
            }

            <FormButton>Save</FormButton>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
