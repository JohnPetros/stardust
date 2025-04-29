import { AuthorAggregate } from '@/global/domain/aggregates'
import { Integer, Logical, Name, Slug, Text } from '@/global/domain/structures'
import { Entity } from '@/global/domain/abstracts'
import type { SolutionDto } from './dtos'
import { Datetime } from '@/global/libs'

type SolutionProps = {
  title: Name
  content: Text
  upvotesCount: Integer
  viewsCount: Integer
  commentsCount: Integer
  slug: Slug
  isViewed: Logical
  postedAt: Date
  author: AuthorAggregate
}

export class Solution extends Entity<SolutionProps> {
  static create(dto: SolutionDto) {
    return new Solution(
      {
        title: Name.create(dto.title, 'Título da solução'),
        content: Text.create(dto.content, 'Conteúdo da solução'),
        slug: Slug.create(dto.title, 'Slug da solução'),
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
        postedAt: dto.postedAt ?? new Datetime().date(),
        author: AuthorAggregate.create(dto.author),
      },
      dto.id,
    )
  }

  view() {
    this.props.isViewed = this.isViewedbecomeTrue()
    this.props.viewsCount = this.props.viewsCount.increment()
  }

  upvote() {
    this.props.upvotesCount = this.props.upvotesCount.increment()
  }

  removeUpvote() {
    this.props.upvotesCount = this.props.upvotesCount.dencrement()
  }

  get author() {
    return this.props.author
  }

  get title(): Name {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = Name.create(title)
    this.props.slug = Slug.create(this.title.value)
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

  get postedAt() {
    return this.props.postedAt
  }

  get dto(): SolutionDto {
    return {
      id: this.id.value,
      title: this.title.value,
      content: this.content.value,
      slug: this.slug.value,
      upvotesCount: this.upvotesCount.value,
      viewsCount: this.viewsCount.value,
      commentsCount: this.commentsCount.value,
      postedAt: this.postedAt,
      author: this.author.dto,
    }
  }
}
