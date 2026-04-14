import type { EditorThemeName } from './EditorThemeName'
import type {
  LspFormatterConfigurationDto,
  LspLinterConfigurationDto,
} from '@stardust/core/global/structures/dtos'

export type EditorContextState = {
  fontSize: number
  tabSize: number
  isCodeCheckerEnabled: boolean
  themeName: EditorThemeName
  formatter: LspFormatterConfigurationDto
  linter: LspLinterConfigurationDto
}
