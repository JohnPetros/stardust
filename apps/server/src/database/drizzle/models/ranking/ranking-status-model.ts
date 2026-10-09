import { pgEnum } from 'drizzle-orm/pg-core'

export const rankingStatusModel = pgEnum('ranking_status', ['winner', 'loser'])
