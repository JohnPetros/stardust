import { Guide } from '@stardust/core/manual/entities'
import { GuideCategory } from '@stardust/core/manual/structures'
import type { DrizzleGuide, DrizzleInsertGuide } from '../../types/entities/manual'

export class DrizzleGuideMapper {
  static toEntity(row: DrizzleGuide): Guide {
    return Guide.create({
      id: row.id,
      ...DrizzleGuideMapper.readContent(row),
      position: row.position ?? 1,
      category: row.category ?? '',
    })
  }
  static toPersistence(guide: Guide): DrizzleInsertGuide {
    return {
      id: guide.id.value,
      ...DrizzleGuideMapper.writeContent(guide),
      ...DrizzleGuideMapper.writeOrganization(guide),
    }
  }

  private static writeOrganization(
    guide: Guide,
  ): Pick<DrizzleInsertGuide, 'position' | 'category'> {
    const { position, category } = guide.dto
    return { position, category: GuideCategory.isValid(category) ? category : 'lsp' }
  }

  private static readContent(row: DrizzleGuide): Pick<Guide['dto'], 'title' | 'content'> {
    return { title: row.title ?? '', content: row.content ?? '' }
  }

  private static writeContent(
    guide: Guide,
  ): Pick<DrizzleInsertGuide, 'title' | 'content'> {
    const { title, content } = guide.dto
    return { title, content }
  }
}
