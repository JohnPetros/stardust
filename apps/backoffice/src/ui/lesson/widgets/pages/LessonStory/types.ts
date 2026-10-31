import type { TextBlockDto } from '@stardust/core/global/entities/dtos'

export type SupportedTextBlockType =
  | 'default'
  | 'user'
  | 'alert'
  | 'quote'
  | 'code'
  | 'image'

export type TextBlockEditorItem = TextBlockDto & {
  id: string
  type: SupportedTextBlockType
}
