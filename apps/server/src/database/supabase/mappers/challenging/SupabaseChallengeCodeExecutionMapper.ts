import {
  ChallengeCodeExecution,
  type ChallengeCodeExecutionStatusValue,
} from '@stardust/core/challenging/structures'
import type {
  ChallengeCodeExecutionErrorDto,
  ChallengeCodeExecutionTestResultDto,
} from '@stardust/core/challenging/structures/dtos'
import type { Id } from '@stardust/core/global/structures'

import type { Database, SupabaseChallengeCodeExecution } from '../../types'
import type { Json } from '../../types/Database'

type SupabaseChallengeCodeExecutionPayload =
  Database['public']['Tables']['challenge_code_executions']['Insert']

export class SupabaseChallengeCodeExecutionMapper {
  static toStructure(
    supabaseExecution: SupabaseChallengeCodeExecution,
  ): ChallengeCodeExecution {
    return ChallengeCodeExecution.create({
      code: supabaseExecution.code,
      status: supabaseExecution.status as ChallengeCodeExecutionStatusValue,
      testResults:
        supabaseExecution.test_results as ChallengeCodeExecutionTestResultDto[],
      outputs: supabaseExecution.outputs as string[],
      error: supabaseExecution.error as ChallengeCodeExecutionErrorDto | null,
      createdAt: new Date(supabaseExecution.created_at),
    })
  }

  static toSupabase(
    userId: Id,
    challengeId: Id,
    execution: ChallengeCodeExecution,
  ): SupabaseChallengeCodeExecutionPayload {
    const executionDto = execution.dto
    const createdAt = executionDto.createdAt

    return {
      user_id: userId.value,
      challenge_id: challengeId.value,
      code: executionDto.code,
      status: executionDto.status,
      test_results: executionDto.testResults as Json,
      outputs: executionDto.outputs as Json,
      error: executionDto.error as Json,
      created_at: createdAt ? new Date(createdAt).toISOString() : undefined,
    }
  }
}
