import type { TextBlockType } from '#global/types'

export type TextBlockDto = {
  type: TextBlockType
  content: string
  title?: string
  picture?: string
  isRunnable?: boolean
}
