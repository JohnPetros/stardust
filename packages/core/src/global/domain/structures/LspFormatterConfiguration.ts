import type { LspFormatterConfigurationDto } from './dtos'
import { Integer } from './Integer'
import { TextDelimiter } from './TextDelimiter'

export class LspFormatterConfiguration {
  private constructor(
    readonly textDelimiter: TextDelimiter,
    readonly maxCharsPerLine: Integer,
    readonly indentationSize: Integer,
  ) {}

  static create(dto: LspFormatterConfigurationDto): LspFormatterConfiguration {
    return new LspFormatterConfiguration(
      TextDelimiter.create(dto.textDelimiter),
      Integer.create(dto.maxCharsPerLine),
      Integer.create(dto.indentationSize),
    )
  }

  get dto(): LspFormatterConfigurationDto {
    return {
      textDelimiter: this.textDelimiter.value,
      maxCharsPerLine: this.maxCharsPerLine.value,
      indentationSize: this.indentationSize.value,
    }
  }
}
