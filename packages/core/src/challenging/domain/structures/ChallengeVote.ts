import { Logical } from '#global/domain/structures/index'
import { StringValidation } from '#global/libs/validation/index'

type Vote = 'upvote' | 'downvote' | 'none'

export class ChallengeVote {
  constructor(readonly value: Vote) {}

  static create(value: string) {
    if (!ChallengeVote.isVote(value)) throw new Error()

    return new ChallengeVote(value)
  }

  static createAsNone() {
    return new ChallengeVote('none')
  }

  static createAsUpvote() {
    return new ChallengeVote('upvote')
  }

  static createAsDownvote() {
    return new ChallengeVote('downvote')
  }

  static isVote(value: string): value is Vote {
    new StringValidation(value, 'Voto de desafio').oneOf(['upvote', 'downvote', 'none'])

    return true
  }

  becomeNone(): ChallengeVote {
    return new ChallengeVote('none')
  }

  becomeUpvote(): ChallengeVote {
    return new ChallengeVote('upvote')
  }

  becomeDownvote(): ChallengeVote {
    return new ChallengeVote('downvote')
  }

  isEqualTo(vote: ChallengeVote): Logical {
    return Logical.create(this.value === vote.value)
  }

  get isUpvote(): Logical {
    return Logical.create(this.value === 'upvote')
  }

  get isDownvote(): Logical {
    return Logical.create(this.value === 'downvote')
  }

  get isNone(): Logical {
    return Logical.create(this.value === 'none')
  }
}
