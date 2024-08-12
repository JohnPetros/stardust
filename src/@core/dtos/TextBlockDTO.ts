import type { TextBlockType } from '../domain/types'

export type TextBlockDTO = {
  type: TextBlockType
  content: string
  title?: string
  picture?: string
  isRunnable?: boolean
}
