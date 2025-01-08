import { Entity } from '#global/abstracts'
import { Author } from '#global/entities'
import { Integer, Logical, Name, Slug, Text } from '#global/structs'
import type { SolutionDto } from '#challenging/dtos'
import { EntityNotDefinedError } from '#global/errors'

type SolutionProps = {
  title: Name
  content: Text
  upvotesCount: Integer
  viewsCount: Integer
  commentsCount: Integer
  slug: Slug
  isViewed: Logical
  createdAt: Date
  author: {
    id: string
    entity?: Author
  }
}

export class Solution extends Entity<SolutionProps> {
  static create(dto: SolutionDto) {
    const name = Name.create(dto.title, 'Nome da solução')

    return new Solution(
      {
        title: name,
        content: Text.create(dto.content, 'Conteúdo da solução'),
        slug: Slug.create(dto.slug ?? name.slug, 'Slug da solução'),
        upvotesCount: Integer.create(
          dto.upvotesCount ?? 0,
          'Número de upvotes dessa solução',
        ),
        commentsCount: Integer.create(
          dto.commentsCount ?? 0,
          'Contagem de comentários da solução',
        ),
        viewsCount: Integer.create(dto.viewsCount ?? 0, 'Contagem de views da solução'),
        isViewed: Logical.create(false, 'A solução foi visualizada'),
        createdAt: dto.createdAt ?? new Date(),
        author: {
          id: dto.author.id,
          entity: dto.author.dto && Author.create(dto.author.dto),
        },
      },
      dto.id,
    )
  }

  view() {
    this.props.isViewed = this.isViewed.makeTrue()
    this.props.viewsCount = this.props.viewsCount.increment(1)
  }

  upvote() {
    this.props.upvotesCount = this.props.upvotesCount.increment(1)
  }

  removeUpvote() {
    this.props.upvotesCount = this.props.upvotesCount.dencrement(1)
  }

  get author() {
    if (!this.props.author.entity) throw new EntityNotDefinedError('Solução de desafio')
    return this.props.author.entity
  }

  get authorId() {
    return this.props.author.id
  }

  get title(): Name {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = Name.create(title)
  }

  get content(): Text {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = Text.create(content)
  }

  get slug() {
    return this.props.slug
  }

  get upvotesCount() {
    return this.props.upvotesCount
  }

  get viewsCount() {
    return this.props.viewsCount
  }

  get commentsCount() {
    return this.props.commentsCount
  }

  get isViewed() {
    return this.props.isViewed
  }

  get createdAt() {
    return this.props.createdAt
  }

  get dto(): SolutionDto {
    return {
      id: this.id,
      title: this.title.value,
      content: this.content.value,
      slug: this.slug.value,
      viewsCount: this.viewsCount.value,
      commentsCount: this.commentsCount.value,
      createdAt: this.createdAt,
      author: {
        id: this.authorId,
        dto: this.props.author.entity?.dto,
      },
    }
  }
}
