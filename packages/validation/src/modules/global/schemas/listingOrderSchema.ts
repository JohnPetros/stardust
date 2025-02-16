import z from 'zod'

export const listingOrderSchema = z.enum(['ascending', 'descending', 'all'])
