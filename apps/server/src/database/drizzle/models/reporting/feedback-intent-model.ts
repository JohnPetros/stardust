import { pgEnum } from 'drizzle-orm/pg-core'

export const feedbackIntentModel = pgEnum('feedback_intent', ['bug', 'idea', 'other'])
