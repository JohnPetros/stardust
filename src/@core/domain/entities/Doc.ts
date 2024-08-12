import type { DocDTO } from '@/@core/dtos'
import { Entity } from '../abstracts'
import { OrdinalNumber, Text } from '../structs'

type DocProps = {
  title: Text
  content: Text
  position: OrdinalNumber
}

export class Doc extends Entity<DocProps> {
  static create(dto: DocDTO): Doc {
    return new Doc(
      {
        title: Text.create(dto.title),
        content: Text.create(dto.content),
        position: OrdinalNumber.create('Doc position', dto.position),
      },
      dto.id
    )
  }

  get title(): Text {
    return this.props.title
  }

  get content(): Text {
    return this.props.content
  }

  get dto(): DocDTO {
    return {
      id: this.id,
      title: this.title.value,
      content: this.content.value,
      position: this.props.position.value,
    }
  }
}
