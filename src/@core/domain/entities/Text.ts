import type { TextDTO } from '@/@core/dtos'
import { Entity } from '../abstracts'

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
  static create(dto: TextDTO) {
    return new Text(dto, dto.id)
  }

  get dto(): TextDTO {
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
