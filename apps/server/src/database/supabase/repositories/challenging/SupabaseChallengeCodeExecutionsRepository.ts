import type { ChallengeCodeExecutionsRepository } from '@stardust/core/challenging/interfaces'
import type { ChallengeCodeExecutionsListParams } from '@stardust/core/challenging/types'
import type { ChallengeCodeExecution } from '@stardust/core/challenging/structures'
import { Integer, type Id } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'

import { SupabasePostgreError } from '../../errors'
import { SupabaseChallengeCodeExecutionMapper } from '../../mappers/challenging'
import type { SupabaseChallengeCodeExecution } from '../../types'
import { SupabaseRepository } from '../SupabaseRepository'

type CountableExecution = Pick<SupabaseChallengeCodeExecution, 'status' | 'test_results'>

export class SupabaseChallengeCodeExecutionsRepository
  extends SupabaseRepository
  implements ChallengeCodeExecutionsRepository
{
  async add(
    userId: Id,
    challengeId: Id,
    execution: ChallengeCodeExecution,
  ): Promise<void> {
    const { error } = await this.supabase
      .from('challenge_code_executions')
      .insert(
        SupabaseChallengeCodeExecutionMapper.toSupabase(userId, challengeId, execution),
      )

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async findManyByUserAndChallenge({
    userId,
    challengeId,
    page,
    itemsPerPage,
  }: ChallengeCodeExecutionsListParams): Promise<ManyItems<ChallengeCodeExecution>> {
    const range = this.calculateQueryRange(page.value, itemsPerPage.value)
    const { data, count, error } = await this.supabase
      .from('challenge_code_executions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId.value)
      .eq('challenge_id', challengeId.value)
      .order('created_at', { ascending: false })
      .range(range.from, range.to)

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return {
      items: data.map(SupabaseChallengeCodeExecutionMapper.toStructure),
      count: count ?? 0,
    }
  }

  async findLatestByUserAndChallenge(
    userId: Id,
    challengeId: Id,
  ): Promise<ChallengeCodeExecution | null> {
    const { data, error } = await this.supabase
      .from('challenge_code_executions')
      .select('*')
      .eq('user_id', userId.value)
      .eq('challenge_id', challengeId.value)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabaseChallengeCodeExecutionMapper.toStructure(data)
  }

  async countIncorrectByUserAndChallenge(userId: Id, challengeId: Id): Promise<Integer> {
    const { data, error } = await this.supabase
      .from('challenge_code_executions')
      .select('status, test_results')
      .eq('user_id', userId.value)
      .eq('challenge_id', challengeId.value)
      .in('status', ['wrong_answer', 'syntax_error', 'runtime_error'])
      .overrideTypes<CountableExecution[]>()

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return Integer.create(
      data.reduce((count, execution) => {
        if (execution.status !== 'wrong_answer') {
          return count + 1
        }

        const testResults = execution.test_results as { isCorrect?: boolean }[]
        return count + testResults.filter((testResult) => !testResult.isCorrect).length
      }, 0),
    )
  }
}
