import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import { TextBlock } from '@stardust/core/global/structures'

export class DrizzleTextBlockMapper {
  static toEntity(dto: TextBlockDto): TextBlock {
    return TextBlock.create(dto)
  }
  static toPersistence(block: TextBlock): TextBlockDto {
    return block.dto
  }
}
