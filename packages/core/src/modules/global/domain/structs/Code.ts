import type { CodeInput } from '#global/types'
import type { ICodeRunnerProvider } from '#interfaces'

type CodeProps = {
  codeRunner: ICodeRunnerProvider
  value: string
}

export class Code {
  readonly codeRunner: ICodeRunnerProvider
  readonly value: string

  private constructor(props: CodeProps) {
    this.codeRunner = props.codeRunner
    this.value = props.value
  }

  static create(codeRunner: ICodeRunnerProvider, preCodeValue: string): Code {
    return new Code({ codeRunner, value: preCodeValue })
  }

  async run() {
    return await this.codeRunner.run(this.value, false)
  }

  addInputs(inputs: CodeInput[]) {
    return this.changeValue(this.codeRunner.addInputs(inputs, this.value))
  }

  changeValue(value: string) {
    return this.clone({ value: value })
  }

  get hasInput(): boolean {
    return !!this.codeRunner.getInput(this.value)
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
