import { AccountsFaker } from '../../../../../../packages/core/src/auth/domain/entities/fakers'
import {
  PlanetsFaker,
  StarsFaker,
} from '../../../../../../packages/core/src/space/domain/entities/fakers'
import { UsersFaker } from '../../../../../../packages/core/src/profile/domain/entities/fakers'
import type { AuthFixture } from './AuthFixture'
import type { ServerAppFixture } from './ServerAppFixture'
import type { ServerMockRoute } from '../shared/types/ServerMockRoute'

const USER_ID = '00000000-0000-4000-8000-000000000301'
const PLANET_ID = '00000000-0000-4000-8000-000000000302'
const FIRST_STAR_ID = '00000000-0000-4000-8000-000000000303'
const NEW_STAR_ID = '00000000-0000-4000-8000-000000000304'
const LAST_UNLOCKED_STAR_ID = '00000000-0000-4000-8000-000000000305'
const LOCKED_STAR_ID = '00000000-0000-4000-8000-000000000306'

export const STAR_NAMES = {
  first: 'Primeira estrela',
  new: 'Estrela recém-desbloqueada',
  lastUnlocked: 'Última estrela desbloqueada',
  locked: 'Estrela bloqueada',
}

export type SpaceFixtures = ReturnType<SpaceFixture['create']>

export class SpaceFixture {
  constructor(
    private readonly serverApp: ServerAppFixture,
    private readonly auth: AuthFixture,
  ) {}

  create(overrides: { hasCompletedSpace?: boolean } = {}) {
    const account = AccountsFaker.fakeDto({
      id: USER_ID,
      name: 'Explorador do espaço',
      email: 'explorador-do-espaco@stardust.dev',
      isAuthenticated: true,
    })
    const user = UsersFaker.fakeDto({
      id: USER_ID,
      name: account.name,
      email: account.email,
      slug: 'explorador-do-espaco',
      unlockedStarsIds: [FIRST_STAR_ID, NEW_STAR_ID, LAST_UNLOCKED_STAR_ID],
      recentlyUnlockedStarsIds: [NEW_STAR_ID],
      hasCompletedSpace: overrides.hasCompletedSpace ?? false,
      lastWeekRankingPosition: null,
    })
    const firstStar = StarsFaker.fakeDto({
      id: FIRST_STAR_ID,
      name: STAR_NAMES.first,
      number: 1,
      slug: 'primeira-estrela',
      isChallenge: false,
    })
    const newStar = StarsFaker.fakeDto({
      id: NEW_STAR_ID,
      name: STAR_NAMES.new,
      number: 2,
      slug: 'estrela-recem-desbloqueada',
      isChallenge: false,
    })
    const lastUnlockedStar = StarsFaker.fakeDto({
      id: LAST_UNLOCKED_STAR_ID,
      name: STAR_NAMES.lastUnlocked,
      number: 3,
      slug: 'ultima-estrela-desbloqueada',
      isChallenge: false,
    })
    const lockedStar = StarsFaker.fakeDto({
      id: LOCKED_STAR_ID,
      name: STAR_NAMES.locked,
      number: 4,
      slug: 'estrela-bloqueada',
      isChallenge: false,
    })
    const planet = PlanetsFaker.fakeDto({
      id: PLANET_ID,
      name: 'Planeta de testes',
      icon: 'planet-icon.png',
      image: 'planet-image.png',
      stars: [firstStar, newStar, lastUnlockedStar, lockedStar],
    })

    return { account, user, planet, lastUnlockedStar }
  }

  authenticatedRoutes(fixtures: SpaceFixtures): ServerMockRoute[] {
    return [
      { method: 'GET', path: '/auth/account', status: 200, body: fixtures.account },
      {
        method: 'GET',
        path: `/profile/users/id/${USER_ID}`,
        status: 200,
        body: fixtures.user,
      },
      { method: 'GET', path: '/profile/achievements', status: 200, body: [] },
      {
        method: 'GET',
        path: '/reporting/feedback/mine/unread-count',
        status: 200,
        body: { count: 0 },
      },
      {
        method: 'POST',
        path: `/profile/achievements/${USER_ID}/observe`,
        status: 200,
        body: [],
      },
      { method: 'GET', path: '/space/planets', status: 200, body: [fixtures.planet] },
      { method: 'GET', path: '/shop/insignias', status: 200, body: [] },
      {
        method: 'GET',
        path: '/shop/rockets',
        status: 200,
        body: { items: [], totalItemsCount: 0 },
      },
      {
        method: 'GET',
        path: '/shop/avatars',
        status: 200,
        body: { items: [], totalItemsCount: 0 },
      },
    ]
  }

  async register(overrides: { hasCompletedSpace?: boolean } = {}) {
    const fixtures = this.create(overrides)

    await this.auth.authenticate('space-page-test-token')
    await this.serverApp.register(this.authenticatedRoutes(fixtures))

    return fixtures
  }
}
