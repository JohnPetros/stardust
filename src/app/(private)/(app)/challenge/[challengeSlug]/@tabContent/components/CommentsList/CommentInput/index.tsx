'use client'

import { useEffect, useRef } from 'react'
import { Code, PaperPlaneRight } from '@phosphor-icons/react'
import * as Toolbar from '@radix-ui/react-toolbar'

import { UserAvatar } from '@/app/(private)/(app)/(home)/components/UseAvatar'
import { Button } from '@/app/components/Button'
import { useAuth } from '@/contexts/AuthContext'

type CommentInputProps = {
  onPost: () => void
  onCommentChange: (comment: string) => void
  comment: string
}

export function CommentInput({
  onPost,
  onCommentChange,
  comment,
}: CommentInputProps) {
  const { user } = useAuth()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleCommentChange(comment: string) {
    onCommentChange(comment)
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [comment])

  if (user)
    return (
      <>
        <form id="user-comment-form" className="flex gap-3" onSubmit={onPost}>
          <UserAvatar avatarId={user.avatar_id} size={52} />
          <div className="h-auto w-full rounded-md border-[.025rem] border-transparent bg-gray-700 p-4 focus-within:border-gray-300">
            <textarea
              ref={textareaRef}
              placeholder="escreva um comentário sobre esse desafio..."
              className="min-h-[6rem] w-full resize-none rounded-md bg-transparent text-sm font-medium text-gray-300  outline-none placeholder:text-gray-500"
              rows={1}
              value={comment}
              onChange={({ currentTarget }) =>
                handleCommentChange(currentTarget.value)
              }
            />
            <div className="flex w-full items-center justify-between">
              <Toolbar.Root className="flex items-center">
                <Toolbar.Button>
                  <Code weight="bold" className="text-green-400" />
                </Toolbar.Button>
              </Toolbar.Root>
              <div className="flex items-center gap-3">
                <Button className="h-6 w-24 text-xs">Preview</Button>
                <Button className="h-6 w-24 text-xs" form="user-comment-form">
                  <PaperPlaneRight
                    weight="bold"
                    className="text-sm text-green-900"
                  />
                  Comentar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </>
    )
}
