import type { TextSelectionDto } from './dtos/TextSelectionDto'

export class TextSelection {
  private constructor(
    readonly content: string,
    readonly preview: string,
  ) {}

  static create(dto: TextSelectionDto): TextSelection {
    return new TextSelection(dto.content, dto.preview)
  }

  get dto(): TextSelectionDto {
    return {
      content: this.content,
      preview: this.preview,
    }
  }
}
