import type { TextBlockType } from '../../domain/types'

export type TextBlockDto = {
  type: TextBlockType
  content: string
  title?: string
  picture?: string
  isRunnable?: boolean
}
