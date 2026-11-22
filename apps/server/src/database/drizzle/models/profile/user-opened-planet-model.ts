import { sql } from 'drizzle-orm'
import {
  foreignKey,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { planetModel } from '../space/planet-model'
import { userModel } from './user-model'

export const userOpenedPlanetModel = pgTable(
  'users_opened_planets',
  {
    userId: text('user_id').notNull(),
    planetId: uuid('planet_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.planetId],
      name: 'users_opened_planets_pkey',
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'users_opened_planets_user_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.planetId],
      foreignColumns: [planetModel.id],
      name: 'users_opened_planets_planet_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
  ],
)
