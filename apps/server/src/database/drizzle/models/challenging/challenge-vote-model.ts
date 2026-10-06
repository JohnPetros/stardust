import { pgEnum } from 'drizzle-orm/pg-core'

export const challengeVoteModel = pgEnum('challenge_vote', ['upvote', 'downvote'])
