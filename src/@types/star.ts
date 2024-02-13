import { Question } from './Quiz'
import type { Text } from './Text'

export type Star = {
  id: string
  slug: string
  name: string
  number: number
  planetId: string
  texts: Text[]
  questions: Question[]
  isChallenge?: boolean
  isUnlocked?: boolean
}
