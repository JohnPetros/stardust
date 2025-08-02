import type { CursorPosition } from './CursorPosition'
import type { SelectedLinesRange } from './SelectedLinesRange'

export type TextEditorRef = {
  getValue: () => string
  setValue: (value: string) => void
  reloadValue: () => void
  undoValue: () => void
  insertLineContent: (
    lineNumber: number,
    content: string,
    shouldBreakLine?: boolean,
  ) => void
  replaceContent: (
    startLine: number,
    startColumn: number,
    endColumn: number,
    content: string,
  ) => void
  selectContent: (
    startLine: number,
    startColumn: number,
    endLine: number,
    endColumn: number,
  ) => void
  getLineContent: (lineNumber: number) => string | null
  getLineCount: () => number
  getCursorPosition: () => CursorPosition | null
  setCursorPosition: (cursorPositon: CursorPosition) => void
  getSelectedLinesRange: () => SelectedLinesRange | null
  getSelectedContent: () => string | null
}
