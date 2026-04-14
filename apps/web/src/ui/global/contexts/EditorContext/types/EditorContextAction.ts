import type { EditorThemeName } from './EditorThemeName'
import type {
  LspFormatterConfigurationDto,
  LspLinterConfigurationDto,
} from '@stardust/core/global/structures/dtos'

export type EditorContextAction =
  | { type: 'setFontSize'; payload: number }
  | { type: 'setTabSize'; payload: number }
  | { type: 'setTheme'; payload: EditorThemeName }
  | { type: 'setIsCodeCheckerEnabled'; payload: boolean }
  | { type: 'setFormatter'; payload: LspFormatterConfigurationDto }
  | { type: 'setLinter'; payload: LspLinterConfigurationDto }
