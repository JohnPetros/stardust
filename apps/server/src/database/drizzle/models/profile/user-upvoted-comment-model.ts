import { foreignKey, pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core'
import { commentModel } from '../forum/comment-model'
import { userModel } from './user-model'

export const userUpvotedCommentModel = pgTable(
  'users_upvoted_comments',
  {
    userId: varchar('user_id').notNull(),
    commentId: uuid('comment_id').notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.commentId],
      foreignColumns: [commentModel.id],
      name: 'users_upvoted_comments_comment_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    primaryKey({
      columns: [table.userId, table.commentId],
      name: 'users_upvoted_comments_pkey',
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'users_upvoted_comments_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)
