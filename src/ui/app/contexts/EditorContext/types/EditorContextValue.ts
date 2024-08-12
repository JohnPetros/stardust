import type { EditorContextAction } from './EditorContextAction'
import type { EditorContextState } from './EditorContextState'

export type EditorContextValue = {
  state: EditorContextState
  dispatch: (action: EditorContextAction) => void
}
