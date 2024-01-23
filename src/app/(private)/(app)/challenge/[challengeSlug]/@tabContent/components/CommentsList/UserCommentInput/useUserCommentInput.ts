'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'

import { useValidation } from '@/services/validation'

export function useUserCommentInput(
  comment: string,
  onCommentChange: (comment: string) => void,
  onPost: (comment: string) => void
) {
  const [errorMessage, setErrorMessage] = useState('')
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const validation = useValidation()

  function handleTogglePreview() {
    setIsPreviewVisible(!isPreviewVisible)
  }

  function handlePostComment(event: FormEvent) {
    event.preventDefault()

    const result = validation.validateComment(comment)

    if (result.isValid) {
      onPost(comment)
      return
    }

    setErrorMessage(result.errors[0])
  }

  function handleCommentChange(comment: string) {
    onCommentChange(comment)
  }

  useEffect(() => {
    setErrorMessage('')

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [comment])

  useEffect(() => {
    if (!textareaRef.current) return

    textareaRef.current.focus()
    const currentValue = textareaRef.current.value
    textareaRef.current.value = ''
    textareaRef.current.value = currentValue
  }, [])

  return {
    textareaRef,
    errorMessage,
    isPreviewVisible,
    handleTogglePreview,
    handlePostComment,
    handleCommentChange,
  }
}
