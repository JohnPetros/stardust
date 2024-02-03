import type { ThemeName } from '@/@types/themeName'

export type EditorContextAction =
  | { type: 'setFontSize'; payload: number }
  | { type: 'setTabSize'; payload: number }
  | { type: 'setTheme'; payload: ThemeName }
