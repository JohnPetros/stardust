import { sql } from 'drizzle-orm'
import { foreignKey, pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core'
import { rocketModel } from '../shop/rocket-model'
import { userModel } from './user-model'

export const userAcquiredRocketModel = pgTable(
  'users_acquired_rockets',
  {
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
    userId: varchar('user_id').notNull(),
    rocketId: uuid('rocket_id').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'users_acquired_rockets_pkey' }),
    foreignKey({
      columns: [table.rocketId],
      foreignColumns: [rocketModel.id],
      name: 'users_acquired_rockets_rocket_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('no action'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'users_acquired_rockets_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)
