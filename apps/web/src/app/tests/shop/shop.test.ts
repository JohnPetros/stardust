import { expect, test, type BrowserContext, type Page } from '@playwright/test'

import { AccountsFaker } from '../../../../../../packages/core/src/auth/domain/entities/fakers'
import { AvatarsFaker } from '../../../../../../packages/core/src/shop/domain/entities/fakers/AvatarsFaker'
import { InsigniasFaker } from '../../../../../../packages/core/src/shop/domain/entities/fakers/InsigniasFaker'
import { RocketsFaker } from '../../../../../../packages/core/src/shop/domain/entities/fakers/RocketsFaker'
import { UsersFaker } from '../../../../../../packages/core/src/profile/domain/entities/fakers'
import { ServerMock } from '../shared/mocks/ServerMock'
import type { ServerMockRoute } from '../shared/types/ServerMockRoute'

const USER_ID = '00000000-0000-4000-8000-000000000501'
const ROCKET_ID = '00000000-0000-4000-8000-000000000502'
const AVATAR_ID = '00000000-0000-4000-8000-000000000503'
const INSIGNIA_ID = '00000000-0000-4000-8000-000000000504'

const ROCKET_NAME = 'Foguete de Integração'
const AVATAR_NAME = 'Avatar de Integração'
const INSIGNIA_NAME = 'Insígnia de Integração'

function createShopFixtures(overrides: { coins?: number } = {}) {
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
    name: ROCKET_NAME,
    image: 'rocket.png',
    price: 20,
  }).dto
  const avatar = AvatarsFaker.fakeDto({
    id: AVATAR_ID,
    name: AVATAR_NAME,
    image: 'avatar.png',
    price: 30,
  })
  const insignia = InsigniasFaker.fakeDto({
    id: INSIGNIA_ID,
    name: INSIGNIA_NAME,
    image: 'insignia.png',
    price: 10,
    role: 'engineer',
    isPurchasable: true,
  })

  return { account, user, rocket, avatar, insignia }
}

function createShopRoutes(
  fixtures: ReturnType<typeof createShopFixtures>,
): ServerMockRoute[] {
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
      body: {
        items: [fixtures.rocket],
        totalItemsCount: 12,
      },
    },
    {
      method: 'GET',
      path: '/shop/avatars',
      status: 200,
      body: {
        items: [fixtures.avatar],
        totalItemsCount: 12,
      },
    },
  ]
}

async function registerShopScenario(
  page: Page,
  context: BrowserContext,
  overrides: { coins?: number } = {},
) {
  const fixtures = createShopFixtures(overrides)

  await context.clearCookies()
  await context.addCookies([
    {
      name: '@stardust:access-token',
      value: 'shop-page-test-token',
      domain: '127.0.0.1',
      path: '/',
    },
  ])
  await ServerMock(page).register(createShopRoutes(fixtures))

  return fixtures
}

async function gotoShopPage(page: Page) {
  const pageResponses = Promise.all(
    ['/shop/insignias', '/shop/rockets', '/shop/avatars'].map((path) =>
      page.waitForResponse(
        (response) => response.url().includes(path) && response.status() === 200,
      ),
    ),
  )

  await page.goto('/shop')
  await pageResponses
}

test.describe('/shop', () => {
  test.afterEach(async ({ page }) => {
    await ServerMock(page).reset()
  })

  test('renders the authenticated catalog sections and their items', async ({
    page,
    context,
  }) => {
    const fixtures = await registerShopScenario(page, context)

    await gotoShopPage(page)

    await expect(page.getByRole('heading', { name: 'Insígnias' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Foguetes' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Avatares' })).toBeVisible()
    await expect(page.getByText(fixtures.insignia.name)).toBeVisible()
    await expect(page.getByText(fixtures.rocket.name)).toBeVisible()
    await expect(page.getByText(fixtures.avatar.name)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Comprar' })).toHaveCount(3)
    await expect(page.getByText('Insígnia God')).toHaveCount(0)
  })

  test('navigates to the shop from the protected side navigation', async ({
    page,
    context,
  }) => {
    await registerShopScenario(page, context)

    await page.goto('/space')

    const shopLink = page.getByRole('link', { name: 'Loja' }).first()
    await expect(shopLink).toHaveAttribute('href', '/shop')

    const shopResponses = Promise.all(
      ['/shop/insignias', '/shop/rockets', '/shop/avatars'].map((path) =>
        page.waitForResponse(
          (response) => response.url().includes(path) && response.status() === 200,
        ),
      ),
    )

    await shopLink.click()
    await expect(page).toHaveURL(/\/shop$/)
    await shopResponses
    await expect(page.getByRole('heading', { name: 'Insígnias' })).toBeVisible()
  })

  test('redirects an unauthenticated user to sign-in when opening the shop', async ({
    page,
    context,
  }) => {
    await context.clearCookies()
    await ServerMock(page).register([
      {
        method: 'GET',
        path: '/auth/account',
        status: 401,
        body: { title: 'Unauthorized', message: 'Não autorizado.' },
      },
    ])

    await page.goto('/shop')

    await expect(page).toHaveURL(/\/auth\/sign-in\?nextRoute=%2Fshop$/)
    await expect(page.getByTestId('email-input')).toBeVisible()
    await expect(page.getByTestId('password-input')).toBeVisible()
  })

  test('filters rockets and requests the next page with the selected order', async ({
    page,
    context,
  }) => {
    await registerShopScenario(page, context)

    await gotoShopPage(page)

    const rocketSearch = page.locator('#rocket-search')
    const filteredRocketRequest = page.waitForRequest((request) => {
      const url = new URL(request.url())
      return (
        request.method() === 'GET' &&
        url.pathname.endsWith('/shop/rockets') &&
        url.searchParams.get('search') === 'orion'
      )
    })

    await rocketSearch.fill('orion')
    await filteredRocketRequest

    await expect(rocketSearch).toHaveValue('orion')

    const orderTrigger = page.locator('#rockets').getByRole('combobox')
    await orderTrigger.click()
    await page.getByRole('option', { name: 'Maior preço' }).click()

    const pageTwoRequest = page.waitForRequest((request) => {
      const url = new URL(request.url())
      return (
        request.method() === 'GET' &&
        url.pathname.endsWith('/shop/rockets') &&
        url.searchParams.get('page') === '2' &&
        url.searchParams.get('priceOrder') === 'descending'
      )
    })

    await page.getByRole('button', { name: '2', exact: true }).first().click()
    await pageTwoRequest
  })

  test('explains when the user cannot afford a shop item', async ({ page, context }) => {
    const fixtures = await registerShopScenario(page, context, { coins: 0 })

    await gotoShopPage(page)

    const rocketSection = page.locator('#rockets')
    await rocketSection.getByRole('button', { name: 'Comprar' }).click()

    await expect(
      page.getByText('Parece que você não tem StarCoins o suficiente'),
    ).toBeVisible()
    await expect(page.getByText(fixtures.rocket.name)).toBeVisible()
  })
})
