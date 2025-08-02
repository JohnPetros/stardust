'use client'

import { useRef } from 'react'
import * as Toolbar from '@/ui/global/widgets/components/Toolbar'

import type { TextEditorRef } from '@/ui/global/widgets/components/TextEditor/types'
import { useTextEditor } from './useTextEditor'
import { TextEditor } from '@/ui/global/widgets/components/TextEditor'
import { Mdx } from '@/ui/global/widgets/components/Mdx'

type Props = {
  content: string
  errorMessage?: string
  onChange: (content: string) => void
}

export function ContentEditor({ content, errorMessage, onChange }: Props) {
  const textEditorRef = useRef<TextEditorRef>(null)
  const { previewContent, handleSnippetInsert, textEditorChange } = useTextEditor(
    content,
    textEditorRef,
    onChange,
  )

  return (
    <>
      <Toolbar.Container className='flex items-center gap-3 px-6 py-3 border-b border-gray-600'>
        <Toolbar.Button
          onClick={() => handleSnippetInsert('title')}
          icon='title'
          label='Título principal'
        />
        <Toolbar.Button
          onClick={() => handleSnippetInsert('strong')}
          icon='strong'
          label='Inserir trecho em destaque'
        />
        <Toolbar.Button
          onClick={() => handleSnippetInsert('textBlock')}
          icon='text-block'
          label='Bloco de texto'
        />
        <Toolbar.Button
          onClick={() => handleSnippetInsert('strongTextBlock')}
          icon='strong-text-block'
          label='Bloco de texto destacado'
        />
        <Toolbar.Button
          onClick={() => handleSnippetInsert('alertTextBlock')}
          icon='alert'
          label='Bloco de texto de alerta'
        />
        <Toolbar.Button
          onClick={() => handleSnippetInsert('orderedList')}
          icon='ordered-list'
          label='Lista numéria'
        />
        <Toolbar.Button
          onClick={() => handleSnippetInsert('unorderedList')}
          icon='unordered-list'
          label='Lista'
        />
        <Toolbar.Button
          onClick={() => handleSnippetInsert('codeLine')}
          icon='code'
          label='Inserir trecho de código'
        />
        <Toolbar.Button
          onClick={() => handleSnippetInsert('codeBlock')}
          icon='runnable-code'
          label='Inserir trecho de código não executável'
        />
        <Toolbar.Button
          onClick={() => handleSnippetInsert('link')}
          icon='link'
          label='Inserir trecho de código não executável'
        />
      </Toolbar.Container>
      <div className='grid grid-cols-2 gap-3 mt-3 h-full bg-gray-800'>
        <div className='max-h-screen overflow-auto'>
          {errorMessage && (
            <p className='text-red-600 font-bold text-sm mt-3 pl-6'>{errorMessage}</p>
          )}
          <TextEditor
            ref={textEditorRef}
            value={content}
            onChange={textEditorChange}
            className='min-h-screen pl-6'
          />
        </div>
        <Mdx>{previewContent}</Mdx>
      </div>
    </>
  )
}
