import type { CodeRunnerProvider } from '@/global/interfaces'
import type { CodeInput } from '../types'
import { Logical } from './Logical'

type CodeProps = {
  codeRunner: CodeRunnerProvider
  value: string
}

export class Code {
  readonly codeRunner: CodeRunnerProvider
  readonly value: string

  private constructor(props: CodeProps) {
    this.codeRunner = props.codeRunner
    this.value = props.value
  }

  static create(codeRunner: CodeRunnerProvider, preCodeValue = ''): Code {
    return new Code({ codeRunner, value: preCodeValue })
  }

  async run() {
    return await this.codeRunner.run(this.value)
  }

  format(codeValue: string) {
    return this.changeValue(this.codeRunner.translateToCodeRunner(codeValue))
  }

  addInputs(inputs: CodeInput[]) {
    return this.changeValue(this.codeRunner.addInputs(inputs, this.value))
  }

  addFunctionCall(functionParams: unknown[]) {
    return this.changeValue(this.codeRunner.addFunctionCall(functionParams, this.value))
  }

  changeValue(value: string) {
    return this.clone({ value: value })
  }

  translateToCodeRunner(jsCodeValue: unknown) {
    return this.codeRunner.translateToCodeRunner(jsCodeValue)
  }

  get inputsCount() {
    return this.codeRunner.getInputsCount(this.value)
  }

  get hasInput(): Logical {
    const input = this.codeRunner.getInput(this.value)
    return Logical.create(Boolean(input))
  }

  get hasFunction(): Logical {
    const functionName = this.codeRunner.getFunctionName(this.value)
    return Logical.create(Boolean(functionName))
  }

  get firstInput(): string {
    return String(this.codeRunner.getInput(this.value))
  }

  private clone(props: Partial<CodeProps>) {
    return new Code({
      codeRunner: this.codeRunner,
      value: this.value,
      ...props,
    })
  }
}
