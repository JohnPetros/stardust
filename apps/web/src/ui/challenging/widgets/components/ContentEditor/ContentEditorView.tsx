'use client'

import * as Toolbar from '@/ui/global/widgets/components/Toolbar'
import { Mdx } from '@/ui/global/widgets/components/Mdx'
import type { TextEditorWidget } from '@/ui/challenging/contexts/TextEditorContext/types'
import { TextEditor } from '../../pages/Challenges/TextEditor'

type Props = {
  content: string
  errorMessage?: string
  previewContent: string
  onChange: (content: string) => void
  onTextEditorWidgetInsert: (widget: TextEditorWidget) => void
}

export const ContentEditorView = ({
  content,
  errorMessage,
  previewContent,
  onChange,
  onTextEditorWidgetInsert,
}: Props) => {
  return (
    <>
      <Toolbar.Container className='flex items-center gap-3 px-6 py-3 border-b border-gray-600'>
        <Toolbar.Button
          onClick={() => onTextEditorWidgetInsert('title')}
          icon='title'
          label='Título principal'
        />
        <Toolbar.Button
          onClick={() => onTextEditorWidgetInsert('strong')}
          icon='strong'
          label='Inserir trecho em destaque'
        />
        <Toolbar.Button
          onClick={() => onTextEditorWidgetInsert('textBlock')}
          icon='text-block'
          label='Bloco de texto'
        />
        <Toolbar.Button
          onClick={() => onTextEditorWidgetInsert('strong')}
          icon='strong-text-block'
          label='Bloco de texto destacado'
        />
        <Toolbar.Button
          onClick={() => onTextEditorWidgetInsert('alertTextBlock')}
          icon='alert'
          label='Bloco de texto de alerta'
        />
        <Toolbar.Button
          onClick={() => onTextEditorWidgetInsert('orderedList')}
          icon='ordered-list'
          label='Lista numéria'
        />
        <Toolbar.Button
          onClick={() => onTextEditorWidgetInsert('unorderedList')}
          icon='unordered-list'
          label='Lista'
        />
        <Toolbar.Button
          onClick={() => onTextEditorWidgetInsert('codeLine')}
          icon='code'
          label='Inserir trecho de código'
        />
        <Toolbar.Button
          onClick={() => onTextEditorWidgetInsert('codeBlock')}
          icon='runnable-code'
          label='Inserir trecho de código não executável'
        />
        <Toolbar.Button
          onClick={() => onTextEditorWidgetInsert('link')}
          icon='link'
          label='Inserir trecho de código não executável'
        />
      </Toolbar.Container>
      <div className='grid grid-cols-2 gap-3 mt-3 h-full bg-gray-800'>
        <div className='max-h-screen overflow-auto'>
          {errorMessage && (
            <p className='text-red-600 font-bold text-sm mt-3 pl-6'>{errorMessage}</p>
          )}
          <TextEditor value={content} onChange={onChange} width='100%' height={500} />
        </div>
        <Mdx>{previewContent}</Mdx>
      </div>
    </>
  )
}
