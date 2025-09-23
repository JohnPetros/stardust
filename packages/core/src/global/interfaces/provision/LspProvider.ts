import type { CodeInput } from '../../domain/types'
import type { LspResponse } from '../../responses'

export interface LspProvider {
  run(code: string): Promise<LspResponse>
  addInputs(codeInput: CodeInput, code: string): string
  addFunctionCall(functionParams: unknown[], code: string): string
  buildFunction(functionName: string, functionParamsNames: string[]): string
  getFunctionName(code: string): string | null
  getFunctionParamsNames(code: string): string[]
  getInput(code: string): string | null
  translateToLsp(jsCode: unknown): string
  translateToJs(codeRunnerCode: string): string
  getInputsCount(code: string): number
  performSyntaxAnalysis(code: string): LspResponse
  performSemanticAnalysis(code: string): LspResponse
}
