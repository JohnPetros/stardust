import { type RefObject, type KeyboardEvent, useState, useEffect } from 'react'

import type {
  TextEditorRef,
  TextEditorSnippet,
} from '@/ui/global/widgets/components/TextEditor/types'

export function useContentEditor(
  content: string,
  textEditorRef: RefObject<TextEditorRef>,
  onChange: (value: string) => void,
) {
  const [previewContent, setPreviewContent] = useState(content.replaceAll('\n', '\n\n'))

  function handleSnippetInsert(snippet: TextEditorSnippet) {
    if (!textEditorRef.current) return
    textEditorRef.current.insertSnippet(snippet)
  }

  function textEditorChange(value: string) {
    onChange(value)
  }

  useEffect(() => {
    setPreviewContent(content.replaceAll('\n', '\n\n'))
  }, [content])

  return {
    previewContent,
    handleSnippetInsert,
    textEditorChange,
  }
}
