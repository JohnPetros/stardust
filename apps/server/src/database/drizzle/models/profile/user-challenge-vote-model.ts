import { foreignKey, pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core'
import { challengeModel } from '../challenging/challenge-model'
import { challengeVoteModel } from '../challenging/challenge-vote-model'
import { userModel } from './user-model'

export const userChallengeVoteModel = pgTable(
  'users_challenge_votes',
  {
    challengeId: uuid('challenge_id').notNull(),
    userId: varchar('user_id').notNull(),
    vote: challengeVoteModel('vote').notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.challengeId, table.userId],
      name: 'users_challenge_votes_pkey',
    }),
    foreignKey({
      columns: [table.challengeId],
      foreignColumns: [challengeModel.id],
      name: 'users_voted_challenges_challenge_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'users_voted_challenges_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)
