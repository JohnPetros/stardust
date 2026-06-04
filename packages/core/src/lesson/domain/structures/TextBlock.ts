import { Image } from '../../../global/domain/structures/Image'
import { Logical } from '../../../global/domain/structures/Logical'
import { Name } from '../../../global/domain/structures/Name'
import { StringValidation } from '../../../global/libs'
import type { TextBlockDto } from '../../../global/domain/structures/dtos'
import type { TextBlockType } from '../../../global/domain/types'
import { TextBlockAudio } from './TextBlockAudio'

type TextBlockProps = {
  type: TextBlockType
  content: string
  title?: Name
  picture?: Image
  isRunnable: Logical
  audio?: TextBlockAudio
}

export class TextBlock {
  readonly type: TextBlockType
  readonly content: string
  readonly isRunnable: Logical
  readonly title?: Name
  readonly picture?: Image
  readonly audio?: TextBlockAudio

  private constructor(props: TextBlockProps) {
    this.type = props.type
    this.content = props.content
    this.isRunnable = props.isRunnable
    if (props.title) this.title = props.title
    if (props.picture) this.picture = props.picture
    if (props.audio) this.audio = props.audio
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
      audio: dto.audio ? TextBlockAudio.create(dto.audio) : undefined,
    })
  }

  static isType(type: string): type is TextBlockType {
    new StringValidation(type, 'Text Block Type')
      .oneOf(['default', 'quote', 'alert', 'list', 'image', 'code', 'code-line', 'user'])
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

  setAudio(audio: TextBlockAudio) {
    return this.clone({ audio })
  }

  removeAudio() {
    return this.clone({ audio: undefined })
  }

  get dto(): TextBlockDto {
    return {
      type: this.type,
      content: this.content,
      isRunnable: this.isRunnable.value,
      picture: this.picture?.value,
      title: this.title?.value,
      ...(this.audio ? { audio: this.audio.dto } : {}),
    }
  }

  get canHaveAudio(): Logical {
    return Logical.create(
      this.type === 'default' ||
        this.type === 'alert' ||
        this.type === 'quote' ||
        this.type === 'image',
    )
  }

  private clone(dto?: Partial<TextBlockProps>) {
    return new TextBlock({
      type: this.type,
      content: this.content,
      isRunnable: this.isRunnable,
      title: this.title,
      picture: this.picture,
      audio: this.audio,
      ...dto,
    })
  }
}
