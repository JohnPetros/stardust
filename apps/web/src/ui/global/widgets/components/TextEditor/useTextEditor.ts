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

  function getSelectedValue() {
    if (!textareaRef.current) return ''
    const selectedValue = textareaRef.current.value.substring(
      textareaRef.current.selectionStart,
      textareaRef.current.selectionEnd,
    )
    return selectedValue
  }

  function isCursorInLineFirstPosition(currentLinePosition: number) {
    if (!textareaRef.current) return false
    const currentCharacter = textareaRef.current.value[currentLinePosition]
    return !currentCharacter
  }

  function isCursorInOrderedList() {
    if (!textareaRef.current) return false

    const linePosition = getCurrentLinePosition()
    const orderedListIndexingRegex = /\d\./
    const oderedListIndexing = textareaRef.current.value.substring(
      linePosition,
      linePosition + 2,
    )
    return orderedListIndexingRegex.test(oderedListIndexing)
  }

  function isCursorInUnorderedList() {
    if (!textareaRef.current) return false

    const linePosition = getCurrentLinePosition()
    const oderedListIndexing = textareaRef.current.value.substring(
      linePosition,
      linePosition + 2,
    )
    return oderedListIndexing.substring(0, 2) === SNIPPETS.unorderedList
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
          textareaRef.current.value = `${valueBeforeCursorPosition} ${valueAfterCursorPosition}`
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

          const selectedValue = getSelectedValue()
          const valueBeforeSelectedValue = textareaRef.current.value.substring(
            0,
            selectionStart,
          )
          const valueAfterSelectedValue =
            textareaRef.current.value.substring(selectionEnd)

          textareaRef.current.value = `${valueBeforeSelectedValue} *${selectedValue}* ${valueAfterSelectedValue}`
          return
        }

        const { valueBeforeCursorPosition, valueAfterCursorPosition } =
          getValueAfterAndBeforeCurrentLinePosition(currentCursorPosition)

        textareaRef.current.value = `${valueBeforeCursorPosition}${SNIPPETS[snippet]}${valueAfterCursorPosition}`
        const starsCountInEachSide = 1
        const snippetContent = SNIPPETS.strong.replace(/\*/g, '')
        const selectionStart = currentCursorPosition + starsCountInEachSide + 1
        const selectionEnd = selectionStart + snippetContent.length - 1
        textareaRef.current.setSelectionRange(selectionStart, selectionEnd)
        break
      }

      case 'orderedList': {
        const currentLinePosition = getCurrentLinePosition()

        const { valueBeforeCursorPosition, valueAfterCursorPosition } =
          getValueAfterAndBeforeCurrentLinePosition(currentLinePosition)

        if (isCursorInOrderedList()) {
          const listItemContent = valueAfterCursorPosition.substring(3)
          textareaRef.current.value = `${valueBeforeCursorPosition}${listItemContent}`
          textareaRef.current.setSelectionRange(
            currentLinePosition,
            currentLinePosition + listItemContent.length,
          )
          return
        }

        if (isCursorInLineFirstPosition(currentLinePosition)) {
          textareaRef.current.value = `${valueBeforeCursorPosition}${SNIPPETS.orderedList}${valueAfterCursorPosition}`
          const newCursorPosition = getCurrentLinePosition() + 2
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
          return
        }

        const lineContent = getCurrentLineContent(currentLinePosition)

        textareaRef.current.value = `${valueBeforeCursorPosition}${SNIPPETS.orderedList} ${valueAfterCursorPosition}`

        const selectionStartPosition = currentLinePosition + 4
        const selectionEndPosition = selectionStartPosition + lineContent.length + 1
        textareaRef.current.setSelectionRange(
          selectionStartPosition,
          selectionEndPosition,
        )
        break
      }

      case 'unorderedList': {
        const currentLinePosition = getCurrentLinePosition()

        const { valueBeforeCursorPosition, valueAfterCursorPosition } =
          getValueAfterAndBeforeCurrentLinePosition(currentLinePosition)

        if (isCursorInUnorderedList()) {
          const listItemContent = valueAfterCursorPosition.substring(2)
          textareaRef.current.value = `${valueBeforeCursorPosition}${listItemContent}`
          textareaRef.current.setSelectionRange(
            currentLinePosition,
            currentLinePosition + listItemContent.length,
          )
          return
        }

        if (isCursorInLineFirstPosition(currentLinePosition)) {
          textareaRef.current.value = `${valueBeforeCursorPosition}${SNIPPETS.unorderedList}${valueAfterCursorPosition}`
          const newCursorPosition = getCurrentLinePosition() + 2
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
          return
        }

        const lineContent = getCurrentLineContent(currentLinePosition)

        textareaRef.current.value = `${valueBeforeCursorPosition}${SNIPPETS.unorderedList} ${valueAfterCursorPosition}`

        const selectionStartPosition = currentLinePosition + 3
        const selectionEndPosition = selectionStartPosition + lineContent.length + 1
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

  function insertNewOrderedListItem() {
    if (!textareaRef.current) return

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

    setTimeout(() => {
      if (!textareaRef.current) return

      textareaRef.current.value = `${textareaRef.current.value.substring(
        0,
        textareaRef.current?.value.length - 2,
      )} `
    }, 10)
  }

  function insertNewUnorderedListItem() {
    if (!textareaRef.current) return

    const { valueBeforeCursorPosition, valueAfterCursorPosition } =
      getValueAfterAndBeforeCurrentLinePosition(getCurrentCursorPosition())
    textareaRef.current.value = `${valueBeforeCursorPosition}\n${SNIPPETS.unorderedList}${valueAfterCursorPosition}`

    setTimeout(() => {
      if (!textareaRef.current) return

      textareaRef.current.value = `${textareaRef.current.value.substring(
        0,
        textareaRef.current?.value.length - 2,
      )} `
    }, 10)
  }

  function handleKeyDown({ key }: KeyboardEvent) {
    if (key === 'Enter') {
      if (isCursorInOrderedList()) {
        insertNewOrderedListItem()
        return
      }

      if (isCursorInUnorderedList()) {
        insertNewUnorderedListItem()
        return
      }
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
