import {
  ChallengeCodeExecution,
  type ChallengeCodeExecutionStatusValue,
} from '@stardust/core/challenging/structures'
import type {
  ChallengeCodeExecutionErrorDto,
  ChallengeCodeExecutionTestResultDto,
} from '@stardust/core/challenging/structures/dtos'
import type { Id } from '@stardust/core/global/structures'
import type {
  DrizzleChallengeCodeExecution,
  DrizzleInsertChallengeCodeExecution,
} from '../../types/entities/challenging'

export class DrizzleChallengeCodeExecutionMapper {
  static toStructure(row: DrizzleChallengeCodeExecution): ChallengeCodeExecution {
    return ChallengeCodeExecution.create({
      code: row.code,
      ...DrizzleChallengeCodeExecutionMapper.outcome(row),
      createdAt: row.createdAt,
    })
  }
  static toPersistence(
    userId: Id,
    challengeId: Id,
    execution: ChallengeCodeExecution,
  ): DrizzleInsertChallengeCodeExecution {
    return {
      userId: userId.value,
      challengeId: challengeId.value,
      ...DrizzleChallengeCodeExecutionMapper.executionPayload(execution),
    }
  }
  private static executionPayload(
    execution: ChallengeCodeExecution,
  ): Pick<
    DrizzleInsertChallengeCodeExecution,
    'code' | 'status' | 'testResults' | 'outputs' | 'error' | 'createdAt'
  > {
    const dto = execution.dto
    return {
      ...dto,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
    }
  }
  private static outcome(row: DrizzleChallengeCodeExecution) {
    const { status, testResults, outputs, error } = row
    return {
      status: status as ChallengeCodeExecutionStatusValue,
      testResults: testResults as ChallengeCodeExecutionTestResultDto[],
      outputs: outputs as string[],
      error: error as ChallengeCodeExecutionErrorDto | null,
    }
  }
}
