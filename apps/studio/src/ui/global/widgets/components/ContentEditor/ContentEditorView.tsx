import type { TextEditorWidget } from '@/ui/global/contexts/TextEditorContext/TextEditorWidget'
import { Toolbar } from '@/ui/global/widgets/components/Toolbar'
import { TextEditor } from '@/ui/global/widgets/components/TextEditor'
import { Mdx } from '@/ui/global/widgets/components/Mdx'

type Props = {
  content: string
  onChange: (content: string) => void
  onTextEditorWidgetInsert: (widget: TextEditorWidget) => void
  height?: number | string
}

export const ContentEditorView = ({
  content,
  onChange,
  onTextEditorWidgetInsert,
  height = '100%',
}: Props) => {
  return (
    <div className='flex flex-col gap-4 h-full'>
      <Toolbar.Container className='flex items-center gap-3 px-6 py-2 border border-zinc-700 bg-zinc-900 overflow-x-auto'>
        <Toolbar.Button
          onClick={() => onTextEditorWidgetInsert('title')}
          icon='title'
          label='Título principal'
        />
        <Toolbar.Button
          onClick={() => onTextEditorWidgetInsert('textBlock')}
          icon='text-block'
          label='Bloco de texto'
        />
        <Toolbar.Button
          onClick={() => onTextEditorWidgetInsert('quoteTextBlock')}
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
          label='Lista numérica'
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
          onClick={() => onTextEditorWidgetInsert('runnableCodeBlock')}
          icon='runnable-code'
          label='Inserir bloco de código'
        />
        <Toolbar.Button
          onClick={() => onTextEditorWidgetInsert('link')}
          icon='link'
          label='Inserir link'
        />
      </Toolbar.Container>

      <div className='grid grid-cols-[1fr_1fr] gap-6 px-6 h-full overflow-hidden'>
        <div className='space-y-2 h-full overflow-hidden flex flex-col'>
          <h2 className='text-green-400 font-semibold'>Editor</h2>
          <TextEditor value={content} width='100%' height={height} onChange={onChange} />
        </div>
        <div style={{ height: height }} className='overflow-y-auto space-y-2'>
          <h2 className='text-green-400 font-semibold'>Pré-visualização</h2>
          <div>{content && <Mdx className='w-full space-y-4'>{content}</Mdx>}</div>
        </div>
      </div>
    </div>
  )
}
