import { Entity } from '#global/abstracts'
import { Author } from '#global/entities'
import { EntityNotDefinedError } from '#global/errors'
import { Logical, Name, Text } from '#global/structs'
import { Datetime } from '#libs'
import type { SnippetDto } from '../dtos'

type SnippetProps = {
  title?: Name
  code: Text
  isPublic: Logical
  createdAt: Date
  author: {
    id: string
    entity?: Author
  }
}

export class Snippet extends Entity<SnippetProps> {
  static create(dto: SnippetDto) {
    return new Snippet(
      {
        title: Name.create(dto.title ?? 'Sem título'),
        code: Text.create(dto.code),
        isPublic: Logical.create(dto.isPublic),
        author: {
          id: dto.author.id,
          entity: dto.author.dto && Author.create(dto.author.dto),
        },
        createdAt: dto.createdAt ?? new Datetime().date(),
      },
      dto?.id,
    )
  }

  get title(): Name {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = Name.create(title, 'Título do snippet')
  }

  get code(): Text {
    return this.props.code
  }

  set code(code: string) {
    this.props.code = Text.create(code, 'Código do snippet')
  }

  get isPublic() {
    return this.props.isPublic
  }

  get authorId() {
    return this.props.author.id
  }

  get createdAt() {
    return this.props.createdAt
  }

  get author() {
    if (!this.props.author.entity) throw new EntityNotDefinedError('Autor do snippet')
    return this.props.author.entity
  }

  get dto(): SnippetDto {
    return {
      id: this.id,
      code: this.code.value,
      isPublic: this.isPublic.value,
      title: this.title.value,
      createdAt: this.createdAt,
      author: {
        id: this.authorId,
        dto: this.props.author.entity?.dto,
      },
    }
  }
}
