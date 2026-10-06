import { foreignKey, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { commentModel } from './comment-model'
import { solutionModel } from '../challenging/solution-model'

export const solutionCommentModel = pgTable(
  'solutions_comments',
  {
    commentId: uuid('comment_id').notNull(),
    solutionId: uuid('solution_id').notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.commentId],
      foreignColumns: [commentModel.id],
      name: 'solutions_comments_comment_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    primaryKey({
      columns: [table.commentId, table.solutionId],
      name: 'solutions_comments_pkey',
    }),
    foreignKey({
      columns: [table.solutionId],
      foreignColumns: [solutionModel.id],
      name: 'solutions_comments_solution_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)
