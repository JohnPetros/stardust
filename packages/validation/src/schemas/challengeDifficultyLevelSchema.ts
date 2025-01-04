import z from 'zod'

export const challengeDifficultyLevelSchema = z.enum(['easy', 'medium', 'hard', 'all'])
