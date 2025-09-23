import type { EditorThemeName } from './EditorThemeName'

export type EditorContextState = {
  fontSize: number
  tabSize: number
  isCodeCheckerEnabled: boolean
  themeName: EditorThemeName
}
