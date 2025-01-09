'use client'

import { type KeyboardEvent, useCallback, useRef } from 'react'

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

  function getCurrentCursorPosition() {
    if (!textareaRef.current) return 0
    return textareaRef.current.selectionStart
  }

  function getCurrentLinePosition() {
    if (!textareaRef.current) return 0

    const currentCursorPosition = textareaRef.current.selectionStart
    const textBeforeCursor = textareaRef.current.value.substring(0, currentCursorPosition)
    const lastNewlineIndex = textBeforeCursor.lastIndexOf('\n')
    if (lastNewlineIndex === -1) return 0
    return lastNewlineIndex + 1
  }

  function isCursorInLineFirstPosition(currentLinePosition: number) {
    if (!textareaRef.current) return false
    const currentCharacter = textareaRef.current.value[currentLinePosition]
    return !currentCharacter
  }

  function isCursorInList() {
    if (!textareaRef.current) return false

    const linePosition = getCurrentLinePosition()
    const lineContent = getCurrentLineContent(linePosition)
    const orderedListIndexingRegex = /\d\./
    const oderedListIndexing = textareaRef.current.value.substring(
      linePosition,
      linePosition + 2,
    )
    return orderedListIndexingRegex.test(oderedListIndexing)
  }

  function getValueAfterAndBeforeCurrentLinePosition(currentLinePosition: number) {
    if (!textareaRef.current)
      return {
        valueBeforeCursorPosition: '',
        valueAfterCursorPosition: '',
      }

    const valueBeforeCursorPosition = textareaRef.current.value.substring(
      0,
      currentLinePosition,
    )
    const valueAfterCursorPosition =
      textareaRef.current.value.substring(currentLinePosition)

    return {
      valueBeforeCursorPosition,
      valueAfterCursorPosition,
    }
  }

  function getCurrentLineContent(currentLinePosition: number) {
    if (!textareaRef.current) return ''

    const { valueAfterCursorPosition } =
      getValueAfterAndBeforeCurrentLinePosition(currentLinePosition)

    const currentLineLastIndex = valueAfterCursorPosition.indexOf('\n')

    const lineContent = textareaRef.current.value.substring(
      currentLinePosition,
      currentLinePosition +
        (currentLineLastIndex === -1
          ? valueAfterCursorPosition.length - 1
          : currentLineLastIndex),
    )

    return lineContent
  }

  function insertSnippet(snippet: TextEditorSnippet) {
    if (!textareaRef.current) return

    const currentCursorPosition = textareaRef.current.selectionStart

    switch (snippet) {
      case 'title': {
        const titleNotation = '#'
        const currentLinePosition = getCurrentLinePosition()
        const { valueBeforeCursorPosition, valueAfterCursorPosition } =
          getValueAfterAndBeforeCurrentLinePosition(currentLinePosition)

        if (isCursorInLineFirstPosition(currentLinePosition)) {
          const lineContent = SNIPPETS.title

          textareaRef.current.value = `${valueBeforeCursorPosition}${lineContent} ${valueAfterCursorPosition}`

          const selectionStart = currentLinePosition + 2
          const selectionEnd = selectionStart + lineContent.substring(2).length
          textareaRef.current.setSelectionRange(selectionStart, selectionEnd)
          return
        }

        let lineContent = getCurrentLineContent(currentLinePosition)

        let currentTitleNotation = '#'
        while (lineContent[0] === titleNotation) {
          currentTitleNotation += '#'
          lineContent = lineContent.substring(1)
        }

        textareaRef.current.value = `${valueBeforeCursorPosition}${currentTitleNotation} ${valueAfterCursorPosition.substring(currentTitleNotation.length - 1)}`

        const hasExtraEndLine = valueAfterCursorPosition.includes('\n')

        const selectionStart = currentLinePosition + currentTitleNotation.length + 1
        const selectionEnd =
          selectionStart + lineContent.length + (hasExtraEndLine ? 0 : 1)
        textareaRef.current.setSelectionRange(selectionStart, selectionEnd)
        break
      }
      case 'strong': {
        if (textareaRef.current.selectionStart !== textareaRef.current.selectionEnd) {
          const selectionStart = textareaRef.current.selectionStart
          const selectionEnd = textareaRef.current.selectionEnd

          const selectedValue = textareaRef.current.value.substring(
            selectionStart,
            selectionEnd,
          )
          const valueBeforePosition = textareaRef.current.value.substring(
            0,
            selectionStart,
          )
          const valueAfterPosition = textareaRef.current.value.substring(selectionEnd)

          textareaRef.current.value = `${valueBeforePosition} *${selectedValue}* ${valueAfterPosition}`
          return
        }

        const { valueBeforeCursorPosition, valueAfterCursorPosition } =
          getValueAfterAndBeforeCurrentLinePosition(currentCursorPosition)

        textareaRef.current.value = `${valueBeforeCursorPosition}${SNIPPETS[snippet]}${valueAfterCursorPosition}`

        const starsCountInEachSide = 1

        const snippetContent = SNIPPETS.strong.replace(/\*/g, '')

        const start = currentCursorPosition + starsCountInEachSide + 1
        const end = start + snippetContent.length - 1

        textareaRef.current.setSelectionRange(start, end)
        break
      }

      case 'orderedList': {
        const currentLinePosition = getCurrentLinePosition()

        const { valueBeforeCursorPosition, valueAfterCursorPosition } =
          getValueAfterAndBeforeCurrentLinePosition(currentLinePosition)

        if (isCursorInLineFirstPosition(currentLinePosition)) {
          textareaRef.current.value = `${valueBeforeCursorPosition}${SNIPPETS.orderedList}${valueAfterCursorPosition}`
          const newCursorPosition = getCurrentLinePosition() + 2
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
          return
        }

        const lineContent = getCurrentLineContent(currentLinePosition)

        textareaRef.current.value = `${valueBeforeCursorPosition}${SNIPPETS.orderedList} ${valueAfterCursorPosition}`

        const selectionStartPosition = currentLinePosition + 2
        const selectionEndPosition = currentLinePosition + lineContent.length
        textareaRef.current.setSelectionRange(
          selectionStartPosition,
          selectionEndPosition,
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

  function handleKeyDown({ key }: KeyboardEvent) {
    if (!textareaRef.current) return
    if (key === 'Enter') {
      if (!isCursorInList()) return

      const linePosition = getCurrentLinePosition()
      const numberRegex = /\d+/g
      const oderedListIndexing = textareaRef.current.value.substring(
        linePosition,
        linePosition + 2,
      )
      const indexingNumber = oderedListIndexing.match(numberRegex)
      const { valueBeforeCursorPosition, valueAfterCursorPosition } =
        getValueAfterAndBeforeCurrentLinePosition(getCurrentCursorPosition())
      textareaRef.current.value = `${valueBeforeCursorPosition}\n${Number(indexingNumber) + 1}. ${valueAfterCursorPosition}`
    }
  }

  return {
    textareaRef,
    handleKeyDown,
    handleValueChange,
    moveCursorToEnd,
    insertSnippet,
    insertValue,
  }
}
