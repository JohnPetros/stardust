import { Entity } from '#global/domain/abstracts/index'
import { Integer, Text } from '#global/domain/structures/index'
import { AuthorAggregate } from '#global/domain/aggregates/index'
import { Datetime } from '#global/libs/index'
import type { CommentDto } from './dtos'

type CommentProps = {
  content: Text
  repliesCount: Integer
  upvotesCount: Integer
  postedAt: Date
  author: AuthorAggregate
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
        author: AuthorAggregate.create(dto.author),
        postedAt: dto.postedAt ?? new Datetime().date(),
      },
      dto?.id,
    )
  }

  upvote() {
    this.props.upvotesCount = this.props.upvotesCount.increment()
  }

  removeUpvote() {
    this.props.upvotesCount = this.props.upvotesCount.decrement()
  }

  set content(content: Text) {
    this.props.content = content
  }

  get content() {
    return this.props.content
  }

  get author() {
    return this.props.author
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
      author: this.author.dto,
    }
  }
}
