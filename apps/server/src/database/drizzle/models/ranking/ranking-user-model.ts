import { sql } from 'drizzle-orm'
import {
  bigint,
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { rankingStatusModel } from './ranking-status-model'
import { tierModel } from './tier-model'
import { userModel } from '../profile/user-model'

export const rankingUserModel = pgTable(
  'ranking_users',
  {
    id: varchar('id').notNull(),
    tierId: uuid('tier_id').notNull(),
    xp: bigint('xp', { mode: 'number' }).notNull().default(sql`'0'::bigint`),
    status: rankingStatusModel('status').notNull().default(sql`'winner'::ranking_status`),
    position: integer('position').notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.id],
      foreignColumns: [userModel.id],
      name: 'winners_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    primaryKey({ columns: [table.id], name: 'winners_pkey' }),
    foreignKey({
      columns: [table.tierId],
      foreignColumns: [tierModel.id],
      name: 'winners_tier_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
  ],
)
