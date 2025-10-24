import z from 'zod'

export const fileSchema = z.instanceof(File)
