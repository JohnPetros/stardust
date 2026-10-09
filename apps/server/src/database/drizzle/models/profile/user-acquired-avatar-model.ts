import { sql } from 'drizzle-orm'
import { foreignKey, pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core'
import { avatarModel } from '../shop/avatar-model'
import { userModel } from './user-model'

export const userAcquiredAvatarModel = pgTable(
  'users_acquired_avatars',
  {
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
    userId: varchar('user_id').notNull(),
    avatarId: uuid('avatar_id').notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.avatarId],
      foreignColumns: [avatarModel.id],
      name: 'users_acquired_avatars_avatar_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    primaryKey({ columns: [table.id], name: 'users_acquired_avatars_pkey' }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'users_acquired_avatars_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)
