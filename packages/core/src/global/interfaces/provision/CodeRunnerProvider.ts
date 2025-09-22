import type { CodeInput } from '../../domain/types'
import type { CodeRunnerResponse } from '../../responses'

export interface CodeRunnerProvider {
  run(code: string): Promise<CodeRunnerResponse>
  addInputs(codeInput: CodeInput, code: string): string
  addFunctionCall(functionParams: unknown[], code: string): string
  buildFunction(functionName: string, functionParamsNames: string[]): string
  getFunctionName(code: string): string | null
  getFunctionParamsNames(code: string): string[]
  getInput(code: string): string | null
  translateToCodeRunner(jsCode: unknown): string
  translateToJs(codeRunnerCode: string): string
  getInputsCount(code: string): number
  performSyntaxAnalysis(code: string): CodeRunnerResponse
  performSemanticAnalysis(code: string): CodeRunnerResponse
}
