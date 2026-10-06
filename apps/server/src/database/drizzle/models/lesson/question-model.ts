import { sql } from 'drizzle-orm'
import {
  foreignKey,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  uuid,
} from 'drizzle-orm/pg-core'
import { starModel } from '../space/star-model'

export const questionModel = pgTable(
  'questions',
  {
    content: jsonb('content').notNull(),
    starId: uuid('star_id').notNull(),
    position: numeric('position', { mode: 'number' }).notNull(),
    id: uuid('id').notNull().default(sql`gen_random_uuid()`),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'questions_pkey' }),
    foreignKey({
      columns: [table.starId],
      foreignColumns: [starModel.id],
      name: 'questions_star_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
  ],
)
