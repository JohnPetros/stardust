import type { EditorContextAction } from './editorContextAction'
import type { EditorContextState } from './editorContextState'

export type EditorContextValue = {
  state: EditorContextState
  dispatch: (action: EditorContextAction) => void
}
