import { AccountsFaker } from '../../../../../../packages/core/src/auth/domain/entities/fakers'
import { AvatarsFaker } from '../../../../../../packages/core/src/shop/domain/entities/fakers/AvatarsFaker'
import { InsigniasFaker } from '../../../../../../packages/core/src/shop/domain/entities/fakers/InsigniasFaker'
import { RocketsFaker } from '../../../../../../packages/core/src/shop/domain/entities/fakers/RocketsFaker'
import { UsersFaker } from '../../../../../../packages/core/src/profile/domain/entities/fakers'
import type { AuthFixture } from './AuthFixture'
import type { ServerAppFixture } from './ServerAppFixture'
import type { ServerMockRoute } from '../shared/types/ServerMockRoute'

const USER_ID = '00000000-0000-4000-8000-000000000501'
const ROCKET_ID = '00000000-0000-4000-8000-000000000502'
const AVATAR_ID = '00000000-0000-4000-8000-000000000503'
const INSIGNIA_ID = '00000000-0000-4000-8000-000000000504'

export const SHOP_ITEM_NAMES = {
  rocket: 'Foguete de Integração',
  avatar: 'Avatar de Integração',
  insignia: 'Insígnia de Integração',
}

export type ShopFixtures = ReturnType<ShopFixture['create']>

export class ShopFixture {
  constructor(
    private readonly serverApp: ServerAppFixture,
    private readonly auth: AuthFixture,
  ) {}

  create(overrides: { coins?: number } = {}) {
    const account = AccountsFaker.fakeDto({
      id: USER_ID,
      email: 'shop.integration@stardust.dev',
      name: 'Explorador da Shop',
      isAuthenticated: true,
    })
    const user = UsersFaker.fakeDto({
      id: USER_ID,
      email: account.email,
      name: account.name,
      slug: 'explorador-da-shop',
      coins: overrides.coins ?? 100,
      lastWeekRankingPosition: null,
      acquiredRocketsIds: [],
      acquiredAvatarsIds: [],
      insigniaRoles: [],
    })
    const rocket = RocketsFaker.fake({
      id: ROCKET_ID,
      name: SHOP_ITEM_NAMES.rocket,
      image: 'rocket.png',
      price: 20,
    }).dto
    const avatar = AvatarsFaker.fakeDto({
      id: AVATAR_ID,
      name: SHOP_ITEM_NAMES.avatar,
      image: 'avatar.png',
      price: 30,
    })
    const insignia = InsigniasFaker.fakeDto({
      id: INSIGNIA_ID,
      name: SHOP_ITEM_NAMES.insignia,
      image: 'insignia.png',
      price: 10,
      role: 'engineer',
      isPurchasable: true,
    })

    return { account, user, rocket, avatar, insignia }
  }

  routes(fixtures: ShopFixtures): ServerMockRoute[] {
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
        method: 'POST',
        path: `/profile/achievements/${USER_ID}/observe`,
        status: 200,
        body: [],
      },
      {
        method: 'GET',
        path: '/reporting/feedback/mine/unread-count',
        status: 200,
        body: { count: 0 },
      },
      { method: 'GET', path: '/space/planets', status: 200, body: [] },
      {
        method: 'GET',
        path: '/shop/insignias',
        status: 200,
        body: [fixtures.insignia],
      },
      {
        method: 'GET',
        path: '/shop/rockets',
        status: 200,
        body: { items: [fixtures.rocket], totalItemsCount: 12 },
      },
      {
        method: 'GET',
        path: '/shop/avatars',
        status: 200,
        body: { items: [fixtures.avatar], totalItemsCount: 12 },
      },
    ]
  }

  async register(overrides: { coins?: number } = {}) {
    const fixtures = this.create(overrides)

    await this.auth.authenticate('shop-page-test-token')
    await this.serverApp.register(this.routes(fixtures))

    return fixtures
  }
}
