import { sql } from 'drizzle-orm'
import {
  foreignKey,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { starModel } from '../space/star-model'
import { userModel } from './user-model'

export const userCompletedStarModel = pgTable(
  'users_completed_stars',
  {
    userId: text('user_id').notNull(),
    starId: uuid('star_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.starId],
      name: 'users_completed_stars_pkey',
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'users_completed_stars_user_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.starId],
      foreignColumns: [starModel.id],
      name: 'users_completed_stars_star_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
  ],
)
