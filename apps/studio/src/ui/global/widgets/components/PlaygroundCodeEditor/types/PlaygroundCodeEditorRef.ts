import type { CodeEditorRef } from '../../CodeEditor/types'

export interface PlaygroundCodeEditorRef extends CodeEditorRef {
  runCode: () => void
}
