import type { LspProvider } from '#global/interfaces/index'
import type { CodeInput } from '../types'
import { Logical } from './Logical'

type CodeProps = {
  lsp: LspProvider
  value: string
}

export class Code {
  readonly lsp: LspProvider
  readonly value: string

  private constructor(props: CodeProps) {
    this.lsp = props.lsp
    this.value = props.value
  }

  static create(lsp: LspProvider, preCodeValue = ''): Code {
    return new Code({ lsp, value: preCodeValue })
  }

  async run() {
    return await this.lsp.run(this.value)
  }

  format(codeValue: string) {
    return this.changeValue(this.lsp.translateToLsp(codeValue))
  }

  addInputs(inputs: CodeInput[]) {
    return this.changeValue(this.lsp.addInputs(inputs, this.value))
  }

  addFunctionCall(functionParams: unknown[]) {
    return this.changeValue(this.lsp.addFunctionCall(functionParams, this.value))
  }

  changeValue(value: string) {
    return this.clone({ value: value })
  }

  translateToLsp(jsCodeValue: unknown) {
    return this.lsp.translateToLsp(jsCodeValue)
  }

  get inputsCount() {
    return this.lsp.getInputsCount(this.value)
  }

  get hasInput(): Logical {
    const input = this.lsp.getInput(this.value)
    return Logical.create(Boolean(input))
  }

  get hasFunction(): Logical {
    const functionName = this.lsp.getFunctionName(this.value)
    return Logical.create(Boolean(functionName))
  }

  get firstInput(): string {
    return String(this.lsp.getInput(this.value))
  }

  private clone(props: Partial<CodeProps>) {
    return new Code({
      lsp: this.lsp,
      value: this.value,
      ...props,
    })
  }
}
