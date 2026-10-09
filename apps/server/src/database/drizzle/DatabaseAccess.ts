import type { Id } from '@stardust/core/global/structures'

export type DatabaseAccess =
  | { kind: 'public' }
  | { kind: 'user'; accountId: Id }
  | { kind: 'god'; accountId: Id }
  | { kind: 'system' }
