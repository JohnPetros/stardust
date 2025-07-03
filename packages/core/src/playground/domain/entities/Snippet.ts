import { Entity } from '#global/domain/abstracts/Entity'
import { AuthorAggregate } from '#global/domain/aggregates/AuthorAggregate'
import { Logical, Name, Text } from '#global/domain/structures/index'
import { Datetime } from '#global/libs/index'
import type { SnippetDto } from './dtos'

type SnippetProps = {
  title: Name
  code: Text
  isPublic: Logical
  createdAt: Date
  author: AuthorAggregate
}

export class Snippet extends Entity<SnippetProps> {
  static readonly DEFEAULT_TITLE = 'Sem título'

  static create(dto: SnippetDto) {
    return new Snippet(
      {
        title: Name.create(dto.title ?? Snippet.DEFEAULT_TITLE),
        code: Text.create(dto.code),
        isPublic: Logical.create(dto.isPublic),
        author: AuthorAggregate.create(dto.author),
        createdAt: dto.createdAt ?? new Datetime().date(),
      },
      dto?.id,
    )
  }

  get title(): Name {
    return this.props.title
  }

  set title(title: Name) {
    this.props.title = title
  }

  get code(): Text {
    return this.props.code
  }

  set code(code: Text) {
    this.props.code = code
  }

  get isPublic(): Logical {
    return this.props.isPublic
  }

  set isPublic(isPublic: Logical) {
    this.props.isPublic = isPublic
  }

  get authorId() {
    return this.props.author.id
  }

  get createdAt() {
    return this.props.createdAt
  }

  get author() {
    return this.props.author
  }

  get dto(): SnippetDto {
    return {
      id: this.id.value,
      code: this.code.value,
      isPublic: this.isPublic.value,
      title: this.title.value,
      createdAt: this.createdAt,
      author: this.author.dto,
    }
  }
}
