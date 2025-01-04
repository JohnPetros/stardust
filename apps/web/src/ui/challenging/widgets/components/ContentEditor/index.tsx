'use client'

import { useRef } from 'react'
import * as Toolbar from '@/ui/global/widgets/components/Toolbar'

import type { TextEditorRef } from '@/ui/global/widgets/components/TextEditor/types'
import { useContentEditor } from './useContentEditor'
import { TextEditor } from '@/ui/global/widgets/components/TextEditor'
import { Mdx } from '@/ui/global/widgets/components/Mdx'

type ContentEditorProps = {
  content: string
  errorMessage?: string
  onChange: (content: string) => void
}

export function ContentEditor({ content, onChange }: ContentEditorProps) {
  const textEditorRef = useRef<TextEditorRef>(null)
  const { previewContent, handleSnippetInsert, handleKeyUp, textEditorChange } =
    useContentEditor(content, textEditorRef, onChange)

  return (
    <div>
      <Toolbar.Container className='flex items-center gap-3 px-6 py-3 border-b border-gray-600'>
        <Toolbar.Button
          onClick={() => handleSnippetInsert('title')}
          icon='title'
          label='Título principal'
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
          onClick={() => handleSnippetInsert('code')}
          icon='ordered-list'
          label='Lista numéria'
        />
        <Toolbar.Button
          onClick={() => handleSnippetInsert('code')}
          icon='unordered-list'
          label='Lista'
        />
        <Toolbar.Button
          onClick={() => handleSnippetInsert('code')}
          icon='code'
          label='Inserir trecho de código'
        />
        <Toolbar.Button
          onClick={() => handleSnippetInsert('runnableCode')}
          icon='runnable-code'
          label='Inserir trecho de código não executável'
        />
        <Toolbar.Button
          onClick={() => handleSnippetInsert('link')}
          icon='link'
          label='Inserir trecho de código não executável'
        />
      </Toolbar.Container>
      <div className='grid grid-cols-2 h-full'>
        <TextEditor
          ref={textEditorRef}
          value={content}
          onChange={textEditorChange}
          onKeyUp={handleKeyUp}
          className='h-full mt-1 pl-6'
        />
        <Mdx>{previewContent}</Mdx>
      </div>
    </div>
  )
}
