import { AppError } from '@/errors/app-error'
import { and, desc, eq, inArray, lt, not, or, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

import type { CrewDatabase } from '@/database/drizzle'
import { type AgentRun, AgentRunsModel } from '@/database/models/agent-runs-model'

const UNFINISHED_STATUSES = ['started', 'running', 'stopping'] as const
const UNIQUE_VIOLATION_CODE = '23505'

export type NewAgentRun = {
  agent: string
  idempotencyKey: string
  inputHash: string
  subjectKey?: string
  subjectRevision?: string
  input: unknown
}

export type FinishedAgentRun =
  | { id: string; status: 'completed'; output: unknown }
  | { id: string; status: 'failed'; errorCode: string; errorMessage: string }

export type AgentRunsRepository = {
  add(run: NewAgentRun): Promise<AgentRun>
  findById(agent: string, id: string): Promise<AgentRun | null>
  findByIdempotencyKey(agent: string, idempotencyKey: string): Promise<AgentRun | null>
  findLatestCompleteReview(agent: string, subjectKey: string): Promise<AgentRun | null>
  finish(run: FinishedAgentRun): Promise<boolean>
  markRunning(id: string): Promise<void>
  markStopping(ids: string[]): Promise<void>
  touchHeartbeats(ids: string[]): Promise<void>
  failStale(
    heartbeatBefore: Date,
    errorCode: string,
    errorMessage: string,
  ): Promise<number>
  removeFinishedBefore(date: Date): Promise<number>
}

export class DrizzleAgentRunsRepository implements AgentRunsRepository {
  private readonly isUnfinished = inArray(AgentRunsModel.status, [...UNFINISHED_STATUSES])

  constructor(private readonly db: CrewDatabase['drizzle']) {}

  async add(run: NewAgentRun): Promise<AgentRun> {
    try {
      const [row] = await this.db
        .insert(AgentRunsModel)
        .values({
          agent: run.agent,
          idempotencyKey: run.idempotencyKey,
          inputHash: run.inputHash,
          subjectKey: run.subjectKey,
          subjectRevision: run.subjectRevision,
          input: run.input,
        })
        .returning()

      return row
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new AppError(
          'Já existe uma execução para esta chave de idempotência.',
          'Chave de idempotência em uso',
          { code: 'idempotency_key_taken' },
        )
      }

      throw error
    }
  }

  async findById(agent: string, id: string): Promise<AgentRun | null> {
    const [row] = await this.db
      .select()
      .from(AgentRunsModel)
      .where(and(eq(AgentRunsModel.agent, agent), eq(AgentRunsModel.id, id)))
      .limit(1)

    return row ?? null
  }

  async findByIdempotencyKey(
    agent: string,
    idempotencyKey: string,
  ): Promise<AgentRun | null> {
    const [row] = await this.db
      .select()
      .from(AgentRunsModel)
      .where(
        and(
          eq(AgentRunsModel.agent, agent),
          eq(AgentRunsModel.idempotencyKey, idempotencyKey),
        ),
      )
      .limit(1)

    return row ?? null
  }

  async findLatestCompleteReview(
    agent: string,
    subjectKey: string,
  ): Promise<AgentRun | null> {
    const [row] = await this.db
      .select()
      .from(AgentRunsModel)
      .where(
        and(
          eq(AgentRunsModel.agent, agent),
          eq(AgentRunsModel.subjectKey, subjectKey),
          eq(AgentRunsModel.status, 'completed'),
          sql`${AgentRunsModel.output} ->> 'review_status' = 'complete'`,
        ),
      )
      .orderBy(
        sql`${AgentRunsModel.finishedAt} desc nulls last`,
        desc(AgentRunsModel.createdAt),
      )
      .limit(1)

    return row ?? null
  }

  async finish(run: FinishedAgentRun): Promise<boolean> {
    const changes =
      run.status === 'completed'
        ? { status: run.status, output: run.output }
        : {
            status: run.status,
            errorCode: run.errorCode,
            errorMessage: run.errorMessage,
          }

    const rows = await this.db
      .update(AgentRunsModel)
      .set({ ...changes, finishedAt: sql`now()`, heartbeatAt: sql`now()` })
      .where(and(eq(AgentRunsModel.id, run.id), this.isUnfinished))
      .returning({ id: AgentRunsModel.id })

    return rows.length > 0
  }

  async markRunning(id: string): Promise<void> {
    await this.db
      .update(AgentRunsModel)
      .set({
        status: sql`case when ${AgentRunsModel.status} = 'started' then 'running' else ${AgentRunsModel.status} end`,
        startedAt: sql`coalesce(${AgentRunsModel.startedAt}, now())`,
        heartbeatAt: sql`now()`,
      })
      .where(and(eq(AgentRunsModel.id, id), this.isUnfinished))
  }

  async markStopping(ids: string[]): Promise<void> {
    if (ids.length === 0) return

    await this.db
      .update(AgentRunsModel)
      .set({ status: 'stopping' })
      .where(and(inArray(AgentRunsModel.id, ids), this.isUnfinished))
  }

  async touchHeartbeats(ids: string[]): Promise<void> {
    if (ids.length === 0) return

    await this.db
      .update(AgentRunsModel)
      .set({ heartbeatAt: sql`now()` })
      .where(and(inArray(AgentRunsModel.id, ids), this.isUnfinished))
  }

  async failStale(
    heartbeatBefore: Date,
    errorCode: string,
    errorMessage: string,
  ): Promise<number> {
    const rows = await this.db
      .update(AgentRunsModel)
      .set({ status: 'failed', errorCode, errorMessage, finishedAt: sql`now()` })
      .where(and(this.isUnfinished, lt(AgentRunsModel.heartbeatAt, heartbeatBefore)))
      .returning({ id: AgentRunsModel.id })

    return rows.length
  }

  async removeFinishedBefore(date: Date): Promise<number> {
    const newer = alias(AgentRunsModel, 'newer_run')
    const hasNewerCompletedRun = this.db
      .select({ id: newer.id })
      .from(newer)
      .where(
        and(
          eq(newer.agent, AgentRunsModel.agent),
          eq(newer.subjectKey, AgentRunsModel.subjectKey),
          eq(newer.status, 'completed'),
          or(
            sql`${newer.finishedAt} > ${AgentRunsModel.finishedAt}`,
            and(
              sql`${newer.finishedAt} = ${AgentRunsModel.finishedAt}`,
              sql`${newer.id} > ${AgentRunsModel.id}`,
            ),
          ),
        ),
      )

    const isLatestCompletedRun = sql`(${AgentRunsModel.status} = 'completed' and ${AgentRunsModel.subjectKey} is not null and not exists ${hasNewerCompletedRun})`

    const rows = await this.db
      .delete(AgentRunsModel)
      .where(and(lt(AgentRunsModel.finishedAt, date), not(isLatestCompletedRun)))
      .returning({ id: AgentRunsModel.id })

    return rows.length
  }

  private isUniqueViolation(error: unknown): boolean {
    const candidate = error as { code?: string; cause?: { code?: string } } | null

    return (
      candidate?.code === UNIQUE_VIOLATION_CODE ||
      candidate?.cause?.code === UNIQUE_VIOLATION_CODE
    )
  }
}
