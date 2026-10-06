import { foreignKey, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core'
import { starModel } from '../space/star-model'
import { userModel } from './user-model'

export const userRecentlyUnlockedStarModel = pgTable(
  'users_recently_unlocked_stars',
  {
    userId: text('user_id').notNull(),
    starId: uuid('star_id').notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.starId],
      name: 'users_recently_unlocked_stars_pkey',
    }),
    foreignKey({
      columns: [table.starId],
      foreignColumns: [starModel.id],
      name: 'users_recently_unlocked_stars_star_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'users_recently_unlocked_stars_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)
