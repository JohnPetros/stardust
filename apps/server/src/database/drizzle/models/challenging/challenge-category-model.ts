import { sql } from 'drizzle-orm'
import { foreignKey, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { categoryModel } from './category-model'
import { challengeModel } from './challenge-model'

export const challengeCategoryModel = pgTable(
  'challenges_categories',
  {
    challengeId: uuid('challenge_id').notNull(),
    categoryId: uuid('category_id').notNull(),
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
  },
  (table) => [
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categoryModel.id],
      name: 'challenges_categories_category_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.challengeId],
      foreignColumns: [challengeModel.id],
      name: 'challenges_categories_challenge_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    primaryKey({ columns: [table.id], name: 'challenges_categories_pkey' }),
  ],
)
