import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import { AccountsFaker } from '../../../../../../packages/core/src/auth/domain/entities/fakers/AccountsFaker'
import { ChallengesFaker } from '../../../../../../packages/core/src/challenging/domain/entities/fakers/ChallengesFaker'
import { SolutionsFaker } from '../../../../../../packages/core/src/challenging/domain/entities/fakers/SolutionsFaker'
import { AuthorsFakers } from '../../../../../../packages/core/src/global/domain/entities/fakers/AuthorsFakers'
import { UsersFaker } from '../../../../../../packages/core/src/profile/domain/entities/fakers/UsersFaker'
import type { AuthFixture } from './AuthFixture'
import type { ServerAppFixture } from './ServerAppFixture'
import type { ServerMockRoute } from '../shared/types/ServerMockRoute'

const VISITOR_ID = '00000000-0000-4000-8000-000000000401'
const PROFILE_ID = '00000000-0000-4000-8000-000000000402'
const ACHIEVEMENT_ID = '00000000-0000-4000-8000-000000000403'
const CHALLENGE_ID = '00000000-0000-4000-8000-000000000404'
const SOLUTION_ID = '00000000-0000-4000-8000-000000000405'

export const PROFILE_SLUGS = {
  visitor: 'visitante-estelar',
  profile: 'criador-estelar',
}

export type ProfileFixtures = {
  account: AccountDto
  profile: UserDto
}

export class ProfileFixture {
  constructor(
    private readonly serverApp: ServerAppFixture,
    private readonly auth: AuthFixture,
  ) {}

  createAccount(): AccountDto {
    return AccountsFaker.fakeDto({
      id: VISITOR_ID,
      name: 'Visitante Estelar',
      email: 'visitante.estelar@stardust.dev',
      isAuthenticated: true,
    })
  }

  createProfile(overrides: Partial<UserDto> = {}): UserDto {
    return UsersFaker.fakeDto({
      id: PROFILE_ID,
      name: 'Criador Estelar',
      email: 'criador.estelar@stardust.dev',
      slug: PROFILE_SLUGS.profile,
      level: 7,
      xp: 420,
      streak: 12,
      unlockedStarsIds: [
        '00000000-0000-4000-8000-000000000406',
        '00000000-0000-4000-8000-000000000407',
      ],
      completedPlanetsIds: ['00000000-0000-4000-8000-000000000408'],
      unlockedAchievementsIds: [ACHIEVEMENT_ID],
      insigniaRoles: ['engineer'],
      ...overrides,
    })
  }

  private createPaginationHeaders(totalItemsCount: number, itemsPerPage: number) {
    return {
      'X-Pagination-Response': 'true',
      'X-Total-Items-Count': String(totalItemsCount),
      'X-Items-Per-Page': String(itemsPerPage),
      'X-Page': '1',
    }
  }

  routes(account: AccountDto, profile: UserDto): ServerMockRoute[] {
    const profileId = profile.id as string
    const author = {
      id: profileId,
      entity: AuthorsFakers.fakeDto({ name: profile.name }),
    }
    const challenge = ChallengesFaker.fakeDto({
      id: CHALLENGE_ID,
      slug: 'desafio-estelar',
      title: 'Desafio estelar',
      author,
      postedAt: new Date('2026-01-15T12:00:00.000Z'),
      upvotesCount: 8,
    })
    const solution = SolutionsFaker.fakeDto({
      id: SOLUTION_ID,
      slug: 'solucao-estelar',
      title: 'Solução estelar',
      author,
      postedAt: new Date('2026-01-16T12:00:00.000Z'),
      upvotesCount: 5,
      viewsCount: 21,
    })

    return [
      { method: 'GET', path: '/auth/account', status: 200, body: account },
      {
        method: 'GET',
        path: `/profile/users/id/${VISITOR_ID}`,
        status: 200,
        body: {
          ...profile,
          id: VISITOR_ID,
          slug: PROFILE_SLUGS.visitor,
          name: account.name,
        },
      },
      {
        method: 'GET',
        path: `/profile/users/slug/${profile.slug}`,
        status: 200,
        body: profile,
      },
      {
        method: 'GET',
        path: `/profile/achievements/${profileId}`,
        status: 200,
        body: [
          {
            id: ACHIEVEMENT_ID,
            name: 'Primeira conquista',
            description: 'Conquista de teste',
            icon: 'flag.svg',
            reward: 50,
            requiredCount: 1,
            position: 1,
            metric: 'xp',
          },
        ],
      },
      { method: 'GET', path: '/profile/achievements', status: 200, body: [] },
      { method: 'GET', path: '/space/planets', status: 200, body: [] },
      {
        method: 'GET',
        path: '/challenging/challenges/completed-by-difficulty-level',
        status: 200,
        body: {
          percentage: { easy: 50, medium: 25, hard: 0 },
          absolute: { easy: 2, medium: 1, hard: 0 },
          total: { easy: 4, medium: 4, hard: 2 },
        },
      },
      {
        method: 'GET',
        path: '/challenging/challenges/list',
        status: 200,
        body: [challenge],
        headers: this.createPaginationHeaders(1, 10),
      },
      {
        method: 'GET',
        path: '/challenging/solutions',
        status: 200,
        body: [solution],
        headers: this.createPaginationHeaders(1, 30),
      },
    ]
  }

  async register(profileOverrides: Partial<UserDto> = {}) {
    const account = this.createAccount()
    const profile = this.createProfile(profileOverrides)

    await this.auth.authenticate('profile-page-test-token')
    await this.serverApp.registerSuccessDefaults(this.routes(account, profile))

    return { account, profile }
  }
}

export { VISITOR_ID }
