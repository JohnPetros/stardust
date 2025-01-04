import type { RefObject } from 'react'

import type {
  TextEditorRef,
  TextEditorSnippet,
} from '@/ui/global/widgets/components/TextEditor/types'

export function useContentEditor(textEditorRef: RefObject<TextEditorRef>) {
  function handleSnippetInsert(snippet: TextEditorSnippet) {
    if (!textEditorRef.current) return
    textEditorRef.current.insertSnippet(snippet)
  }

  return {
    handleSnippetInsert,
  }
}
