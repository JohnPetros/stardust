import { sql } from 'drizzle-orm'
import { integer, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core'
import { guideCategoryModel } from './guide-category-model'

export const guideModel = pgTable(
  'guides',
  {
    title: text('title').notNull(),
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
    position: integer('position').notNull(),
    content: text('content'),
    category: guideCategoryModel('category')
      .notNull()
      .default(sql`'lsp'::guide_category`),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'topics_pkey' })],
)
