'use client'

import * as Toolbar from '@radix-ui/react-toolbar'
import { twMerge } from 'tailwind-merge'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Mdx } from '../../Mdx'
import { UserAvatar } from '../../UserAvatar'
import { ToolButton } from './ToolButton'
import { Button } from '../../Button'
import { Icon } from '../../Icon'
import { useCommentInput } from './useCommentInput'
import { Text } from '@stardust/core/global/structs'

type CommentInputProps = {
  id: string
  placeholder?: string
  defaultContent?: string
  title: string
  onSend: (commentContent: string) => void
}

export function CommentInput({
  id,
  title,
  placeholder,
  defaultContent = '',
  onSend,
}: CommentInputProps) {
  const {
    content,
    textareaRef,
    errorMessage,
    isPreviewVisible,
    handleInsertSnippet,
    handleTogglePreview,
    handleCommentChange,
    handlePostComment,
  } = useCommentInput(onSend, defaultContent)
  const { user } = useAuthContext()

  if (user)
    return (
      <>
        <form
          method='post'
          id={id}
          className='flex flex-col items-center gap-3 md:flex-row'
          onSubmit={handlePostComment}
        >
          <UserAvatar
            avatarImage={user.avatar.image.value}
            avatarName={user.avatar.name.value}
            size={52}
          />
          <div
            className={twMerge(
              'h-auto w-full rounded-md border-[.025rem] border-transparent bg-gray-700 p-4 ',
              errorMessage
                ? 'focus-within:border-red-700'
                : 'focus-within:border-gray-300',
            )}
          >
            {isPreviewVisible ? (
              <div className='prose prose-invert mb-2 min-h-[4.4rem]'>
                <Mdx>{content}</Mdx>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                placeholder={placeholder}
                className='min-h-[5rem] w-full resize-none rounded-md bg-transparent text-sm font-medium text-gray-300 outline-none placeholder:text-gray-500'
                rows={content.length > 3 ? Text.create(content).countCharacters('\n') : 1}
                value={content}
                autoFocus={true}
                onChange={({ currentTarget }) => handleCommentChange(currentTarget.value)}
              />
            )}
            <Toolbar.Root className='flex w-full flex-col gap-4 md:flex-row md:items-center  md:justify-center'>
              {!isPreviewVisible && (
                <div className='flex items-center justify-end gap-3 md:justify-start'>
                  <ToolButton
                    onClick={() => handleInsertSnippet('strong')}
                    icon='strong'
                    label='Inserir trecho em destaque'
                  />
                  <ToolButton
                    onClick={() => handleInsertSnippet('code')}
                    icon='code'
                    label='Inserir trecho de código'
                  />
                  <ToolButton
                    onClick={() => handleInsertSnippet('runnableCode')}
                    icon='runnable-code'
                    label='Inserir trecho de código executável'
                  />
                </div>
              )}
              <div className='ml-auto flex items-center gap-3'>
                <Toolbar.Button asChild>
                  <Button
                    type='button'
                    className='h-6 w-24 text-xs'
                    onClick={handleTogglePreview}
                  >
                    {isPreviewVisible ? 'Editor' : 'Preview'}
                  </Button>
                </Toolbar.Button>

                <Toolbar.Button
                  type='submit'
                  className='custom-outline rounded-md'
                  asChild
                >
                  <Button type='submit' className='h-6 w-24 text-xs' form={id}>
                    <div className='flex items-center gap-1'>
                      <Icon
                        name='send'
                        weight='bold'
                        size={12}
                        className='text-sm text-green-900'
                      />
                      {title}
                    </div>
                  </Button>
                </Toolbar.Button>
              </div>
            </Toolbar.Root>
            {errorMessage && (
              <p className='mt-3 text-sm font-medium text-red-700'>{errorMessage}</p>
            )}
          </div>
        </form>
      </>
    )
}
