import { Entity } from '../../../global/domain/abstracts'
import { Name, OrdinalNumber, Text } from '../../../global/domain/structures'
import type { DocDto } from './dtos'

type DocProps = {
  title: Name
  content: Text
  position: OrdinalNumber
}

export class Doc extends Entity<DocProps> {
  static create(dto: DocDto): Doc {
    return new Doc(
      {
        title: Name.create(dto.title),
        content: Text.create(dto.content),
        position: OrdinalNumber.create(dto.position, 'Posição da doc'),
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

  get dto(): DocDto {
    return {
      id: this.id.value,
      title: this.title.value,
      content: this.content.value,
      position: this.props.position.value,
    }
  }
}
