import { Entity } from '#domain/abstracts'
import { OrdinalNumber, Text } from '#domain/structs'
import type { DocDto } from '../#dtos'

type DocProps = {
  title: Text
  content: Text
  position: OrdinalNumber
}

export class Doc extends Entity<DocProps> {
  static create(dto: DocDto): Doc {
    return new Doc(
      {
        title: Text.create(dto.title),
        content: Text.create(dto.content),
        position: OrdinalNumber.create('Doc position', dto.position),
      },
      dto.id,
    )
  }

  get title(): Text {
    return this.props.title
  }

  get content(): Text {
    return this.props.content
  }

  get dto(): DocDto {
    return {
      id: this.id,
      title: this.title.value,
      content: this.content.value,
      position: this.props.position.value,
    }
  }
}
