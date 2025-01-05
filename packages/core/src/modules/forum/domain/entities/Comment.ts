import { Entity } from '#global/abstracts'
import { Integer, Text } from '#global/structs'
import { Author } from '#global/entities'
import { EntityNotDefinedError } from '#global/errors'
import type { CommentDto } from '#forum/dtos'

type CommentProps = {
  content: Text
  repliesCount: Integer
  upvotesCount: Integer
  createdAt: Date
  author: {
    id: string
    entity?: Author
  }
}

export class Comment extends Entity<CommentProps> {
  static create(dto: CommentDto) {
    return new Comment(
      {
        content: Text.create(dto.content),
        repliesCount: Integer.create(
          dto.repliesCount ?? 0,
          'Contagem de respostas desse comentário',
        ),
        upvotesCount: Integer.create(
          dto.upvotesCount ?? 0,
          'Contagem de upvotes desse comentário',
        ),
        author: {
          id: dto.author.id,
          entity: dto.author.dto && Author.create(dto.author.dto),
        },
        createdAt: dto.createdAt ? dto.createdAt : new Date(),
      },
      dto?.id,
    )
  }

  upvote() {
    this.props.upvotesCount = this.props.upvotesCount.increment(1)
  }

  removeUpvote() {
    this.props.upvotesCount = this.props.upvotesCount.dencrement(1)
  }

  get content() {
    return this.props.content
  }

  get author() {
    if (!this.props.author.entity) throw new EntityNotDefinedError('Solução de desafio')
    return this.props.author.entity
  }

  get authorId() {
    return this.props.author.id
  }

  get upvotesCount() {
    return this.props.upvotesCount
  }

  get repliesCount() {
    return this.props.repliesCount
  }

  get createdAt() {
    return this.props.createdAt
  }

  get dto(): CommentDto {
    return {
      id: this.id,
      content: this.content.value,
      repliesCount: this.repliesCount.value,
      upvotesCount: this.upvotesCount.value,
      createdAt: this.createdAt,
      author: {
        id: this.authorId,
        dto: this.props.author.entity?.dto,
      },
    }
  }
}
