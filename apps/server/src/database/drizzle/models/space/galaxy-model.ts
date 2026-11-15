import { sql } from 'drizzle-orm'
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'

export const galaxyStatusEnum = pgEnum('galaxy_status', [
  'published',
  'announced',
  'unpublished',
])

export const galaxyModel = pgTable(
  'galaxies',
  {
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    animation: text('animation').notNull(),
    position: integer('position').notNull(),
    status: galaxyStatusEnum('status').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'galaxies_pkey' }),
    unique('galaxies_slug_key').on(table.slug),
    unique('galaxies_position_key').on(table.position),
  ],
)
