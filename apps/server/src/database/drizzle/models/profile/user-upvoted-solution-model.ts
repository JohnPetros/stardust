import { foreignKey, pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core'
import { solutionModel } from '../challenging/solution-model'
import { userModel } from './user-model'

export const userUpvotedSolutionModel = pgTable(
  'users_upvoted_solutions',
  {
    solutionId: uuid('solution_id').notNull(),
    userId: varchar('user_id').notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.solutionId, table.userId],
      name: 'user_upvoted_solutions_pkey',
    }),
    foreignKey({
      columns: [table.solutionId],
      foreignColumns: [solutionModel.id],
      name: 'user_upvoted_solutions_solution_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'user_upvoted_solutions_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)
