import { useImperativeHandle } from 'react'

import { useTextEditorContext } from '@/ui/challenging/hooks/useTextEditorContext'
import { TextEditorView } from './TextEditorView'
import { useTextEditor } from './useTextEditor'

type Props = {
  value: string
  width: number | string
  height: number | string
  onChange?: (value: string) => void
}

export function TextEditor({ value, width, height, onChange = () => {} }: Props) {
  const {
    getValue,
    setValue,
    undoValue,
    reloadValue,
    getCursorPosition,
    setCursorPosition,
    getSelectedLinesRange,
    getLineContent,
    getLineCount,
    getSelectedContent,
    insertLineContent,
    replaceContent,
    selectContent,
    handleChange,
    handleMonacoEditorMount,
  } = useTextEditor(value, onChange)
  const { textEditorRef } = useTextEditorContext()

  useImperativeHandle(textEditorRef, () => {
    return {
      getValue,
      setValue,
      undoValue,
      reloadValue,
      insertLineContent,
      replaceContent,
      getCursorPosition,
      setCursorPosition,
      getSelectedLinesRange,
      getLineContent,
      getSelectedContent,
      selectContent,
      getLineCount,
    }
  }, [
    getValue,
    setValue,
    undoValue,
    reloadValue,
    insertLineContent,
    replaceContent,
    getCursorPosition,
    setCursorPosition,
    getSelectedLinesRange,
    getLineContent,
    getSelectedContent,
    selectContent,
    getLineCount,
  ])

  return (
    <TextEditorView
      value={value}
      width={width}
      height={height}
      onChange={handleChange}
      onMount={handleMonacoEditorMount}
    />
  )
}
