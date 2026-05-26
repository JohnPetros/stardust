import type { TextBlockAudioDto } from './TextBlockAudioDto'

export type TextBlockDto = {
  type: string
  content: string
  title?: string
  picture?: string
  isRunnable?: boolean
  audio?: TextBlockAudioDto
}
