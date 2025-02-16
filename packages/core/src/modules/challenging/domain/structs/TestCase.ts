import { Logical, OrdinalNumber } from '#global/structs'
import type { TestCaseDto } from '#challenging/dtos'

type TestCaseProps = {
  position: OrdinalNumber
  isLocked: Logical
  inputs: unknown[]
  expectedOutput: unknown
}

export class TestCase {
  readonly position: OrdinalNumber
  readonly isLocked: Logical
  readonly inputs: unknown[]
  readonly expectedOutput: unknown

  private constructor(props: TestCaseProps) {
    this.position = props.position
    this.isLocked = props.isLocked
    this.inputs = props.inputs
    this.expectedOutput = props.expectedOutput
  }

  static create(dto: TestCaseDto) {
    return new TestCase({
      inputs: dto.inputs,
      expectedOutput: dto.expectedOutput,
      isLocked: Logical.create(dto.isLocked, 'O teste de caso está bloqueado?'),
      position: OrdinalNumber.create(dto.position, 'Posição do caso de uso'),
    })
  }

  get dto(): TestCaseDto {
    return {
      inputs: this.inputs,
      expectedOutput: this.expectedOutput,
      isLocked: this.isLocked.value,
      position: this.position.value,
    }
  }
}
