import { Image } from './Image'
import { Logical } from './Logical'
import { Name } from './Name'
import { StringValidation } from '../../libs'
import type { TextBlockDto } from './dtos'

type TextBlockType = 'default' | 'quote' | 'alert' | 'list' | 'image' | 'code' | 'user'

type TextBlockProps = {
  type: TextBlockType
  content: string
  title?: Name
  picture?: Image
  isRunnable: Logical
}

export class TextBlock {
  readonly type: TextBlockType
  readonly content: string
  readonly isRunnable: Logical
  readonly title?: Name
  readonly picture?: Image

  private constructor(props: TextBlockProps) {
    this.type = props.type
    this.content = props.content
    this.isRunnable = props.isRunnable
    if (props.title) this.title = props.title
    if (props.picture) this.picture = props.picture
  }

  static create(dto: TextBlockDto) {
    if (!TextBlock.isType(dto.type)) {
      throw new Error()
    }

    return new TextBlock({
      type: dto.type,
      content: dto.content,
      title: dto.title ? Name.create(dto.title) : undefined,
      picture: dto.picture ? Image.create(dto.picture) : undefined,
      isRunnable: dto.isRunnable
        ? Logical.create(dto.isRunnable)
        : Logical.createAsFalse(),
    })
  }

  static isType(type: string): type is TextBlockType {
    new StringValidation(type, 'Text Block Type')
      .oneOf(['default', 'quote', 'alert', 'list', 'image', 'code', 'user'])
      .validate()

    return true
  }

  setTitle(title: string) {
    return this.clone({ title: Name.create(title) })
  }

  setPicture(picture: string) {
    return this.clone({ picture: Image.create(picture) })
  }

  setIsRunnable(isRunnable: boolean) {
    return this.clone({
      isRunnable: Logical.create(isRunnable),
    })
  }

  get dto(): TextBlockDto {
    return {
      type: this.type,
      content: this.content,
      isRunnable: this.isRunnable.value,
      picture: this.picture?.value,
      title: this.title?.value,
    }
  }

  private clone(dto?: Partial<TextBlockProps>) {
    return new TextBlock({
      type: this.type,
      content: this.content,
      isRunnable: this.isRunnable,
      title: this.title,
      picture: this.picture,
      ...dto,
    })
  }
}
