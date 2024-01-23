'use client'

import {
  Article,
  Code,
  PaperPlaneRight,
  TerminalWindow,
} from '@phosphor-icons/react'
import * as Toolbar from '@radix-ui/react-toolbar'
import { twMerge } from 'tailwind-merge'

import { ToolButton } from './ToolButton'
import { useUserCommentInput } from './useUserCommentInput'

import { Button } from '@/app/components/Button'
import { Mdx } from '@/app/components/Mdx'
import { UserAvatar } from '@/app/components/UserAvatar'
import { useAuth } from '@/contexts/AuthContext'

type UserCommentInputProps = {
  id: string
  placeholder: string
  comment: string
  title: string
  onCommentChange: (comment: string) => void
  onPost: (comment: string) => void
}

export function UserCommentInput({
  id,
  comment,
  title,
  placeholder,
  onPost,
  onCommentChange,
}: UserCommentInputProps) {
  const {
    textareaRef,
    errorMessage,
    isPreviewVisible,
    handleTogglePreview,
    handleCommentChange,
    handlePostComment,
  } = useUserCommentInput(comment, onCommentChange, onPost)

  const { user } = useAuth()

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
            {isPreviewVisible ? (
              <div className="prose prose-invert mb-2 min-h-[4.4rem]">
                <Mdx>{comment}</Mdx>
              </div>
            ) : (
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
            )}
            <Toolbar.Root className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <ToolButton icon={Article} label="Inserir trecho em destaque" />
                <ToolButton icon={Code} label="Inserir trecho de código" />
                <ToolButton
                  icon={TerminalWindow}
                  label="Inserir trecho de código executável"
                />
              </div>
              <div className="flex items-center gap-3">
                <Toolbar.Button asChild>
                  <Button
                    type="button"
                    className="h-6 w-24 text-xs"
                    onClick={handleTogglePreview}
                  >
                    {isPreviewVisible ? 'Editor' : 'Preview'}
                  </Button>
                </Toolbar.Button>

                <Toolbar.Button
                  type="submit"
                  className="custom-outline rounded-md"
                >
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
