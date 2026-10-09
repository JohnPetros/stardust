import { and, desc, eq, inArray, sql, type SQL } from 'drizzle-orm'
import type { ChallengeCodeExecution } from '@stardust/core/challenging/structures'
import type { ChallengeCodeExecutionsRepository } from '@stardust/core/challenging/interfaces'
import type { ChallengeCodeExecutionsListParams } from '@stardust/core/challenging/types'
import { Integer, type Id } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'
import { AuthError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import { challengeCodeExecutionModel } from '../../models/challenging/challenge-code-execution-model'
import { DrizzleChallengeCodeExecutionMapper } from '../../mappers/challenging/DrizzleChallengeCodeExecutionMapper'
import type { ChallengeCodeExecutionTestResultDto } from '@stardust/core/challenging/structures/dtos'

export class DrizzleChallengeCodeExecutionsRepository
  extends DrizzleRepository
  implements ChallengeCodeExecutionsRepository
{
  private authorize(userId: Id): void {
    if (
      this.access.kind === 'public' ||
      (this.access.kind === 'user' && this.access.accountId.value !== userId.value)
    )
      throw new AuthError('Conta não autorizada')
  }

  private filter(userId: Id, challengeId: Id) {
    this.authorize(userId)
    return and(
      eq(challengeCodeExecutionModel.userId, userId.value),
      eq(challengeCodeExecutionModel.challengeId, challengeId.value),
    )
  }

  async add(
    userId: Id,
    challengeId: Id,
    execution: ChallengeCodeExecution,
  ): Promise<void> {
    this.authorize(userId)
    await this.executeQuery(async () =>
      this.database
        .insert(challengeCodeExecutionModel)
        .values(
          DrizzleChallengeCodeExecutionMapper.toPersistence(
            userId,
            challengeId,
            execution,
          ),
        ),
    )
  }

  async findManyByUserAndChallenge(
    params: ChallengeCodeExecutionsListParams,
  ): Promise<ManyItems<ChallengeCodeExecution>> {
    const filter = this.filter(params.userId, params.challengeId)
    return this.executeQuery(() => this.listPage(params, filter))
  }

  private orderedExecutionsQuery(filter: SQL | undefined) {
    return this.database
      .select()
      .from(challengeCodeExecutionModel)
      .where(filter)
      .orderBy(desc(challengeCodeExecutionModel.createdAt))
  }

  private pageRowsQuery(
    filter: SQL | undefined,
    params: ChallengeCodeExecutionsListParams,
  ) {
    const range = this.calculateQueryRange(params.page.value, params.itemsPerPage.value)
    return this.orderedExecutionsQuery(filter).offset(range.offset).limit(range.limit)
  }

  private countQuery(filter: SQL | undefined) {
    return this.database
      .select({ count: sql<number>`count(*)::integer` })
      .from(challengeCodeExecutionModel)
      .where(filter)
  }

  private async listPage(
    params: ChallengeCodeExecutionsListParams,
    filter: SQL | undefined,
  ): Promise<ManyItems<ChallengeCodeExecution>> {
    const [rows, [total]] = await Promise.all([
      this.pageRowsQuery(filter, params),
      this.countQuery(filter),
    ])
    return this.mapPage(rows, total)
  }

  private mapPage(
    rows: Awaited<ReturnType<DrizzleChallengeCodeExecutionsRepository['pageRowsQuery']>>,
    total:
      | Awaited<
          ReturnType<DrizzleChallengeCodeExecutionsRepository['countQuery']>
        >[number]
      | undefined,
  ): ManyItems<ChallengeCodeExecution> {
    return {
      items: rows.map(DrizzleChallengeCodeExecutionMapper.toStructure),
      count: total?.count ?? 0,
    }
  }

  async findLatestByUserAndChallenge(
    userId: Id,
    challengeId: Id,
  ): Promise<ChallengeCodeExecution | null> {
    const filter = this.filter(userId, challengeId)
    return this.findOneResult(
      async () => this.orderedExecutionsQuery(filter).limit(1),
      DrizzleChallengeCodeExecutionMapper.toStructure,
    )
  }

  async countIncorrectByUserAndChallenge(userId: Id, challengeId: Id): Promise<Integer> {
    const filter = this.filter(userId, challengeId)
    return this.executeQuery(async () =>
      this.countIncorrect(await this.incorrectExecutionsQuery(filter)),
    )
  }

  private incorrectStatusFilter() {
    const { status } = challengeCodeExecutionModel
    const incorrectStatuses: (typeof challengeCodeExecutionModel.$inferSelect.status)[] =
      ['wrong_answer', 'syntax_error', 'runtime_error']
    return inArray(status, incorrectStatuses)
  }

  private incorrectExecutionsQuery(filter: SQL | undefined) {
    const { status, testResults } = challengeCodeExecutionModel
    return this.database
      .select({ status, testResults })
      .from(challengeCodeExecutionModel)
      .where(and(filter, this.incorrectStatusFilter()))
  }

  private countIncorrect(
    rows: Awaited<
      ReturnType<DrizzleChallengeCodeExecutionsRepository['incorrectExecutionsQuery']>
    >,
  ): Integer {
    return Integer.create(
      rows.reduce((total, row) => total + this.incorrectTests(row), 0),
    )
  }

  private incorrectTests(
    row: Awaited<
      ReturnType<DrizzleChallengeCodeExecutionsRepository['incorrectExecutionsQuery']>
    >[number],
  ): number {
    return row.status === 'wrong_answer'
      ? (row.testResults as ChallengeCodeExecutionTestResultDto[]).filter(
          (result) => !result.isCorrect,
        ).length
      : 1
  }
}
