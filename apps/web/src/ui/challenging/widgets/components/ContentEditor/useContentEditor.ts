import { useState, useEffect } from 'react'

type Params = {
  content: string
  onChange: (value: string) => void
}

export function useContentEditor({ content, onChange }: Params) {
  const [previewContent, setPreviewContent] = useState(content.replaceAll('\n', '\n\n'))

  function handleTextEditorChange(value: string) {
    onChange(value)
  }

  useEffect(() => {
    setPreviewContent(content.replaceAll('\n', '\n\n'))
  }, [content])

  return {
    previewContent,
    handleTextEditorChange,
  }
}
