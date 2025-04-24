import { Entity } from '../../../global/domain/abstracts'
import { Integer, Text } from '../../../global/domain/structures'
import { Author } from '../../../global/domain/entities'
import { EntityNotDefinedError } from '../../../global/domain/errors'
import type { CommentDto } from '../../dtos'
import { Datetime } from '../../../global/libs'

type CommentProps = {
  content: Text
  repliesCount: Integer
  upvotesCount: Integer
  postedAt: Date
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
        postedAt: dto.postedAt ?? new Datetime().date(),
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
    if (!this.props.author.entity) throw new EntityNotDefinedError('Autor da solução')
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

  get postedAt() {
    return this.props.postedAt
  }

  get dto(): CommentDto {
    return {
      id: this.id.value,
      content: this.content.value,
      repliesCount: this.repliesCount.value,
      upvotesCount: this.upvotesCount.value,
      postedAt: this.postedAt,
      author: {
        id: this.authorId,
        dto: this.props.author.entity?.dto,
      },
    }
  }
}
