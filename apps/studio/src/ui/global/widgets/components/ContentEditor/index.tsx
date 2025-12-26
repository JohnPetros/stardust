import { useTextEditorContext } from '@/ui/global/contexts/TextEditorContext'
import { ContentEditorView } from './ContentEditorView'

type Props = {
  content: string
  onChange: (content: string) => void
  height?: number | string
}

export const ContentEditor = ({ content, onChange, height }: Props) => {
  const { insertWidget } = useTextEditorContext()

  return (
    <ContentEditorView
      content={content}
      height={height}
      onChange={onChange}
      onTextEditorWidgetInsert={insertWidget}
    />
  )
}
