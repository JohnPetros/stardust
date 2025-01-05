import { StringValidation } from '#libs'
import { Entity } from '#global/abstracts'
import { ValidationError } from '#global/errors'
import type { TopicDto } from '#forum/dtos'
import type { TopicCategory } from '#forum/types'

type TopicProps = {
  category: TopicCategory
}

export class Topic extends Entity<TopicProps> {
  static create(dto: TopicDto) {
    const category = dto.category

    if (!Topic.isTopicCategory(category)) {
      throw new ValidationError([
        { name: 'topic category', messages: ['não é uma categoria válida'] },
      ])
    }

    return new Topic({ category })
  }

  static isTopicCategory(category: string): category is TopicCategory {
    new StringValidation(category)
      .oneOf(['challenge-feedback', 'challenge-solution', 'post'])
      .validate()

    return true
  }

  get category() {
    return this.props.category
  }
}
