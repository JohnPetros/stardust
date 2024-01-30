'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'

import { useValidation } from '@/services/validation'
import { SNIPPETS } from '@/utils/constants'
import { getComponentContent } from '@/utils/helpers'

export function useUserCommentInput(
  comment: string,
  onCommentChange: (comment: string) => void,
  onPost: (comment: string) => void
) {
  const [errorMessage, setErrorMessage] = useState('')
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const validation = useValidation()

  function moveCursorToEnd() {
    if (!textareaRef.current) return

    textareaRef.current.focus()
    const currentValue = textareaRef.current.value
    textareaRef.current.value = ''
    textareaRef.current.value = currentValue
  }

  function selectSnippetComponentContent(
    currentCursorPosition: number,
    closeTag: string,
    snippetComponent: string
  ) {
    if (!textareaRef.current) return

    const snippetComponentContent = getComponentContent(snippetComponent)

    const start =
      currentCursorPosition - (snippetComponentContent.length + closeTag.length)

    const end = currentCursorPosition - closeTag.length

    textareaRef.current.setSelectionRange(start, end)
  }

  function handleInsertSnippet(snippet: keyof typeof SNIPPETS) {
    if (!textareaRef.current) return

    textareaRef.current.value += ` ${SNIPPETS[snippet]}`

    const currentCursorPosition = textareaRef.current.selectionStart

    switch (snippet) {
      case 'strong': {
        const starsCountInEachSide = 1

        const strongContent = SNIPPETS.strong.replace(/\*/g, '')

        textareaRef.current.setSelectionRange(
          currentCursorPosition - starsCountInEachSide - strongContent.length,
          currentCursorPosition - starsCountInEachSide
        )
        break
      }
      case 'code':
        selectSnippetComponentContent(
          currentCursorPosition,
          '</code>',
          SNIPPETS.code
        )
        break
      case 'runnableCode':
        selectSnippetComponentContent(
          currentCursorPosition,
          '</Code>',
          SNIPPETS.runnableCode
        )
        break
      case 'link':
        selectSnippetComponentContent(
          currentCursorPosition,
          '</Link>',
          SNIPPETS.link
        )
        break

      default:
        return
    }

    textareaRef.current.focus()
  }

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
    if (!isPreviewVisible) {
      moveCursorToEnd()
    }
  }, [isPreviewVisible])

  return {
    textareaRef,
    errorMessage,
    isPreviewVisible,
    handleTogglePreview,
    handlePostComment,
    handleCommentChange,
    handleInsertSnippet,
  }
}
