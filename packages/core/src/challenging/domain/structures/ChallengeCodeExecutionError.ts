import { Integer, Logical, Text } from '#global/domain/structures/index'
import type { ChallengeCodeExecutionErrorDto } from './dtos'

type ChallengeCodeExecutionErrorProps = {
  message: Text
  line: Integer | null
  isInternal: Logical
}

export class ChallengeCodeExecutionError {
  readonly message: Text
  readonly line: Integer | null
  readonly isInternal: Logical

  private constructor(props: ChallengeCodeExecutionErrorProps) {
    this.message = props.message
    this.line = props.line
    this.isInternal = props.isInternal
  }

  static create(dto: ChallengeCodeExecutionErrorDto): ChallengeCodeExecutionError {
    return new ChallengeCodeExecutionError({
      message: Text.create(dto.message, 'Mensagem do erro da execução de código'),
      line:
        dto.line === null
          ? null
          : Integer.create(dto.line, 'Linha do erro da execução de código'),
      isInternal: Logical.create(
        dto.isInternal,
        'O erro da execução de código é interno?',
      ),
    })
  }

  get dto(): ChallengeCodeExecutionErrorDto {
    return {
      message: this.message.value,
      line: this.line?.value ?? null,
      isInternal: this.isInternal.value,
    }
  }
}
