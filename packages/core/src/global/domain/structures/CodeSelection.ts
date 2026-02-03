import type { CodeSelectionDto } from './dtos/CodeSelectionDto'

export class CodeSelection {
  private constructor(
    readonly content: string,
    readonly startLine: number,
    readonly endLine: number,
  ) {}

  static create(dto: CodeSelectionDto): CodeSelection {
    return new CodeSelection(dto.content, dto.startLine, dto.endLine)
  }

  get dto(): CodeSelectionDto {
    return {
      content: this.content,
      startLine: this.startLine,
      endLine: this.endLine,
    }
  }
}
