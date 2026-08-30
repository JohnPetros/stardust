import { expect, test, type BrowserContext, type Page } from '@playwright/test'

import { AccountsFaker } from '../../../../../../packages/core/src/auth/domain/entities/fakers'
import {
  PlanetsFaker,
  StarsFaker,
} from '../../../../../../packages/core/src/space/domain/entities/fakers'
import { UsersFaker } from '../../../../../../packages/core/src/profile/domain/entities/fakers'
import { ServerMock } from '../shared/mocks/ServerMock'
import type { ServerMockRoute } from '../shared/types/ServerMockRoute'

const USER_ID = '00000000-0000-4000-8000-000000000301'
const PLANET_ID = '00000000-0000-4000-8000-000000000302'
const FIRST_STAR_ID = '00000000-0000-4000-8000-000000000303'
const NEW_STAR_ID = '00000000-0000-4000-8000-000000000304'
const LAST_UNLOCKED_STAR_ID = '00000000-0000-4000-8000-000000000305'
const LOCKED_STAR_ID = '00000000-0000-4000-8000-000000000306'

const STAR_NAMES = {
  first: 'Primeira estrela',
  new: 'Estrela recém-desbloqueada',
  lastUnlocked: 'Última estrela desbloqueada',
  locked: 'Estrela bloqueada',
}

function createSpaceFakes(overrides: { hasCompletedSpace?: boolean } = {}) {
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

function createAuthenticatedRoutes(
  fixtures: ReturnType<typeof createSpaceFakes>,
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

async function registerSpaceScenario(
  page: Page,
  context: BrowserContext,
  overrides: { hasCompletedSpace?: boolean } = {},
) {
  const fixtures = createSpaceFakes(overrides)

  await context.clearCookies()
  await context.addCookies([
    {
      name: '@stardust:access-token',
      value: 'space-page-test-token',
      domain: '127.0.0.1',
      path: '/',
    },
  ])
  await ServerMock(page).reset()
  await ServerMock(page).register(createAuthenticatedRoutes(fixtures))

  return fixtures
}

test.describe('/space', () => {
  test.afterEach(async ({ page }) => {
    await ServerMock(page).reset()
  })

  test('loads the journey and renders the progress states for each star', async ({
    page,
    context,
  }) => {
    const fixtures = await registerSpaceScenario(page, context)

    await page.goto('/space')

    await expect(page.getByText(fixtures.planet.name, { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: STAR_NAMES.first })).toBeEnabled()
    await expect(page.getByText('Conteúdo novo')).toBeVisible()
    await expect(page.getByRole('button', { name: STAR_NAMES.locked })).toBeDisabled()
  })

  test('does not navigate when a locked star is selected', async ({ page, context }) => {
    await registerSpaceScenario(page, context)
    await page.goto('/space')

    const lockedStarButton = page.getByRole('button', { name: STAR_NAMES.locked })
    await expect(lockedStarButton).toBeDisabled()

    await lockedStarButton.click({ force: true })

    await expect(page).toHaveURL(/\/space$/)
  })

  test('falls back to the lesson when an unlocked star has no challenge', async ({
    page,
    context,
  }) => {
    const fixtures = await registerSpaceScenario(page, context)
    const star = fixtures.lastUnlockedStar

    await ServerMock(page).register([
      ...createAuthenticatedRoutes(fixtures),
      {
        method: 'GET',
        path: `/challenging/challenges/star/${star.id}`,
        status: 404,
        body: { message: 'Challenge not found' },
      },
      {
        method: 'GET',
        path: `/space/stars/slug/${star.slug}`,
        status: 200,
        body: star,
      },
      {
        method: 'GET',
        path: `/lesson/questions/star/${star.id}`,
        status: 200,
        body: [],
      },
      {
        method: 'GET',
        path: `/lesson/text-blocks/star/${star.id}`,
        status: 200,
        body: [],
      },
    ])

    await page.goto('/space')

    const challengeResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith(`/challenging/challenges/star/${star.id}`) &&
        response.status() === 404,
    )

    const lessonNavigation = page.waitForURL(`/lesson/${star.slug}`)

    await page.locator('button').filter({ hasText: STAR_NAMES.lastUnlocked }).click()
    await challengeResponse
    await lessonNavigation
  })

  test('shows the ending link after the user completes the space', async ({
    page,
    context,
  }) => {
    await registerSpaceScenario(page, context, { hasCompletedSpace: true })
    await page.goto('/space')

    await expect(page.getByRole('link', { name: 'Agradecimentos.' })).toHaveAttribute(
      'href',
      '/lesson/ending',
    )
  })

  test('navigates to space from the protected shop and redirects guests to sign-in', async ({
    page,
    context,
  }) => {
    const fixtures = await registerSpaceScenario(page, context)

    await page.goto('/shop')
    const learnLink = page.getByRole('link', { name: 'Aprender' }).first()
    await expect(learnLink).toHaveAttribute('href', '/space')

    await Promise.all([page.waitForURL('**/space'), learnLink.click()])
    await expect(page.getByText(fixtures.planet.name, { exact: true })).toBeVisible()

    await context.clearCookies()
    await ServerMock(page).register([
      {
        method: 'GET',
        path: '/auth/account',
        status: 401,
        body: { title: 'Unauthorized', message: 'Não autorizado.' },
      },
    ])

    await page.goto('/space')

    await expect(page).toHaveURL(/\/auth\/sign-in\?nextRoute=%2Fspace$/)
    await expect(page.getByTestId('email-input')).toBeVisible()
  })
})
