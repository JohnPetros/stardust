import { Logical } from '#global/domain/structures/Logical'
import { AppError } from '#global/domain/errors/AppError'

export type FeedbackMessageAuthorRoleValue = 'user' | 'admin'

export class FeedbackMessageAuthorRole {
  private constructor(readonly value: FeedbackMessageAuthorRoleValue) {}

  static create(value: string): FeedbackMessageAuthorRole {
    if (value !== 'user' && value !== 'admin') {
      throw new AppError(`Invalid feedback message author role: ${value}`)
    }

    return new FeedbackMessageAuthorRole(value as FeedbackMessageAuthorRoleValue)
  }

  get isUser() {
    return Logical.create(this.value === 'user')
  }

  get isAdmin() {
    return Logical.create(this.value === 'admin')
  }
}
