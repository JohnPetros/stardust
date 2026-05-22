import type { TextBlockAudioDto } from '#global/domain/entities/dtos/TextBlockAudioDto'

export type TextBlockDto = {
  type: string
  content: string
  title?: string
  picture?: string
  isRunnable?: boolean
  audio?: TextBlockAudioDto
}
