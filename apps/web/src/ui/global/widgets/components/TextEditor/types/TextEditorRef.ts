import type { TextEditorSnippet } from './TextEditorSnippet'

export type TextEditorRef = {
  insertSnippet: (snippet: TextEditorSnippet) => void
  moveCursorToEnd: VoidFunction
}
