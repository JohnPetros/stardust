import monaco from 'monaco-editor'

import type { CodeError } from '../types/CodeError'
import type { CodeReturn } from '../types/CodeReturn'
import type { Token } from '../types/Token'

export interface ICode {
  execute(code: string): Promise<CodeReturn>
  formatOutput(output: string): string[]
  getInput(code: string): string
  getTokens(): { [key in Token]: string[] }
  getMonacoEditorConfig(): monaco.languages.IMonarchLanguage
  handleError(error: Error): CodeError
}
