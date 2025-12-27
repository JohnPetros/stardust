import type { ChatActionDto } from './ChatActionDto'

export type ChatMessageDto = {
  content: string | ChatActionDto
  sender: string
  sentAt: string
}
