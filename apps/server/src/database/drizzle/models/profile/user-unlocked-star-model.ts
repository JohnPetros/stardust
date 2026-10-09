import { sql } from 'drizzle-orm'
import {
  foreignKey,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { starModel } from '../space/star-model'
import { userModel } from './user-model'

export const userUnlockedStarModel = pgTable(
  'users_unlocked_stars',
  {
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
    userId: varchar('user_id').notNull(),
    starId: uuid('star_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).default(
      sql`now()`,
    ),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'user_unlocked_stars_pkey' }),
    foreignKey({
      columns: [table.starId],
      foreignColumns: [starModel.id],
      name: 'users_unlocked_stars_star_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'users_unlocked_stars_user_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
  ],
)
