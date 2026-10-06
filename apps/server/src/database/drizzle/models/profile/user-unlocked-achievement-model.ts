import { foreignKey, pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core'
import { achievementModel } from './achievement-model'
import { userModel } from './user-model'

export const userUnlockedAchievementModel = pgTable(
  'users_unlocked_achievements',
  {
    userId: varchar('user_id').notNull(),
    achievementId: uuid('achievement_id').notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.achievementId],
      foreignColumns: [achievementModel.id],
      name: 'users_unlocked_achievements_achievement_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    primaryKey({
      columns: [table.userId, table.achievementId],
      name: 'users_unlocked_achievements_pkey',
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'users_unlocked_achievements_user_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
  ],
)
