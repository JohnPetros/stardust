import type { ThemeName } from '@/@types/ThemeName'

export type EditorContextAction =
  | { type: 'setFontSize'; payload: number }
  | { type: 'setTabSize'; payload: number }
  | { type: 'setTheme'; payload: ThemeName }
