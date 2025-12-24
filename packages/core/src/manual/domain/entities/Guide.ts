import { Entity } from '#global/domain/abstracts/index'
import { Name, OrdinalNumber, Text } from '#global/domain/structures/index'
import type { GuideDto } from './dtos/GuideDto'
import { GuideCategory } from '../structures'

type GuideProps = {
  title: Name
  content: Text
  position: OrdinalNumber
  category: GuideCategory
}

export class Guide extends Entity<GuideProps> {
  static create(dto: GuideDto): Guide {
    return new Guide(
      {
        title: Name.create(dto.title),
        content: Text.create(dto.content),
        position: OrdinalNumber.create(dto.position, 'Posição da guide'),
        category: GuideCategory.create(dto.category),
      },
      dto.id,
    )
  }

  get title(): Name {
    return this.props.title
  }

  get content(): Text {
    return this.props.content
  }

  get dto(): GuideDto {
    return {
      id: this.id.value,
      title: this.title.value,
      content: this.content.value,
      position: this.props.position.value,
      category: this.props.category.value,
    }
  }
}
