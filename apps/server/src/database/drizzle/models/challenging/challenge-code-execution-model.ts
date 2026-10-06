import { sql } from 'drizzle-orm'
import {
  check,
  foreignKey,
  index,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { challengeModel } from './challenge-model'
import { userModel } from '../profile/user-model'

export const challengeCodeExecutionModel = pgTable(
  'challenge_code_executions',
  {
    id: uuid('id').notNull().default(sql`gen_random_uuid()`),
    userId: text('user_id').notNull(),
    challengeId: uuid('challenge_id').notNull(),
    code: text('code').notNull(),
    status: text('status').notNull(),
    testResults: jsonb('test_results').notNull().default(sql`'[]'::jsonb`),
    outputs: jsonb('outputs').notNull().default(sql`'[]'::jsonb`),
    error: jsonb('error'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .default(sql`now()`),
  },
  ({ challengeId, id, userId, createdAt, status }) => [
    foreignKey({
      columns: [challengeId],
      foreignColumns: [challengeModel.id],
      name: 'challenge_code_executions_challenge_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    primaryKey({ columns: [id], name: 'challenge_code_executions_pkey' }),
    check(
      'challenge_code_executions_status_check',
      sql`status = ANY (ARRAY['accepted'::text, 'wrong_answer'::text, 'syntax_error'::text, 'runtime_error'::text, 'internal_error'::text])`,
    ),
    foreignKey({
      columns: [userId],
      foreignColumns: [userModel.id],
      name: 'challenge_code_executions_user_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    index('challenge_code_executions_user_challenge_created_at_idx').using(
      'btree',
      userId,
      challengeId,
      createdAt.desc().nullsFirst(),
    ),
    index('challenge_code_executions_user_challenge_status_idx').using(
      'btree',
      userId,
      challengeId,
      status,
    ),
  ],
)
