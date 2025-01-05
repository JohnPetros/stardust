import { Image } from './Image'
import { Logical } from './Logical'
import { Name } from './Name'
import { StringValidation } from '#libs'
import type { TextBlockDto } from '#global/dtos'

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

  static create(type: string, content: string) {
    if (!TextBlock.isType(type)) {
      throw new Error()
    }

    return new TextBlock({
      type,
      content,
      isRunnable: Logical.create(false),
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
      ...dto,
    })
  }
}
