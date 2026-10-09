import { sql } from 'drizzle-orm'
import {
  foreignKey,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { challengeModel } from '../challenging/challenge-model'
import { userModel } from './user-model'

export const userCompletedChallengeModel = pgTable(
  'users_completed_challenges',
  {
    userId: varchar('user_id').notNull(),
    challengeId: uuid('challenge_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    foreignKey({
      columns: [table.challengeId],
      foreignColumns: [challengeModel.id],
      name: 'users_completed_challenges_challenge_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    primaryKey({
      columns: [table.userId, table.challengeId],
      name: 'users_completed_challenges_pkey',
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'users_completed_challenges_user_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
  ],
)
