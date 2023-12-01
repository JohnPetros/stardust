import { Question } from './quiz'
import type { Text } from './text'

export type Star = {
  id: string
  slug: string
  name: string
  number: number
  planet_id: string
  texts: Text[]
  isUnlocked: boolean
  isChallenge: boolean
  questions: Question[]
}
