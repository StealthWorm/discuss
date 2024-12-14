"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Textarea, Button } from "@nextui-org/react";
import FormButton from "@/components/common/form-button";
import * as actions from "@/actions";

interface CommentCreateFormProps {
  postId: string;
  parentId?: string;
  startOpen?: boolean;
}

// custom hook with logic
export function useCommentCreateForm({ postId, parentId, startOpen }: CommentCreateFormProps) {
  const [open, setOpen] = useState(startOpen);
  const ref = useRef<HTMLFormElement | null>(null);
  const [formState, action] = useFormState(
    actions.createComment.bind(null, { postId, parentId }),
    { errors: {} }
  ); // versões do next 15 trazem esse hook como "useActionState"

  useEffect(() => {
    if (formState.success) {
      ref.current?.reset();

      if (!startOpen) {
        setOpen(false);
      }
    }
  }, [formState, startOpen]);

  const form = (
    <form action={action} ref={ref} data-test-id="post-reply-form">
      <div className="space-y-2 px-1">
        <Textarea
          data-test-id="post-reply-input"
          name="content"
          label="Reply"
          placeholder="Enter your comment"
          isInvalid={!!formState.errors.content}
          errorMessage={formState.errors.content?.join(", ")}
        />

        {formState.errors._form ? (
          <div
            data-test-id="create-comment-form-errors"
            className="p-2 bg-red-200 border rounded border-red-400"
          >
            {formState.errors._form?.join(", ")}
          </div>
        ) : null}

        <FormButton data-test-id='form-button-save'>Create Comment</FormButton>
      </div>
    </form>
  );

  return {
    open,
    setOpen,
    form,
  };
}

export default function CommentCreateForm({
  postId,
  parentId,
  startOpen,
}: CommentCreateFormProps) {
  const { open, setOpen, form } = useCommentCreateForm({ postId, parentId, startOpen });

  return (
    <div>
      <Button size="sm" variant="light" onClick={() => setOpen(!open)} data-test-id="post-reply-button">
        Reply
      </Button>
      {open && form}
    </div>
  );
}
