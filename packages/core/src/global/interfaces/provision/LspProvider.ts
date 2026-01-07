import type { CodeInput } from '../../domain/types'
import type { LspResponse } from '../../responses'

export interface LspProvider {
  run(code: string): Promise<LspResponse>
  addInputs(codeInput: CodeInput, code: string): Promise<string>
  addFunctionCall(functionParams: unknown[], code: string): Promise<string>
  buildFunction(functionName: string, functionParamsNames: string[]): string
  getFunctionName(code: string): string | null
  getFunctionParamsNames(code: string): string[]
  getInput(code: string): string | null
  translateToLsp(jsCode: unknown): Promise<string>
  translateToJs(codeRunnerCode: string): Promise<string>
  getInputsCount(code: string): number
  performSyntaxAnalysis(code: string): Promise<LspResponse>
  performSemanticAnalysis(code: string): Promise<LspResponse>
}
