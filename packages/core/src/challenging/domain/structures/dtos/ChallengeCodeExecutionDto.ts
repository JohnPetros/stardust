import type { ChallengeCodeExecutionStatusValue } from '../ChallengeCodeExecutionStatus'
import type { ChallengeCodeExecutionErrorDto } from './ChallengeCodeExecutionErrorDto'
import type { ChallengeCodeExecutionTestResultDto } from './ChallengeCodeExecutionTestResultDto'

export type ChallengeCodeExecutionDto = {
  code: string
  status: ChallengeCodeExecutionStatusValue
  testResults: ChallengeCodeExecutionTestResultDto[]
  outputs: string[]
  error: ChallengeCodeExecutionErrorDto | null
  createdAt?: Date | string
}
