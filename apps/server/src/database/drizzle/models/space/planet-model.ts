import { sql } from 'drizzle-orm'
import {
  boolean,
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  text,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { galaxyModel } from './galaxy-model'

export const planetModel = pgTable(
  'planets',
  {
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
    name: text('name').notNull(),
    image: text('image').notNull(),
    icon: text('icon').notNull(),
    position: integer('position').notNull(),
    isAvailable: boolean('is_available').notNull().default(sql`true`),
    galaxyId: uuid('galaxy_id').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'planets_pkey' }),
    foreignKey({
      columns: [table.galaxyId],
      foreignColumns: [galaxyModel.id],
      name: 'planets_galaxy_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('restrict'),
    unique('planets_galaxy_id_position_key').on(table.galaxyId, table.position),
  ],
)
