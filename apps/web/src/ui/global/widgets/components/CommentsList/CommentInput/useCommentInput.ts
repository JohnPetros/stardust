'use client'

import { type FormEvent, useEffect, useRef, useState } from 'react'

import { SNIPPETS } from '../snippets'
import { Text } from '@stardust/core/global/structs'
import { ValidationError } from '@stardust/core/global/errors'
import { REGEX } from '@/constants'

export function useCommentInput(
  content: string,
  onChange: (content: string) => void,
  onSend: (content: string) => void,
) {
  const [errorMessage, setErrorMessage] = useState('')
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function geComponentContent(component: string) {
    const nameMatch = REGEX.componentName.exec(component)
    const componentName = nameMatch ? nameMatch[1] : 'Text'

    const componentRegex = new RegExp(
      `<${componentName}[^>]*>([\\s\\S]*?)</${componentName}>`,
      'g',
    )

    const contentMatch = componentRegex.exec(component)
    if (contentMatch !== null) {
      if (contentMatch[1]) return contentMatch[1]
    }

    return ''
  }

  function selectSnippetComponentContent(
    currentCursorPosition: number,
    closeTag: string,
    snippetComponent: string,
  ) {
    if (!textareaRef.current) return

    const snippetComponentContent = geComponentContent(snippetComponent)

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
          currentCursorPosition - starsCountInEachSide,
        )
        break
      }
      case 'code':
        selectSnippetComponentContent(currentCursorPosition, '</code>', SNIPPETS.code)
        break
      case 'runnableCode':
        selectSnippetComponentContent(
          currentCursorPosition,
          '</Code>',
          SNIPPETS.runnableCode,
        )
        break
      case 'link':
        selectSnippetComponentContent(currentCursorPosition, '</Link>', SNIPPETS.link)
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

    try {
      const commentContent = Text.create(content)
      onSend(commentContent.value)
    } catch (error) {
      if (error instanceof ValidationError)
        setErrorMessage(String(error.fieldErrors[0]?.messages[0]))
    }
  }

  function handleCommentChange(comment: string) {
    onChange(comment)
  }

  useEffect(() => {
    setErrorMessage('')

    if (textareaRef.current && content) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [content])

  useEffect(() => {
    function moveCursorToEnd() {
      if (!textareaRef.current) return

      textareaRef.current.focus()
      const currentValue = textareaRef.current.value
      textareaRef.current.value = ''
      textareaRef.current.value = currentValue
    }

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
