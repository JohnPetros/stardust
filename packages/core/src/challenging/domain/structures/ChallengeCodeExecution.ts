import { Integer, List, Text } from '#global/domain/structures/index'
import { Datetime } from '#global/libs/index'
import { ChallengeCodeExecutionError } from './ChallengeCodeExecutionError'
import { ChallengeCodeExecutionStatus } from './ChallengeCodeExecutionStatus'
import type {
  ChallengeCodeExecutionDto,
  ChallengeCodeExecutionTestResultDto,
} from './dtos'

type ChallengeCodeExecutionProps = {
  code: Text
  status: ChallengeCodeExecutionStatus
  testResults: List<ChallengeCodeExecutionTestResultDto>
  outputs: List<Text>
  error: ChallengeCodeExecutionError | null
  createdAt: Date
}

export class ChallengeCodeExecution {
  readonly code: Text
  readonly status: ChallengeCodeExecutionStatus
  readonly testResults: List<ChallengeCodeExecutionTestResultDto>
  readonly outputs: List<Text>
  readonly error: ChallengeCodeExecutionError | null
  readonly createdAt: Date

  private constructor(props: ChallengeCodeExecutionProps) {
    this.code = props.code
    this.status = props.status
    this.testResults = props.testResults
    this.outputs = props.outputs
    this.error = props.error
    this.createdAt = props.createdAt
  }

  static create(dto: ChallengeCodeExecutionDto): ChallengeCodeExecution {
    const createdAt = dto.createdAt ? new Date(dto.createdAt) : new Datetime().date()

    return new ChallengeCodeExecution({
      code: Text.create(dto.code, 'Código da execução de desafio'),
      status: ChallengeCodeExecutionStatus.create(dto.status),
      testResults: List.create(dto.testResults),
      outputs: List.create(
        dto.outputs.map((output) => Text.create(output, 'Output da execução de desafio')),
      ),
      error: dto.error ? ChallengeCodeExecutionError.create(dto.error) : null,
      createdAt,
    })
  }

  get passedTestsCount(): Integer {
    return Integer.create(
      this.testResults.items.filter((testResult) => testResult.isCorrect).length,
    )
  }

  get failedTestsCount(): Integer {
    return Integer.create(
      this.testResults.items.filter((testResult) => !testResult.isCorrect).length,
    )
  }

  get isAccepted(): boolean {
    return this.status.isAccepted
  }

  get isUserMistake(): boolean {
    return this.status.isUserMistake
  }

  get dto(): ChallengeCodeExecutionDto {
    return {
      code: this.code.value,
      status: this.status.value,
      testResults: this.testResults.items,
      outputs: this.outputs.items.map((output) => output.value),
      error: this.error?.dto ?? null,
      createdAt: this.createdAt,
    }
  }
}
