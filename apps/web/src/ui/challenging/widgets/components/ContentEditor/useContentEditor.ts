import { type RefObject, type KeyboardEvent, useState } from 'react'

import type {
  TextEditorRef,
  TextEditorSnippet,
} from '@/ui/global/widgets/components/TextEditor/types'

export function useContentEditor(
  content: string,
  textEditorRef: RefObject<TextEditorRef>,
  onChange: (value: string) => void,
) {
  const [previewValue, setPreviewValue] = useState(content)

  function handleSnippetInsert(snippet: TextEditorSnippet) {
    if (!textEditorRef.current) return
    textEditorRef.current.insertSnippet(snippet)
  }

  function handleEnter() {}

  function textEditorChange(value: string) {
    setPreviewValue(value)
    onChange(value)
  }

  function handleKeyUp({ key }: KeyboardEvent) {
    const typedKey = key.toLowerCase()

    if (typedKey === 'enter') {
      handleEnter()
      return
    }
  }

  console.log({ previewValue })

  return {
    previewValue,
    handleKeyUp,
    handleSnippetInsert,
    textEditorChange,
  }
}
