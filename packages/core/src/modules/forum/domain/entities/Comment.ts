import { Entity } from '#global/abstracts'
import { Id, Integer, Text } from '#global/structs'
import type { CommentDto } from '#forum/dtos'
import { Author } from './Author'

type CommentProps = {
  content: Text
  parentCommentId: Id | null
  repliesCount: Integer
  upvotesCount: Integer
  createdAt: Date
  author: Author
}

export class Comment extends Entity<CommentProps> {
  static create(dto: CommentDto) {
    return new Comment({
      content: Text.create(dto.content),
      repliesCount: Integer.create(
        'Contagem de respostas desse comentário',
        dto.repliesCount ?? 0,
      ),
      upvotesCount: Integer.create(
        'Contagem de upvotes desse comentário',
        dto.upvotesCount ?? 0,
      ),
      parentCommentId: dto.parentCommentId ? Id.create(dto.parentCommentId) : null,
      author: Author.create(dto.author),
      createdAt: dto.createdAt ? dto.createdAt : new Date(),
    })
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
    return this.props.author
  }

  get upvotesCount() {
    return this.props.upvotesCount
  }

  get repliesCount() {
    return this.props.repliesCount
  }

  get parentCommentId() {
    return this.props.parentCommentId
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
      parentCommentId: this.parentCommentId?.value,
      createdAt: this.createdAt,
      author: {
        id: this.author.id,
        name: this.author.name.value,
        slug: this.author.slug.value,
        avatar: {
          name: this.author.avatar.name.value,
          image: this.author.avatar.image.value,
        },
      },
    }
  }
}
