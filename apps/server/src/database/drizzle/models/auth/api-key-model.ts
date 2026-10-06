import { sql } from 'drizzle-orm'
import {
  check,
  foreignKey,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { userModel } from '../profile/user-model'

export const apiKeyModel = pgTable(
  'api_keys',
  {
    id: uuid('id').notNull().default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    keyHash: text('key_hash').notNull(),
    keyPreview: text('key_preview').notNull(),
    userId: varchar('user_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .default(sql`now()`),
    revokedAt: timestamp('revoked_at', { withTimezone: true, mode: 'date' }),
  },
  (table) => [
    check(
      'api_keys_name_check',
      sql`char_length(TRIM(BOTH FROM name)) >= 1 AND char_length(TRIM(BOTH FROM name)) <= 60`,
    ),
    primaryKey({ columns: [table.id], name: 'api_keys_pkey' }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'api_keys_user_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    index('api_keys_created_at_idx').using('btree', table.createdAt.desc().nullsFirst()),
    index('api_keys_revoked_at_idx').using('btree', table.revokedAt),
    index('api_keys_user_id_idx').using('btree', table.userId),
  ],
)
