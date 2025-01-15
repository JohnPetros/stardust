'use client'

import { type FormEvent, type RefObject, useEffect, useState } from 'react'

import { Text } from '@stardust/core/global/structs'
import { ValidationError } from '@stardust/core/global/errors'

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
    try {
      const commentContent = Text.create(content, 'seu comentário')
      onSend(commentContent.value)
      setContent('')
    } catch (error) {
      if (error instanceof ValidationError)
        setErrorMessage(String(error.fieldErrors[0]?.messages[0]))
    }
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
    if (!isPreviewVisible && textEditorRef.current) {
      textEditorRef.current?.moveCursorToEnd()
    }
  }, [isPreviewVisible, textEditorRef.current])

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
