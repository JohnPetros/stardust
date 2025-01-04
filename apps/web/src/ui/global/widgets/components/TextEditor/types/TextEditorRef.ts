import type { TextEditorSnippet } from './TextEditorSnippet'

export type TextEditorRef = {
  insertSnippet: (snippet: TextEditorSnippet) => void
  insertValue: (value: string) => void
  moveCursorToEnd: VoidFunction
}
