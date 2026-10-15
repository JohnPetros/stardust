import { AsyncLocalStorage } from 'node:async_hooks'

import type { DrizzleTransaction } from './DrizzleClient'

type TransactionState = {
  executor: DrizzleTransaction
  active: boolean
  rollbackOnly: boolean
  rollbackReason?: unknown
}

export class DatabaseTransactionContext {
  private static readonly storage = new AsyncLocalStorage<TransactionState>()

  static get current(): TransactionState | undefined {
    const state = DatabaseTransactionContext.storage.getStore()
    return state?.active ? state : undefined
  }

  private static async complete<Result>(
    state: TransactionState,
    operation: () => Promise<Result>,
  ): Promise<Result> {
    const result = await operation()
    if (state.rollbackOnly) throw state.rollbackReason
    return result
  }

  static async run<Result>(
    executor: DrizzleTransaction,
    operation: () => Promise<Result>,
  ): Promise<Result> {
    const state: TransactionState = { executor, active: true, rollbackOnly: false }
    return DatabaseTransactionContext.withState(state, operation)
  }

  private static async withState<Result>(
    state: TransactionState,
    operation: () => Promise<Result>,
  ): Promise<Result> {
    try {
      return await DatabaseTransactionContext.storage.run(state, () =>
        DatabaseTransactionContext.complete(state, operation),
      )
    } finally {
      state.active = false
    }
  }
}
