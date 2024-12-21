import type { CodeInput } from '@/@core/domain/types'
import type { CodeRunnerResponse } from '@stardust/core/responses'

export interface ICodeRunnerProvider {
  run(codeValue: string, shouldReturnLog: boolean): Promise<CodeRunnerResponse>
  addInputs(codeInput: CodeInput, codeValue: string): string
  getInput(codeValue: string): string | null
}
