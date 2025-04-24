import type { CodeInput } from '../../domain/types'
import type { CodeRunnerResponse } from '../../responses'

export interface ICodeRunnerProvider {
  run(codeValue: string): Promise<CodeRunnerResponse>
  addInputs(codeInput: CodeInput, codeValue: string): string
  addFunctionCall(functionParams: unknown[], codeValue: string): string
  buildFunction(functionName: string, functionParamsNames: string[]): string
  getFunctionName(codeValue: string): string
  getFunctionParamsNames(codeValue: string): string[]
  getInput(codeValue: string): string | null
  translateToCodeRunner(jsCode: unknown): string
  translateToJs(codeRunnerCode: string): string
  getInputsCount(codeValue: string): number
}
