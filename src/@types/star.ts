import { Question } from './quiz'
import type { Text } from './text'

export type Star = {
  id: string
  isChallenge: boolean
  name: string
  number: number
  planet_id: string
  texts: Text[]
  isUnlocked: boolean
  questions: Question[]
}
