import z from 'zod'

export const challengeDifficultyLevelSchema = z.enum(['all', 'easy', 'medium', 'hard'])
