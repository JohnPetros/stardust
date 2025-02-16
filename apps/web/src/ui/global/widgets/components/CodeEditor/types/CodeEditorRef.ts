import type { CursorPosition } from './CursorPosition'
import type { SelectedLinesRange } from './SelectedLinesRange'

export type CodeEditorRef = {
  getValue: () => string
  setValue: (value: string) => void
  reloadValue: () => void
  undoValue: () => void
  getCursorPosition: () => CursorPosition | null
  setCursorPosition: (cursorPositon: CursorPosition) => void
  getSelectedLinesRange: () => SelectedLinesRange | null
}
