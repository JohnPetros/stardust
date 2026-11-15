import { sql } from 'drizzle-orm'
import {
  boolean,
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { avatarModel } from '../shop/avatar-model'
import { rocketModel } from '../shop/rocket-model'
import { tierModel } from '../ranking/tier-model'
import { galaxyModel } from '../space/galaxy-model'

type ForeignKeyColumn = Parameters<typeof foreignKey>[0]['columns'][number]
type ForeignKeyAction = 'no action' | 'set null'

function userForeignKey(
  name: string,
  column: ForeignKeyColumn,
  foreignColumn: ForeignKeyColumn,
  onDelete: ForeignKeyAction = 'no action',
) {
  return foreignKey({
    columns: [column],
    foreignColumns: [foreignColumn],
    name,
  })
    .onUpdate('no action')
    .onDelete(onDelete)
}

export const userModel = pgTable(
  'users',
  {
    id: varchar('id').notNull(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull(),
    level: integer('level').notNull().default(sql`1`),
    xp: integer('xp').notNull().default(sql`0`),
    coins: integer('coins').notNull().default(sql`0`),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .default(sql`(now() AT TIME ZONE 'utc'::text)`),
    streak: integer('streak').notNull().default(sql`0`),
    weekStatus: text('week_status')
      .array()
      .notNull()
      .default(sql`'{todo,todo,todo,todo,todo,todo,todo}'::text[]`),
    didCompleteSaturday: boolean('did_complete_saturday').notNull().default(sql`false`),
    tierId: uuid('tier_id').default(sql`'f542f61a-4e42-4914-88f6-9aa7c2358473'::uuid`),
    rocketId: uuid('rocket_id').default(
      sql`'03f3f359-a0ee-42c1-bd5f-b2ad01810d47'::uuid`,
    ),
    weeklyXp: integer('weekly_xp').notNull().default(sql`0`),
    canSeeRanking: boolean('can_see_ranking').notNull().default(sql`false`),
    lastWeekRankingPosition: integer('last_week_ranking_position'),
    avatarId: uuid('avatar_id').default(
      sql`'557a33e8-ce8a-4ac2-992c-7eab630d186d'::uuid`,
    ),
    studyTime: text('study_time').notNull().default(sql`'10:00'::text`),
    didBreakStreak: boolean('did_break_streak').notNull().default(sql`false`),
    isLoser: boolean('is_loser').default(sql`false`),
    slug: text('slug').notNull(),
    hasCompletedSpace: boolean('has_completed_space').notNull().default(sql`false`),
    currentGalaxyId: uuid('current_galaxy_id'),
  },
  ({ email, id, avatarId, name, tierId, rocketId, slug, currentGalaxyId }) => [
    unique('user_email_user_key').on(email),
    primaryKey({ columns: [id], name: 'user_pkey' }),
    userForeignKey('users_avatar_id_fkey', avatarId, avatarModel.id),
    unique('users_name_key').on(name),
    userForeignKey('users_ranking_id_fkey', tierId, tierModel.id),
    userForeignKey('users_rocket_id_fkey', rocketId, rocketModel.id),
    unique('users_slug_key').on(slug),
    userForeignKey(
      'users_current_galaxy_id_fkey',
      currentGalaxyId,
      galaxyModel.id,
      'set null',
    ),
  ],
)
