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

  function getCursorPosition() {
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

  function getValueAfterAndBeforeLinePosition(currentLinePosition: number) {
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
      getValueAfterAndBeforeLinePosition(currentLinePosition)

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

  function insertSnippetLinkComponent() {
    if (!textareaRef.current) return

    const linkContent = geComponentContent(SNIPPETS.link)
    const cursorPosition = getCursorPosition()
    const { valueAfterCursorPosition, valueBeforeCursorPosition } =
      getValueAfterAndBeforeLinePosition(cursorPosition)

    const urlPlaceholder = 'Insira a url do link aqui'
    const urlParam = `url={${urlPlaceholder}}`
    const openTag = `<Link ${urlParam}>`
    const closeTag = '</Link>'

    textareaRef.current.value = `${valueBeforeCursorPosition}${openTag}${linkContent}${closeTag}${valueAfterCursorPosition}`

    const urlIndex = `${valueBeforeCursorPosition}${openTag}`.indexOf(urlParam) + 5
    const selectionStart = urlIndex
    const selectionEnd = selectionStart + urlPlaceholder.length

    textareaRef.current.setSelectionRange(selectionStart, selectionEnd)
  }

  function insertCodeBlockSnippetComponent() {
    if (!textareaRef.current) return

    const snippetComponentContent = geComponentContent(SNIPPETS.codeBlock)
    const cursorPosition = getCursorPosition()
    const { valueAfterCursorPosition, valueBeforeCursorPosition } =
      getValueAfterAndBeforeLinePosition(cursorPosition)

    const openTag = '<Code>'
    const closeTag = '</Code>'

    textareaRef.current.value = `${valueBeforeCursorPosition}${openTag}\n${snippetComponentContent}\n${closeTag}${valueAfterCursorPosition}`

    const closeTagIndex =
      `${valueBeforeCursorPosition}${openTag}\n${snippetComponentContent}\n`.lastIndexOf(
        '\n',
      )
    const selectionStart = closeTagIndex - snippetComponentContent.length
    const selectionEnd = selectionStart + snippetComponentContent.length

    textareaRef.current.setSelectionRange(selectionStart, selectionEnd)
  }

  function insertSnippetComponent(closeTag: string, snippetComponent: string) {
    if (!textareaRef.current) return

    const snippetComponentContent = geComponentContent(snippetComponent)
    const cursorPosition = getCursorPosition()
    const { valueAfterCursorPosition, valueBeforeCursorPosition } =
      getValueAfterAndBeforeLinePosition(cursorPosition)

    const openTag = snippetComponent.substring(0, closeTag.length - 1)

    textareaRef.current.value = `${valueBeforeCursorPosition}\n${openTag}${snippetComponentContent}${closeTag}${valueAfterCursorPosition}`

    const selectionStart = cursorPosition + openTag.length
    const selectionEnd = selectionStart + snippetComponentContent.length

    textareaRef.current.setSelectionRange(selectionStart, selectionEnd)
  }

  function insertUnorderedListSnippet() {
    if (!textareaRef.current) return

    const currentLinePosition = getCurrentLinePosition()

    const { valueBeforeCursorPosition, valueAfterCursorPosition } =
      getValueAfterAndBeforeLinePosition(currentLinePosition)

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
    textareaRef.current.setSelectionRange(selectionStartPosition, selectionEndPosition)
  }

  function insertOrderedListSnippet() {
    if (!textareaRef.current) return
    const currentLinePosition = getCurrentLinePosition()

    const { valueBeforeCursorPosition, valueAfterCursorPosition } =
      getValueAfterAndBeforeLinePosition(currentLinePosition)

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
    textareaRef.current.setSelectionRange(selectionStartPosition, selectionEndPosition)
  }

  function insertStrongSnippet() {
    if (!textareaRef.current) return

    if (textareaRef.current.selectionStart !== textareaRef.current.selectionEnd) {
      const selectionStart = textareaRef.current.selectionStart
      const selectionEnd = textareaRef.current.selectionEnd

      const selectedValue = getSelectedValue()
      const valueBeforeSelectedValue = textareaRef.current.value.substring(
        0,
        selectionStart,
      )
      const valueAfterSelectedValue = textareaRef.current.value.substring(selectionEnd)

      textareaRef.current.value = `${valueBeforeSelectedValue} *${selectedValue}* ${valueAfterSelectedValue}`
      return
    }

    const cursorPosition = getCursorPosition()
    const { valueBeforeCursorPosition, valueAfterCursorPosition } =
      getValueAfterAndBeforeLinePosition(cursorPosition)

    textareaRef.current.value = `${valueBeforeCursorPosition}${SNIPPETS.strong}${valueAfterCursorPosition}`
    const starsCountInEachSide = 1
    const snippetContent = SNIPPETS.strong.replace(/\*/g, '')
    const selectionStart = cursorPosition + starsCountInEachSide + 1
    const selectionEnd = selectionStart + snippetContent.length - 1
    textareaRef.current.setSelectionRange(selectionStart, selectionEnd)
  }

  function insertCodeLineSnippet() {
    if (!textareaRef.current) return

    if (textareaRef.current.selectionStart !== textareaRef.current.selectionEnd) {
      const selectionStart = textareaRef.current.selectionStart
      const selectionEnd = textareaRef.current.selectionEnd

      const selectedValue = getSelectedValue()
      const valueBeforeSelectedValue = textareaRef.current.value.substring(
        0,
        selectionStart,
      )
      const valueAfterSelectedValue = textareaRef.current.value.substring(selectionEnd)

      textareaRef.current.value = `${valueBeforeSelectedValue} \`${selectedValue}\` ${valueAfterSelectedValue}`
      return
    }

    const cursorPosition = getCursorPosition()
    const { valueBeforeCursorPosition, valueAfterCursorPosition } =
      getValueAfterAndBeforeLinePosition(cursorPosition)

    textareaRef.current.value = `${valueBeforeCursorPosition}${SNIPPETS.codeLine}${valueAfterCursorPosition}`
    const starsCountInEachSide = 1
    const snippetContent = SNIPPETS.codeLine.replace(/\`/g, '')
    const selectionStart = cursorPosition + starsCountInEachSide
    const selectionEnd = selectionStart + snippetContent.length - starsCountInEachSide
    textareaRef.current.setSelectionRange(selectionStart, selectionEnd)
  }

  function insertTitleSnippet() {
    if (!textareaRef.current) return

    const titleNotation = '#'
    const currentLinePosition = getCurrentLinePosition()
    const { valueBeforeCursorPosition, valueAfterCursorPosition } =
      getValueAfterAndBeforeLinePosition(currentLinePosition)

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
    const selectionEnd = selectionStart + lineContent.length + (hasExtraEndLine ? 0 : 1)
    textareaRef.current.setSelectionRange(selectionStart, selectionEnd)
  }

  function insertSnippet(snippet: TextEditorSnippet) {
    switch (snippet) {
      case 'title':
        insertTitleSnippet()
        break
      case 'strong':
        insertStrongSnippet()
        break
      case 'orderedList':
        insertOrderedListSnippet()
        break
      case 'unorderedList':
        insertUnorderedListSnippet()
        break
      case 'textBlock':
        insertSnippetComponent('</Text>', SNIPPETS.textBlock)
        break
      case 'strongTextBlock':
        insertSnippetComponent('</Quote>', SNIPPETS.strongTextBlock)
        break
      case 'codeLine':
        insertCodeLineSnippet()
        break
      case 'codeBlock':
        insertCodeBlockSnippetComponent()
        break
      case 'link':
        insertSnippetLinkComponent()
        break
      default:
        return
    }

    textareaRef.current?.focus()
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
      getValueAfterAndBeforeLinePosition(getCursorPosition())
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
      getValueAfterAndBeforeLinePosition(getCursorPosition())
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
