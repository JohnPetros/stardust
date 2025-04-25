import type { TextBlockType } from '../../types'

export type TextBlockDto = {
  type: TextBlockType
  content: string
  title?: string
  picture?: string
  isRunnable?: boolean
}
