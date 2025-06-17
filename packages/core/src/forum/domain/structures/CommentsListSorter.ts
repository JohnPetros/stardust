import { Logical } from '#global/domain/structures/Logical'
import { StringValidation } from '#global/libs/index'

export type Sorter = 'date' | 'upvotes'

export class CommentsListSorter {
  private constructor(readonly value: Sorter) {}

  static create(value: string) {
    if (!CommentsListSorter.isSorter(value)) throw new Error()
    return new CommentsListSorter(value)
  }

  static createAsByDate() {
    return CommentsListSorter.create('date')
  }

  static createAsByUpvotes() {
    return CommentsListSorter.create('upvotes')
  }

  static isSorter(value: string): value is Sorter {
    new StringValidation(value).oneOf(['date', 'upvotes'])

    return true
  }

  get isByDate(): Logical {
    return Logical.create(this.value === 'date')
  }

  get isByUpvotes(): Logical {
    return Logical.create(this.value === 'upvotes')
  }
}
