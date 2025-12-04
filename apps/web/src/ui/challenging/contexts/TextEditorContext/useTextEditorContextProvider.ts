import { useCallback, useMemo, type RefObject } from 'react'

import type { TextEditorContextValue } from './types/TextEditorContextValue'
import type { TextEditorWidget } from './types/TextEditorWdiget'
import type { TextEditorRef } from './types'

export function useTextEditorContextProvider(
  textEditorRef: RefObject<TextEditorRef | null>,
): TextEditorContextValue {
  const replaceLineContentAndSelect = useCallback(
    (
      lineNumber: number,
      currentLineContent: string,
      newContent: string,
      selectStartColumn?: number,
      selectEndColumn?: number,
    ) => {
      if (!textEditorRef.current) return

      textEditorRef.current.replaceContent(
        lineNumber,
        1,
        currentLineContent.length + 1,
        newContent,
      )

      const startColumn = selectStartColumn ?? 1
      const endColumn = selectEndColumn ?? newContent.length + 1

      textEditorRef.current.selectContent(lineNumber, startColumn, lineNumber, endColumn)
    },
    [textEditorRef],
  )

  const insertTagElement = useCallback(
    (tagName: string, tagContent: string, props: string[][] = []) => {
      if (!textEditorRef.current) return

      const cursorPosition = textEditorRef.current.getCursorPosition()
      if (!cursorPosition) return

      let lineNumber = cursorPosition.lineNumber

      const propsString = props?.map((prop) => `${prop[0]}={${prop[1]}}`).join(' ')

      const openTag = `<${tagName}${propsString ? ` ${propsString}` : ''}>`
      const closeTag = `</${tagName}>`

      const newValue = `${openTag}\n${tagContent}\n${closeTag}`

      let currentLineContent = textEditorRef.current.getLineContent(
        cursorPosition.lineNumber,
      )

      while (currentLineContent) {
        lineNumber++
        const lineCount = textEditorRef.current.getLineCount()

        if (lineNumber > lineCount) {
          textEditorRef.current.insertLineContent(lineCount, '')
          lineNumber = lineCount
        }

        currentLineContent = textEditorRef.current.getLineContent(lineNumber)
      }

      textEditorRef.current.insertLineContent(lineNumber, newValue)

      const nextLineNumber = lineNumber + 1

      textEditorRef.current?.selectContent(
        nextLineNumber,
        1,
        nextLineNumber,
        tagContent.length + 1,
      )
    },
    [textEditorRef.current],
  )

  const insertCodeLineElement = useCallback(
    (content: string) => {
      if (!textEditorRef.current) return

      const cursorPosition = textEditorRef.current.getCursorPosition()
      if (!cursorPosition) return

      const selectedContent = textEditorRef.current.getSelectedContent()

      if (selectedContent) {
        const codeLineElement = `\`${selectedContent}\``

        textEditorRef.current.replaceContent(
          cursorPosition.lineNumber,
          cursorPosition.columnNumber,
          cursorPosition.columnNumber + selectedContent.length,
          codeLineElement,
        )

        textEditorRef.current?.selectContent(
          cursorPosition.lineNumber,
          cursorPosition.columnNumber + 1,
          cursorPosition.lineNumber,
          cursorPosition.columnNumber + 1 + codeLineElement.length,
        )
        return
      }

      const codeLineElement = `\`${content}\``

      textEditorRef.current.insertLineContent(
        cursorPosition.lineNumber,
        codeLineElement,
        false,
      )

      textEditorRef.current?.selectContent(
        cursorPosition.lineNumber,
        cursorPosition.columnNumber + 1,
        cursorPosition.lineNumber,
        cursorPosition.columnNumber + 1 + content.length,
      )
    },
    [textEditorRef],
  )

  const insertListElement = useCallback(
    (isOrderedList: boolean) => {
      if (!textEditorRef.current) return

      const cursorPosition = textEditorRef.current.getCursorPosition()
      if (!cursorPosition) return

      const currentLineContent = textEditorRef.current.getLineContent(
        cursorPosition.lineNumber,
      )

      if (!currentLineContent || currentLineContent.trim() === '') {
        const bullet = isOrderedList ? '1.' : '-'
        const bulletWithSpace = `${bullet} `

        textEditorRef.current.insertLineContent(
          cursorPosition.lineNumber,
          bulletWithSpace,
        )

        const cursorColumnAfterBullet = bullet.length + 2

        textEditorRef.current.setCursorPosition({
          lineNumber: cursorPosition.lineNumber,
          columnNumber: cursorColumnAfterBullet,
        })
        return
      }

      const orderedListMatch = currentLineContent.match(/^(\d+\.)\s+(.+)$/)
      const unorderedListMatch = currentLineContent.match(/^(-\s+)(.+)$/)

      if (orderedListMatch) {
        const listContent = orderedListMatch[2]

        replaceLineContentAndSelect(
          cursorPosition.lineNumber,
          currentLineContent,
          listContent,
        )
        return
      }

      if (unorderedListMatch) {
        const listContent = unorderedListMatch[2]

        replaceLineContentAndSelect(
          cursorPosition.lineNumber,
          currentLineContent,
          listContent,
        )
        return
      }

      const bullet = isOrderedList ? '1.' : '-'
      const bulletWithSpace = `${bullet} `
      const trimmedContent = currentLineContent.trim()
      const listItem = `${bulletWithSpace}${trimmedContent}`

      replaceLineContentAndSelect(
        cursorPosition.lineNumber,
        currentLineContent,
        listItem,
        bulletWithSpace.length + 1,
        bulletWithSpace.length + trimmedContent.length + 1,
      )
    },
    [textEditorRef, replaceLineContentAndSelect],
  )

  const insertTitleElement = useCallback(() => {
    if (!textEditorRef.current) return

    const cursorPosition = textEditorRef.current.getCursorPosition()
    if (!cursorPosition) return

    const currentLineContent = textEditorRef.current.getLineContent(
      cursorPosition.lineNumber,
    )

    if (!currentLineContent || currentLineContent.trim() === '') {
      const titleLevel = '#'
      const titleValue = 'Título'
      const titleElement = `${titleLevel} ${titleValue}`

      textEditorRef.current.insertLineContent(cursorPosition.lineNumber, titleElement)

      textEditorRef.current?.selectContent(
        cursorPosition.lineNumber,
        titleLevel.length + 2,
        cursorPosition.lineNumber,
        titleLevel.length + 2 + titleValue.length,
      )
      return
    }

    const titleMatch = currentLineContent.match(/^(#{1,6})\s+(.+)$/)

    if (titleMatch) {
      const currentTitleLevel = titleMatch[1]
      const titleContent = titleMatch[2]
      const currentLevel = currentTitleLevel.length

      if (currentLevel === 6) {
        const newContent = titleContent

        replaceLineContentAndSelect(
          cursorPosition.lineNumber,
          currentLineContent,
          newContent,
        )
      } else {
        const newTitleLevel = `${currentTitleLevel}#`
        const newTitleElement = `${newTitleLevel} ${titleContent}`

        replaceLineContentAndSelect(
          cursorPosition.lineNumber,
          currentLineContent,
          newTitleElement,
          newTitleLevel.length + 2,
          newTitleElement.length + 1,
        )
      }
    } else {
      const trimmedContent = currentLineContent.trim()
      const titleLevel = '#'
      const titleElement = `${titleLevel} ${trimmedContent}`

      replaceLineContentAndSelect(
        cursorPosition.lineNumber,
        currentLineContent,
        titleElement,
        titleLevel.length + 2,
        titleLevel.length + 2 + trimmedContent.length,
      )
    }
  }, [textEditorRef, replaceLineContentAndSelect])

  const insertWidget = useCallback(
    (widget: TextEditorWidget, props: string[][] = []) => {
      switch (widget) {
        case 'textBlock':
          insertTagElement('Text', 'Insira seu texto aqui', props)
          break
        case 'alertTextBlock':
          insertTagElement('Alert', 'Insira seu texto de alerta aqui', props)
          break
        case 'quoteTextBlock':
          insertTagElement('Quote', 'Insira seu texto de reflexão aqui', props)
          break
        case 'runnableCodeBlock':
          insertTagElement('Code', 'Insira seu codigo aqui', props)
          break
        case 'codeBlock':
          insertTagElement('Code', 'Insira seu codigo aqui', props)
          break
        case 'link':
          insertTagElement('Link', 'Insira seu link aqui', [
            ['url', '"https://github.com/DesignLiquido/delegua"'],
            ...props,
          ])
          break
        case 'imageBlock':
          insertTagElement('Image', 'Insira a mensagem da imagem aqui', props)
          break
        case 'userTextBlock':
          insertTagElement('User', 'Insira a fala do usuário aqui')
          break
        case 'title':
          insertTitleElement()
          break
        case 'codeLine':
          insertCodeLineElement('Insira sua linha de código aqui')
          break
        case 'orderedList':
          insertListElement(true)
          break
        case 'unorderedList':
          insertListElement(false)
          break
      }
    },
    [insertTagElement, insertTitleElement, insertCodeLineElement, insertListElement],
  )

  const value = useMemo(() => {
    return {
      textEditorRef,
      insertWidget,
    }
  }, [textEditorRef, insertWidget])

  return value
}
