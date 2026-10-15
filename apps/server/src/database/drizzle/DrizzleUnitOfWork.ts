import type { Database } from '@stardust/core/global/interfaces'
import { AppError, ConflictError } from '@stardust/core/global/errors'

import { DrizzleClient, type DrizzleDatabase } from './DrizzleClient'
import { DatabaseTransactionContext } from './DatabaseTransactionContext'
import { DrizzleDatabaseError } from './errors'

export class DrizzleUnitOfWork implements Database {
  constructor(private readonly connection?: DrizzleDatabase) {}

  async run<Result>(operation: () => Promise<Result>): Promise<Result> {
    const current = DatabaseTransactionContext.current
    return current ? this.runNested(operation, current) : this.runRoot(operation)
  }

  private async runNested<Result>(
    operation: () => Promise<Result>,
    current: NonNullable<typeof DatabaseTransactionContext.current>,
  ): Promise<Result> {
    try {
      return await operation()
    } catch (error) {
      current.rollbackOnly = true
      current.rollbackReason = error
      throw error
    }
  }

  private async runRoot<Result>(
    operation: () => Promise<Result>,
    mayRetry = true,
  ): Promise<Result> {
    try {
      return await this.executeTransaction(operation)
    } catch (error) {
      if (mayRetry && this.isRetryable(error)) return this.runRoot(operation, false)
      this.throwFailure(error)
    }
  }

  private executeTransaction<Result>(operation: () => Promise<Result>): Promise<Result> {
    const connection = this.connection ?? DrizzleClient.getInstance()
    return connection.transaction(
      (transaction) => DatabaseTransactionContext.run(transaction, operation),
      { isolationLevel: 'serializable', accessMode: 'read write' },
    )
  }

  private throwFailure(error: unknown): never {
    if (this.isRetryable(error))
      throw new ConflictError('A operação conflitou com outra alteração. Tente novamente')
    if (!(error instanceof Error) || error instanceof AppError) throw error
    throw new DrizzleDatabaseError(error)
  }

  private isRetryable(error: unknown, visited = new Set<unknown>()): boolean {
    if (!error || typeof error !== 'object' || visited.has(error)) return false
    visited.add(error)
    if ('code' in error && (error.code === '40001' || error.code === '40P01')) return true
    return 'cause' in error && this.isRetryable(error.cause, visited)
  }
}
