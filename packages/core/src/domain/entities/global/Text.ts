import type { TextDto } from '#dtos'
import { Entity } from '#domain/abstracts'

export type TextType = 'default' | 'quote' | 'alert' | 'list' | 'image' | 'code' | 'user'

type TextProps = {
  type: TextType
  content: string
  title?: string
  picture?: string
  hasAnimation?: boolean
  isRunnable?: boolean
}

export class Text extends Entity<TextProps> {
  static create(dto: TextDto) {
    return new Text(dto, dto.id)
  }

  get dto(): TextDto {
    return {
      type: this.type,
      content: this.content,
    }
  }

  get type() {
    return this.props.type
  }

  get content() {
    return this.props.content
  }
}
