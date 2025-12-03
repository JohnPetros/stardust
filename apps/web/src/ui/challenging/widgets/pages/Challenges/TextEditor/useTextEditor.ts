import { useCallback, useRef } from 'react'
import type monaco from 'monaco-editor'

import { Backup } from '@stardust/core/global/structures'

import type { CursorPosition } from '../../../../contexts/TextEditorContext/types/CursorPosition'

export function useTextEditor(initialValue: string, onChange?: (value: string) => void) {
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const backup = useRef<Backup<string>>(Backup.create([initialValue]))

  const insertContentWithBreakLine = useCallback(
    (
      model: monaco.editor.ITextModel,
      lineNumber: number,
      currentLineContent: string,
      content: string,
    ) => {
      model.pushEditOperations(
        [],
        [
          {
            range: {
              startLineNumber: lineNumber,
              startColumn: currentLineContent.length + 1,
              endLineNumber: lineNumber,
              endColumn: currentLineContent.length + 1,
            },
            text: `\n${content}`,
          },
        ],
        () => null,
      )
    },
    [],
  )

  const insertContentDirectly = useCallback(
    (
      model: monaco.editor.ITextModel,
      lineNumber: number,
      currentLineContent: string,
      content: string,
    ) => {
      model.pushEditOperations(
        [],
        [
          {
            range: {
              startLineNumber: lineNumber,
              startColumn: currentLineContent.length + 1,
              endLineNumber: lineNumber,
              endColumn: currentLineContent.length + 1,
            },
            text: content,
          },
        ],
        () => null,
      )
    },
    [],
  )

  const insertMultiLineContent = useCallback(
    (
      model: monaco.editor.ITextModel,
      lineNumber: number,
      currentLineContent: string,
      lines: string[],
      shouldBreakLine: boolean,
    ) => {
      const hasContent = currentLineContent.trim().length > 0

      if (hasContent && shouldBreakLine) {
        insertContentWithBreakLine(
          model,
          lineNumber,
          currentLineContent,
          lines.join('\n'),
        )
      } else {
        const firstLine = lines[0]
        insertContentDirectly(model, lineNumber, currentLineContent, firstLine)

        if (lines.length > 1) {
          const remainingLines = lines.slice(1).join('\n')
          const newLineContent = currentLineContent + firstLine
          insertContentDirectly(model, lineNumber, newLineContent, `\n${remainingLines}`)
        }
      }
    },
    [insertContentWithBreakLine, insertContentDirectly],
  )

  const insertSingleLineContent = useCallback(
    (
      model: monaco.editor.ITextModel,
      lineNumber: number,
      currentLineContent: string,
      content: string,
      shouldBreakLine: boolean,
    ) => {
      const hasContent = currentLineContent.trim().length > 0

      if (hasContent && shouldBreakLine) {
        insertContentWithBreakLine(model, lineNumber, currentLineContent, content)
      } else {
        insertContentDirectly(model, lineNumber, currentLineContent, content)
      }
    },
    [insertContentWithBreakLine, insertContentDirectly],
  )

  const getCursorPosition = useCallback(() => {
    const position = monacoEditorRef.current?.getPosition()

    if (!position) return null

    return {
      lineNumber: position.lineNumber,
      columnNumber: position.column,
    }
  }, [])

  const setCursorPosition = useCallback((cursorPostion: CursorPosition) => {
    return monacoEditorRef.current?.setPosition({
      lineNumber: cursorPostion.lineNumber,
      column: cursorPostion.columnNumber,
    })
  }, [])

  const getSelectedLinesRange = useCallback(() => {
    const selection = monacoEditorRef.current?.getSelection()

    if (selection) {
      return {
        start: selection.startLineNumber,
        end: selection.endLineNumber,
      }
    }

    return null
  }, [])

  const getSelectedContent = useCallback(() => {
    const editor = monacoEditorRef.current

    if (!editor) return null

    const selection = editor.getSelection()
    if (!selection) return null

    const model = editor.getModel()
    if (!model) return null

    try {
      const selectedText = model.getValueInRange(selection)
      return selectedText
    } catch (error) {
      console.error('Erro ao obter conteúdo selecionado:', error)
      return null
    }
  }, [])

  const replaceContent = useCallback(
    (lineNumber: number, startColumn: number, endColumn: number, newContent: string) => {
      const editor = monacoEditorRef.current

      if (!editor) return false

      const model = editor.getModel()
      if (!model) return false

      const lineCount = model.getLineCount()

      if (lineNumber < 1 || lineNumber > lineCount) {
        return false
      }

      const lineLength = model.getLineLength(lineNumber)

      if (
        startColumn < 1 ||
        startColumn > lineLength + 1 ||
        endColumn < 1 ||
        endColumn > lineLength + 1
      ) {
        return false
      }

      if (startColumn > endColumn) {
        return false
      }

      try {
        const range = {
          startLineNumber: lineNumber,
          startColumn: startColumn,
          endLineNumber: lineNumber,
          endColumn: endColumn,
        }

        model.pushEditOperations(
          [],
          [
            {
              range: range,
              text: newContent,
            },
          ],
          () => null,
        )

        return true
      } catch (error) {
        console.error('Erro ao substituir conteúdo:', error)
        return false
      }
    },
    [],
  )

  const selectContent = useCallback(
    (startLine: number, startColumn: number, endLine: number, endColumn: number) => {
      const editor = monacoEditorRef.current

      if (!editor) return false

      const model = editor.getModel()
      if (!model) return false

      const lineCount = model.getLineCount()

      if (startLine < 1 || startLine > lineCount || endLine < 1 || endLine > lineCount) {
        return false
      }

      const startLineLength = model.getLineLength(startLine)
      const endLineLength = model.getLineLength(endLine)

      if (
        startColumn < 1 ||
        startColumn > startLineLength + 1 ||
        endColumn < 1 ||
        endColumn > endLineLength + 1
      ) {
        return false
      }

      try {
        const selection = {
          startLineNumber: startLine,
          startColumn: startColumn,
          endLineNumber: endLine,
          endColumn: endColumn,
        }

        editor.setSelection(selection)

        editor.focus()

        return true
      } catch (error) {
        console.error('Erro ao selecionar conteúdo:', error)
        return false
      }
    },
    [],
  )

  const insertLineContent = useCallback(
    (lineNumber: number, content: string, shouldBreakLine: boolean = true) => {
      const editor = monacoEditorRef.current

      if (!editor) return false

      const model = editor.getModel()
      if (!model) return false

      if (lineNumber < 1 || lineNumber > model.getLineCount() + 1) {
        return false
      }

      try {
        if (lineNumber > model.getLineCount()) {
          const currentValue = model.getValue()
          const newValue = `${currentValue}\n${content}`
          model.setValue(newValue)
        } else {
          const currentLineContent = model.getLineContent(lineNumber)

          if (content.includes('\n')) {
            const lines = content.split('\n')
            insertMultiLineContent(
              model,
              lineNumber,
              currentLineContent,
              lines,
              shouldBreakLine,
            )
          } else {
            insertSingleLineContent(
              model,
              lineNumber,
              currentLineContent,
              content,
              shouldBreakLine,
            )
          }
        }

        return true
      } catch (error) {
        console.error('Erro ao inserir conteúdo na linha:', error)
        return false
      }
    },
    [insertMultiLineContent, insertSingleLineContent],
  )

  const getLineContent = useCallback((lineNumber: number) => {
    if (!monacoEditorRef.current) return null

    const model = monacoEditorRef.current.getModel()
    if (!model) return null

    return model.getLineContent(lineNumber)
  }, [])

  const getLineCount = useCallback(() => {
    if (!monacoEditorRef.current) return 0

    const model = monacoEditorRef.current.getModel()
    if (!model) return 0

    return model.getLineCount()
  }, [])

  const getValue = useCallback(() => {
    return monacoEditorRef.current?.getValue() ?? ''
  }, [])

  const setValue = useCallback((value: string) => {
    monacoEditorRef.current?.setValue(value)
  }, [])

  const reloadValue = useCallback(() => {
    backup.current = Backup.create([initialValue])
    monacoEditorRef.current?.setValue(initialValue)
  }, [initialValue])

  const undoValue = useCallback(() => {
    if (backup.current.isEmpty) return

    backup.current = backup.current.undo()
    monacoEditorRef.current?.setValue(backup.current.lastState)
  }, [])

  function handleMonacoEditorMount(editor: monaco.editor.IStandaloneCodeEditor) {
    monacoEditorRef.current = editor
  }

  function handleChange(value: string | undefined) {
    if (onChange && value) {
      onChange(value)
      backup.current = backup.current?.save(value)
    }
  }

  return {
    getValue,
    setValue,
    reloadValue,
    undoValue,
    getCursorPosition,
    setCursorPosition,
    getSelectedLinesRange,
    getSelectedContent,
    getLineContent,
    getLineCount,
    insertLineContent,
    replaceContent,
    selectContent,
    handleChange,
    handleMonacoEditorMount,
  }
}
