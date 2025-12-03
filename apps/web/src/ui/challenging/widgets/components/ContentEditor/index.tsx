'use client'

import { ContentEditorView } from './ContentEditorView'
import { useContentEditor } from './useContentEditor'
import { useTextEditorContext } from '@/ui/challenging/hooks/useTextEditorContext'

type Props = {
  content: string
  errorMessage?: string
  onChange: (content: string) => void
}

export const ContentEditor = ({ content, errorMessage, onChange }: Props) => {
  const { insertWidget } = useTextEditorContext()
  const { previewContent, handleTextEditorChange } = useContentEditor({
    content,
    onChange,
  })

  return (
    <ContentEditorView
      content={content}
      errorMessage={errorMessage}
      previewContent={previewContent}
      onChange={handleTextEditorChange}
      onTextEditorWidgetInsert={insertWidget}
    />
  )
}
