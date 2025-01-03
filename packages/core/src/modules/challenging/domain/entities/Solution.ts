import { Entity } from '#global/abstracts'
import { Author } from '#global/entities'
import { Integer, Name, Text } from '#global/structs'
import type { SolutionDto } from '#challenging/dtos'
import { EntityNotDefinedError } from '#global/errors'

type SolutionProps = {
  title: Name
  content: Text
  viewsCount: Integer
  createdAt: Date
  author: {
    id: string
    entity?: Author
  }
}

export class Solution extends Entity<SolutionProps> {
  static create(dto: SolutionDto) {
    return new Solution({
      title: Name.create(dto.title, 'Solution name'),
      content: Text.create(dto.content),
      createdAt: dto.createdAt ?? new Date(),
      author: {
        id: dto.author.id,
        entity: dto.author.dto && Author.create(dto.author.dto),
      },
      viewsCount: Integer.create(dto.viewsCount, 'Contagem de views da solução'),
    })
  }

  get author() {
    if (!this.props.author.entity) throw new EntityNotDefinedError('Solução de desafio')
    return this.props.author.entity
  }

  get authorId() {
    return this.props.author.id
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get viewsCount() {
    return this.props.viewsCount
  }

  get createdAt() {
    return this.props.createdAt
  }

  get dto(): SolutionDto {
    return {
      id: this.id,
      title: this.title.value,
      content: this.content.value,
      createdAt: this.createdAt,
      viewsCount: this.viewsCount.value,
      author: {
        id: this.authorId,
        dto: this.author.dto,
      },
    }
  }
}
