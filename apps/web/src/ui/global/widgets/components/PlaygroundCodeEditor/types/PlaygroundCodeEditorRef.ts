import type { EditorRef } from '../../Editor/types'

export interface PlaygroundCodeEditorRef extends EditorRef {
  runCode: () => void
}
