import type { EditorThemeName } from './EditorThemeName'

export type EditorContextAction =
  | { type: 'setFontSize'; payload: number }
  | { type: 'setTabSize'; payload: number }
  | { type: 'setTheme'; payload: EditorThemeName }
