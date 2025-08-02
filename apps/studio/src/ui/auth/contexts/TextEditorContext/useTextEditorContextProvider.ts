import { useCallback, useMemo, type RefObject } from 'react'

import type { TextEditorContextValue } from './TextEditorContextValue'
import type { TextEditorWidget } from './TextEditorWdiget'
import type { TextEditorRef } from '@/ui/global/widgets/components/textEditor/types'

export function useTextEditorContextProvider(
  textEditorRef: RefObject<TextEditorRef | null>,
): TextEditorContextValue {
  const insertTagElement = useCallback(
    (tagName: string, tagContent: string, props: string[][] = []) => {
      if (!textEditorRef.current) return

      const cursorPosition = textEditorRef.current.getCursorPosition()
      if (!cursorPosition) return

      let lineNumber = cursorPosition.lineNumber

      const propsString = props?.map((prop) => `${prop[0]}={${prop[1]}}`).join(' ')

      const openTag = `<${tagName}${propsString ? ` ${propsString}` : ''}>`
      const closeTag = `</${tagName}>`

      const newValue = `${openTag}\n\t${tagContent}\n${closeTag}\n----`

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
      const tabSize = 2

      textEditorRef.current?.selectContent(
        nextLineNumber,
        tabSize,
        nextLineNumber,
        tagContent.length + tabSize,
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
    [textEditorRef.current],
  )

  const insertTitlelement = useCallback(() => {
    if (!textEditorRef.current) return

    const cursorPosition = textEditorRef.current.getCursorPosition()
    if (!cursorPosition) return

    const titleLevel = '#'
    const titleValue = 'Título'
    const titleElement = `${titleLevel} ${titleValue}`

    textEditorRef.current.insertLineContent(cursorPosition.lineNumber, titleElement)

    textEditorRef.current?.selectContent(
      cursorPosition.lineNumber,
      titleLevel.length + 1,
      cursorPosition.lineNumber,
      titleElement.length,
    )
  }, [textEditorRef.current])

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
          insertTagElement('Code', 'Insira seu código aqui', props)
          break
        case 'codeBlock':
          insertTagElement('Code', 'Insira seu código aqui', props)
          break
        case 'link':
          insertTagElement('Link', 'Insira seu link aqui', props)
          break
        case 'imageBlock':
          insertTagElement('Image', 'Insira a mensagem da imagem aqui', props)
          break
        case 'userTextBlock':
          insertTagElement('User', 'Insira a fala do usuário aqui')
          break
        case 'title':
          insertTitlelement()
          break
        case 'codeLine':
          insertCodeLineElement('Insira sua linha de código aqui')
          break
      }
    },
    [insertTagElement, insertTitlelement, insertCodeLineElement],
  )

  const value = useMemo(() => {
    return {
      textEditorRef,
      insertWidget,
    }
  }, [textEditorRef, insertWidget])

  return value
}
