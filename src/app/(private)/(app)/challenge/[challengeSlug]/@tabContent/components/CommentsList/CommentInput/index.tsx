'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { Code, PaperPlaneRight } from '@phosphor-icons/react'
import * as Toolbar from '@radix-ui/react-toolbar'
import { twMerge } from 'tailwind-merge'

import { UserAvatar } from '@/app/(private)/(app)/(home)/components/UseAvatar'
import { Button } from '@/app/components/Button'
import { useAuth } from '@/contexts/AuthContext'
import { VALIDATION_ERRORS } from '@/services/validation/config/validationErrors'

type CommentInputProps = {
  id: string
  placeholder: string
  comment: string
  title: string
  onPost: (comment: string) => void
  onCommentChange: (comment: string) => void
}

export function CommentInput({
  id,
  comment,
  title,
  placeholder,
  onPost,
  onCommentChange,
}: CommentInputProps) {
  const [errorMessage, setErrorMessage] = useState('')

  const { user } = useAuth()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handlePostComment(event: FormEvent) {
    event.preventDefault()

    if (!comment) {
      setErrorMessage(VALIDATION_ERRORS.nonempty)
    }

    if (typeof comment !== 'string') {
      setErrorMessage(VALIDATION_ERRORS.comment.string)
    }

    onPost(comment)
  }

  function handleCommentChange(comment: string) {
    onCommentChange(comment)
  }

  useEffect(() => {
    setErrorMessage('')

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [comment])

  useEffect(() => {
    if (!textareaRef.current) return

    textareaRef.current.focus()
    const currentValue = textareaRef.current.value
    textareaRef.current.value = ''
    textareaRef.current.value = currentValue
  }, [])

  if (user)
    return (
      <>
        <form
          method="post"
          id={id}
          className="flex gap-3"
          onSubmit={handlePostComment}
        >
          <UserAvatar avatarId={user.avatar_id} size={52} />
          <div
            className={twMerge(
              'h-auto w-full rounded-md border-[.025rem] border-transparent bg-gray-700 p-4 ',
              errorMessage
                ? 'focus-within:border-red-700'
                : 'focus-within:border-gray-300'
            )}
          >
            <textarea
              ref={textareaRef}
              placeholder={placeholder}
              className="min-h-[4rem] w-full resize-none rounded-md bg-transparent text-sm font-medium text-gray-300  outline-none placeholder:text-gray-500"
              rows={1}
              value={comment}
              autoFocus={true}
              onChange={({ currentTarget }) =>
                handleCommentChange(currentTarget.value)
              }
            />
            <Toolbar.Root className="flex w-full items-center justify-between">
              <div className="flex items-center">
                <Toolbar.Button>
                  <Code weight="bold" className="text-green-400" />
                </Toolbar.Button>
              </div>
              <div className="flex items-center gap-3">
                <Toolbar.Button>
                  <Button type="button" className="h-6 w-24 text-xs">
                    Preview
                  </Button>
                </Toolbar.Button>

                <Toolbar.Button>
                  <Button type="submit" className="h-6 w-24 text-xs" form={id}>
                    <PaperPlaneRight
                      weight="bold"
                      className="text-sm text-green-900"
                    />
                    {title}
                  </Button>
                </Toolbar.Button>
              </div>
            </Toolbar.Root>
            {errorMessage && (
              <p className="mt-3 text-sm font-medium text-red-700">
                {errorMessage}
              </p>
            )}
          </div>
        </form>
      </>
    )
}
