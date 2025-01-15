'use client'

import { useRef } from 'react'
import { twMerge } from 'tailwind-merge'

import { Text } from '@stardust/core/global/structs'

import * as Toolbar from '@/ui/global/widgets/components/Toolbar'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Mdx } from '../../Mdx'
import { UserAvatar } from '../../UserAvatar'
import { Button } from '../../Button'
import { Icon } from '../../Icon'
import { useCommentInput } from './useCommentInput'
import { TextEditor } from '../../TextEditor'
import type { TextEditorRef } from '../../TextEditor/types'

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
  const textEditorRef = useRef<TextEditorRef>(null)
  const {
    content,
    errorMessage,
    isPreviewVisible,
    handleTogglePreview,
    handleContentChange,
    handleSnippetInsert,
    handlePostComment,
  } = useCommentInput({ onSend, textEditorRef, defaultContent })
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
              <TextEditor
                ref={textEditorRef}
                placeholder={placeholder}
                className='min-h-[5rem]'
                rows={content.length > 3 ? Text.create(content).countCharacters('\n') : 1}
                value={content}
                onChange={handleContentChange}
              />
            )}
            <Toolbar.Container className='flex w-full flex-col gap-4 md:flex-row md:items-center  md:justify-center'>
              {!isPreviewVisible && (
                <div className='flex items-center justify-end gap-3 md:justify-start'>
                  <Toolbar.Button
                    onClick={() => handleSnippetInsert('strong')}
                    icon='strong'
                    label='Inserir trecho em destaque'
                  />
                  <Toolbar.Button
                    onClick={() => handleSnippetInsert('codeLine')}
                    icon='code'
                    label='Inserir trecho de código em linha'
                  />
                  <Toolbar.Button
                    onClick={() => handleSnippetInsert('codeBlock')}
                    icon='runnable-code'
                    label='Inserir trecho de código executável'
                  />
                </div>
              )}
              <div className='ml-auto flex items-center gap-3'>
                <Toolbar.CustomButton>
                  <Button
                    type='button'
                    className='h-6 w-24 text-xs'
                    onClick={handleTogglePreview}
                  >
                    {isPreviewVisible ? 'Editor' : 'Preview'}
                  </Button>
                </Toolbar.CustomButton>

                <Toolbar.CustomButton>
                  <Button
                    type='submit'
                    className='custom-outline rounded-md h-6 w-24 text-xs'
                    form={id}
                  >
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
                </Toolbar.CustomButton>
              </div>
            </Toolbar.Container>
            {errorMessage && (
              <p className='mt-3 text-sm font-medium text-red-700'>{errorMessage}</p>
            )}
          </div>
        </form>
      </>
    )
}
