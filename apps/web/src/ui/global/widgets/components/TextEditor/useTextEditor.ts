'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { REGEX } from '@/constants'
import { SNIPPETS } from './snippets'
import type { TextEditorSnippet } from './types'

export function useTextEditor(onChange: (value: string) => void) {
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

  function getCurrentLinePosition() {
    if (!textareaRef.current) return 0

    const currentCursorPosition = textareaRef.current.selectionStart
    const textBeforeCursor = textareaRef.current.value.substring(0, currentCursorPosition)
    const lastNewlineIndex = textBeforeCursor.lastIndexOf('\n')
    return lastNewlineIndex + 1
  }

  function insertSnippet(snippet: TextEditorSnippet) {
    if (!textareaRef.current) return

    const currentCursorPosition = textareaRef.current.selectionStart

    switch (snippet) {
      case 'title': {
        const currentLinePosition = getCurrentLinePosition()
        const valueBeforeCurrentLinePosition = textareaRef.current.value.substring(
          0,
          currentLinePosition,
        )
        const valueAfterCurrentLinePosition =
          textareaRef.current.value.substring(currentLinePosition)

        const lineContent = textareaRef.current.value.substring(
          currentLinePosition,
          currentLinePosition + valueAfterCurrentLinePosition.indexOf('\n'),
        )

        textareaRef.current.value = `${valueBeforeCurrentLinePosition}# ${lineContent}${valueAfterCurrentLinePosition}`

        // textareaRef.current.setSelectionRange(linePosition, linePosition + 2)
        break
      }
      case 'strong': {
        textareaRef.current.value += ` ${SNIPPETS[snippet]}`

        const starsCountInEachSide = 1

        const strongContent = SNIPPETS.strong.replace(/\*/g, '')

        textareaRef.current.setSelectionRange(
          currentCursorPosition - starsCountInEachSide - strongContent.length,
          currentCursorPosition - starsCountInEachSide,
        )
        break
      }
      case 'textBlock':
        textareaRef.current.value += ` ${SNIPPETS[snippet]}`

        selectSnippetComponentContent(
          currentCursorPosition,
          '</Text>',
          SNIPPETS.textBlock,
        )
        break
      case 'strongTextBlock':
        textareaRef.current.value += ` ${SNIPPETS[snippet]}`

        selectSnippetComponentContent(
          currentCursorPosition,
          '</Quote>',
          SNIPPETS.strongTextBlock,
        )
        break
      case 'code':
        textareaRef.current.value += ` ${SNIPPETS[snippet]}`

        selectSnippetComponentContent(currentCursorPosition, '</code>', SNIPPETS.code)
        break
      case 'runnableCode':
        textareaRef.current.value += ` ${SNIPPETS[snippet]}`

        selectSnippetComponentContent(
          currentCursorPosition,
          '</Code>',
          SNIPPETS.runnableCode,
        )
        break
      case 'link':
        textareaRef.current.value += ` ${SNIPPETS[snippet]}`

        selectSnippetComponentContent(currentCursorPosition, '</Link>', SNIPPETS.link)
        break

      default:
        return
    }

    textareaRef.current.focus()
  }

  function insertValue(value: string) {
    if (!textareaRef.current) return

    textareaRef.current.value += value
  }

  const moveCursorToEnd = useCallback(() => {
    if (!textareaRef.current) return

    textareaRef.current.focus()
    const currentValue = textareaRef.current.value
    textareaRef.current.value = ''
    textareaRef.current.value = currentValue
  }, [])

  function handleValueChange(value: string) {
    onChange(value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return {
    textareaRef,
    handleValueChange,
    moveCursorToEnd,
    insertSnippet,
    insertValue,
  }
}
