import { foreignKey, pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core'
import { insigniaModel } from '../shop/insignia-model'
import { userModel } from './user-model'

export const userAcquiredInsigniaModel = pgTable(
  'users_acquired_insignias',
  {
    userId: varchar('user_id').notNull(),
    insigniaId: uuid('insignia_id').notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.insigniaId],
      foreignColumns: [insigniaModel.id],
      name: 'users_acquired_insignias_insignia_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    primaryKey({
      columns: [table.userId, table.insigniaId],
      name: 'users_acquired_insignias_pkey',
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'users_acquired_insignias_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)
