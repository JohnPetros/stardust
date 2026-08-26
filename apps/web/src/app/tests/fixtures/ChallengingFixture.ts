import { AccountsFaker } from '../../../../../../packages/core/src/auth/domain/entities/fakers/AccountsFaker'
import { UsersFaker } from '../../../../../../packages/core/src/profile/domain/entities/fakers/UsersFaker'
import type { AuthFixture } from './AuthFixture'

export class ChallengingFixture {
  constructor(private readonly auth: AuthFixture) {}

  authenticate(accessToken = 'challenging-page-test-token') {
    return this.auth.authenticate(accessToken)
  }

  createActor(input: {
    id: string
    name: string
    email: string
    slug: string
    completedChallengesIds?: string[]
  }) {
    const account = AccountsFaker.fakeDto({
      id: input.id,
      name: input.name,
      email: input.email,
      isAuthenticated: true,
    })
    const user = UsersFaker.fakeDto({
      id: input.id,
      name: input.name,
      email: input.email,
      slug: input.slug,
      completedChallengesIds: input.completedChallengesIds ?? [],
      lastWeekRankingPosition: null,
    })

    return { account, user }
  }
}
