import z from 'zod'

export const challengeVoteSchema = z.enum(['downvote', 'upvote', 'none'])
