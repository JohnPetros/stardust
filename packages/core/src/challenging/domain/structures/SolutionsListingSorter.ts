import { Logical } from '#global/domain/structures/index'
import { StringValidation } from '#global/libs/index'

type ListingSorter = 'date' | 'upvotesCount' | 'commentsCount' | 'viewsCount'

export class SolutionsListingSorter {
  constructor(readonly value: ListingSorter) {}

  static create(value: string) {
    if (!SolutionsListingSorter.isListingSorter(value)) {
      throw new Error('Invalid listing sorter')
    }
    return new SolutionsListingSorter(value)
  }

  static isListingSorter(level: string): level is ListingSorter {
    new StringValidation(level, 'Solutions List Sorter').oneOf([
      'date',
      'upvotesCount',
      'commentsCount',
      'viewsCount',
    ])
    return true
  }

  get isDate(): Logical {
    return Logical.create(this.value === 'date')
  }

  get isUpvotesCount(): Logical {
    return Logical.create(this.value === 'upvotesCount')
  }

  get isCommentsCount(): Logical {
    return Logical.create(this.value === 'commentsCount')
  }

  get isViewsCount(): Logical {
    return Logical.create(this.value === 'viewsCount')
  }
}
