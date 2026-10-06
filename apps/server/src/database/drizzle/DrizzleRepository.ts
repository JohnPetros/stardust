import { AppError, ConflictError } from '@stardust/core/global/errors'

import type { DatabaseAccess } from './DatabaseAccess'
import type { DrizzleDatabase } from './DrizzleClient'
import { DrizzleDatabaseError } from './errors'

export abstract class DrizzleRepository {
  constructor(
    protected readonly database: DrizzleDatabase,
    protected readonly access: DatabaseAccess,
  ) {}

  protected async executeQuery<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      return this.handleQueryError(error)
    }
  }

  protected findOneResult<Row, Entity>(
    query: () => Promise<Row[]>,
    mapper: (row: Row) => Entity,
  ): Promise<Entity | null> {
    return this.executeQuery(async () => {
      const [row] = await query()
      return row ? mapper(row) : null
    })
  }

  protected findManyResults<Row, Entity>(
    query: () => Promise<Row[]>,
    mapper: (row: Row) => Entity,
  ): Promise<Entity[]> {
    return this.executeQuery(async () => (await query()).map(mapper))
  }

  protected handleQueryError(error: unknown): never {
    if (error instanceof AppError) throw error
    if (this.hasConstraintConflict(error)) throw new ConflictError('O registro já existe')
    throw new DrizzleDatabaseError()
  }

  private hasConstraintConflict(error: unknown, visited = new Set<unknown>()): boolean {
    if (!this.isUnvisitedError(error, visited)) return false
    visited.add(error)
    return (
      this.isConstraintConflict(error) ||
      ('cause' in error && this.hasConstraintConflict(error.cause, visited))
    )
  }

  private isUnvisitedError(error: unknown, visited: Set<unknown>): error is object {
    return error !== null && typeof error === 'object' && !visited.has(error)
  }

  private isConstraintConflict(error: object): boolean {
    return 'code' in error && error.code === '23505'
  }

  protected calculateQueryRange(
    page: number,
    itemsPerPage: number,
  ): { offset: number; limit: number } {
    return { offset: (page - 1) * itemsPerPage, limit: itemsPerPage }
  }
}
