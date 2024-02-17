import monaco from 'monaco-editor'

import type { CodeError } from '../types/CodeError'
import type { CodeReturn } from '../types/CodeReturn'
import type { Token } from '../types/Token'

import type {
  ChallengeTestCaseExpectedOutput,
  ChallengeTestCaseInput,
} from '@/@types/Challenge'

export interface ICode {
  run(code: string, shouldReturnResult: boolean): Promise<CodeReturn>
  formatResult(result: unknown): string
  formatOutput(output: string, shouldPrettify: boolean): string | number
  desformatOutput(result: ChallengeTestCaseExpectedOutput): string
  getInput(code: string): string
  getInputCommands(code: string): string[] | null
  getTokens(): { [key in Token]: string[] }
  addInput(input: ChallengeTestCaseInput, code: string): string
  addFunction(
    functionName: string,
    functionParams: ChallengeTestCaseInput,
    code: string
  ): string
  getMonacoEditorConfig(): monaco.languages.IMonarchLanguage
  handleError(error: string): CodeError
}
