import { type FormEvent, type RefObject, useEffect, useState } from 'react'

import type { TextEditorRef, TextEditorSnippet } from '../../TextEditor/types'

type UseCommentInput = {
  textEditorRef: RefObject<TextEditorRef>
  onSend: (content: string) => void
  defaultContent: string
}

export function useCommentInput({
  textEditorRef,
  defaultContent,
  onSend,
}: UseCommentInput) {
  const [errorMessage, setErrorMessage] = useState('')
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const [content, setContent] = useState(defaultContent)

  function handleTogglePreview() {
    setIsPreviewVisible(!isPreviewVisible)
  }

  function handlePostComment(event: FormEvent) {
    event.preventDefault()
    if (!content) {
      setErrorMessage('Seu cometário não pode estar vazio')
      return
    }
    onSend(content)
    setContent('')
    setErrorMessage('')
  }

  function handleSnippetInsert(snippet: TextEditorSnippet) {
    if (!textEditorRef.current) return
    textEditorRef.current.insertSnippet(snippet)
  }

  function handleContentChange(content: string) {
    setContent(content)
  }

  useEffect(() => {
    setErrorMessage('')
  }, [])

  useEffect(() => {
    if (!isPreviewVisible) {
      textEditorRef.current?.moveCursorToEnd()
    }
  }, [isPreviewVisible, textEditorRef.current?.moveCursorToEnd])

  return {
    content,
    textEditorRef,
    errorMessage,
    isPreviewVisible,
    handlePostComment,
    handleTogglePreview,
    handleContentChange,
    handleSnippetInsert,
  }
}
