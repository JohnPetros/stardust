import { sql } from 'drizzle-orm'
import { foreignKey, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { challengeModel } from '../challenging/challenge-model'
import { commentModel } from './comment-model'

export const challengeCommentModel = pgTable(
  'challenges_comments',
  {
    id: uuid('id').notNull().default(sql`gen_random_uuid()`),
    challengeId: uuid('challenge_id'),
    commentId: uuid('comment_id').notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.challengeId],
      foreignColumns: [challengeModel.id],
      name: 'challenge_comments_challenge_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.commentId],
      foreignColumns: [commentModel.id],
      name: 'challenge_comments_comment_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    primaryKey({ columns: [table.id], name: 'challenge_comments_pkey' }),
  ],
)
