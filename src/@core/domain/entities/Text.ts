import type { TextDTO } from '@/@core/dtos'
import { BaseEntity } from '../abstracts'

export type TextType = 'default' | 'quote' | 'alert' | 'list' | 'image' | 'code' | 'user'

type TextProps = {
  id?: string
  type: TextType
  content: string
  title?: string
  picture?: string
  hasAnimation?: boolean
  isRunnable?: boolean
}

export class Text extends BaseEntity {
  private props: TextProps

  private constructor(props: TextProps) {
    super(props.id)
    this.props = props
  }

  static create(dto: TextDTO) {
    return new Text(dto)
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
