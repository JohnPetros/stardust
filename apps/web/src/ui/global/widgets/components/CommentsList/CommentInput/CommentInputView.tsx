import type { FormEvent, RefObject } from 'react'
import { twMerge } from 'tailwind-merge'

import { Text } from '@stardust/core/global/structures'

import * as Toolbar from '@/ui/global/widgets/components/Toolbar'
import { Mdx } from '../../Mdx'
import { UserAvatar } from '../../UserAvatar'
import { Button } from '../../Button'
import { Icon } from '../../Icon'
import { TextEditor } from '../../old_TextEditor'
import type { TextEditorRef, TextEditorSnippet } from '../../old_TextEditor/types'

type Props = {
  id: string
  placeholder?: string
  defaultContent?: string
  title: string
  userAvatarImage: string
  userAvatarName: string
  errorMessage: string
  isPreviewVisible: boolean
  content: string
  textEditorRef: RefObject<TextEditorRef | null>
  onPost: (formEvent: FormEvent) => void
  onTogglePreview: () => void
  onChange: (commentContent: string) => void
  onSnippetInsert: (snippet: TextEditorSnippet) => void
}

export const CommentInputView = ({
  id,
  title,
  placeholder,
  defaultContent = '',
  userAvatarImage,
  userAvatarName,
  errorMessage,
  isPreviewVisible,
  content,
  textEditorRef,
  onPost,
  onTogglePreview,
  onChange,
  onSnippetInsert,
}: Props) => {
  return (
    <form method='post' id={id} className='flex flex-col items-center gap-3 md:flex-row'>
      <UserAvatar avatarImage={userAvatarImage} avatarName={userAvatarName} size={52} />
      <div
        className={twMerge(
          'h-auto w-full rounded-md border-[.025rem] border-transparent bg-gray-700 p-4 ',
          errorMessage ? 'focus-within:border-red-700' : 'focus-within:border-gray-300',
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
            rows={
              content.length > 3 ? Text.create(content).countCharacters('\n').value : 1
            }
            value={content}
            onChange={onChange}
          />
        )}
        <Toolbar.Container className='flex w-full flex-col gap-4 md:flex-row md:items-center  md:justify-center'>
          {!isPreviewVisible && (
            <div className='flex items-center justify-end gap-3 md:justify-start'>
              <Toolbar.Button
                onClick={() => onSnippetInsert('strong')}
                icon='strong'
                label='Inserir trecho em destaque'
              />
              <Toolbar.Button
                onClick={() => onSnippetInsert('codeLine')}
                icon='code'
                label='Inserir trecho de código em linha'
              />
              <Toolbar.Button
                onClick={() => onSnippetInsert('codeBlock')}
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
                onClick={onTogglePreview}
              >
                {isPreviewVisible ? 'Editor' : 'Preview'}
              </Button>
            </Toolbar.CustomButton>

            <Toolbar.CustomButton>
              <Button
                form={id}
                type='submit'
                onClick={onPost}
                className='custom-outline rounded-md h-6 w-24 text-xs'
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
  )
}
