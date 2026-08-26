import { expect, test, type Page, type Request } from '../playwright'

import type { ChallengingFixture } from '../fixtures/ChallengingFixture'
import { AccountsFaker } from '../../../../../../packages/core/src/auth/domain/entities/fakers/AccountsFaker'
import { ChallengeCategoriesFaker } from '../../../../../../packages/core/src/challenging/domain/entities/fakers/ChallengeCategoriesFaker'
import { ChallengesFaker } from '../../../../../../packages/core/src/challenging/domain/entities/fakers/ChallengesFaker'
import { UsersFaker } from '../../../../../../packages/core/src/profile/domain/entities/fakers/UsersFaker'
import { ServerMock } from '../shared/mocks/ServerMock'
import type { ServerMockRoute } from '../shared/types/ServerMockRoute'

const CHALLENGES_ROUTE = '/challenging/challenges'
const CHALLENGE_PAGE_ROUTE = `${CHALLENGES_ROUTE}/soma-complementar/challenge`
const TEST_SERVER_ROUTE = '/api/tests/server'
const USER_ID = '00000000-0000-4000-8000-000000000601'
const CATEGORY_ID = '00000000-0000-4000-8000-000000000602'
const CHALLENGE_ID = '00000000-0000-4000-8000-000000000603'

const category = ChallengeCategoriesFaker.fakeDto({
  id: CATEGORY_ID,
  name: 'Laços',
})

const challenge = ChallengesFaker.fakeDto({
  id: CHALLENGE_ID,
  slug: 'soma-complementar',
  title: 'Soma complementar',
  difficultyLevel: 'easy',
  categories: [category],
  isNew: true,
  isPublic: true,
  starId: null,
  author: {
    id: USER_ID,
    entity: {
      name: 'Explorador de testes',
      slug: 'explorador-de-testes',
      avatar: { name: 'Apollo', image: '/images/avatar.png' },
    },
  },
})

const listingChallenges = Array.from({ length: 20 }, (_, index) => ({
  ...challenge,
  id: `00000000-0000-4000-8000-${String(index + 603).padStart(12, '0')}`,
  title: index === 0 ? challenge.title : `Desafio de teste ${index}`,
}))

function createPaginationHeaders(totalItemsCount: number) {
  return {
    'X-Pagination-Response': 'true',
    'X-Total-Items-Count': String(totalItemsCount),
    'X-Items-Per-Page': '20',
    'X-Page': '1',
  }
}

function createAuthenticatedRoutes(): ServerMockRoute[] {
  const account = AccountsFaker.fakeDto({
    id: USER_ID,
    name: 'Explorador de testes',
    email: 'explorador@stardust.dev',
    isAuthenticated: true,
  })
  const user = UsersFaker.fakeDto({
    id: USER_ID,
    name: account.name,
    email: account.email,
    slug: 'explorador-de-testes',
    completedChallengesIds: [],
    completedPlanetsIds: [],
    lastWeekRankingPosition: null,
  })

  return [
    { method: 'GET', path: '/auth/account', status: 200, body: account },
    { method: 'GET', path: `/profile/users/id/${USER_ID}`, status: 200, body: user },
    {
      method: 'GET',
      path: '/challenging/challenges/categories',
      status: 200,
      body: [category],
    },
    {
      method: 'GET',
      path: '/challenging/challenges/list',
      status: 200,
      body: listingChallenges,
      headers: createPaginationHeaders(21),
    },
    {
      method: 'GET',
      path: '/challenging/challenges/slug/soma-complementar',
      status: 200,
      body: challenge,
    },
    {
      method: 'GET',
      path: '/challenging/challenges/slug/soma-complementar/navigation',
      status: 200,
      body: { previousChallengeSlug: null, nextChallengeSlug: null },
    },
    {
      method: 'GET',
      path: `/challenging/challenges/${CHALLENGE_ID}/vote`,
      status: 200,
      body: { challengeVote: 'none' },
    },
  ]
}

async function registerScenario(page: Page, challenging: ChallengingFixture) {
  await challenging.authenticate('challenges-page-test-token')

  await ServerMock(page).registerSuccessDefaults(createAuthenticatedRoutes())
}

function isChallengesListRequest(request: Request) {
  return (
    request.method() === 'GET' &&
    new URL(request.url()).pathname === `${TEST_SERVER_ROUTE}/challenging/challenges/list`
  )
}

test.describe(CHALLENGES_ROUTE, () => {
  test('loads the challenge listing with categories and challenge cards', async ({
    page,
    challenging,
  }) => {
    await registerScenario(page, challenging)

    const listResponse = page.waitForResponse(
      (response) =>
        isChallengesListRequest(response.request()) && response.status() === 200,
    )

    await page.goto(CHALLENGES_ROUTE)
    await listResponse

    await expect(page.getByText('Soma complementar', { exact: true })).toBeVisible()
    await expect(page.getByText('Novo', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Laços', { exact: true }).first()).toBeVisible()
    await expect(
      page.getByRole('combobox').filter({ hasText: 'Dificuldade' }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Categorias' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Mostrar mais' })).toBeVisible()
  })

  test('applies title, difficulty and category filters to the URL and request', async ({
    page,
    challenging,
  }) => {
    await registerScenario(page, challenging)
    const searchRequest = page.waitForRequest((request) => {
      const url = new URL(request.url())
      return isChallengesListRequest(request) && url.searchParams.get('title') === 'soma'
    })
    await page.goto(`${CHALLENGES_ROUTE}?title=soma`)
    const requestWithTitle = await searchRequest
    expect(new URL(requestWithTitle.url()).searchParams.get('title')).toBe('soma')
    await expect(page).toHaveURL(/title=soma/)
    await expect(
      page.getByRole('combobox').filter({ hasText: 'Dificuldade' }),
    ).toBeVisible()

    const difficultyResponse = page.waitForResponse((response) => {
      const url = new URL(response.url())
      return (
        isChallengesListRequest(response.request()) &&
        response.status() === 200 &&
        url.searchParams.get('difficulty') === 'medium' &&
        url.searchParams.get('title') === 'soma'
      )
    })
    await page.getByRole('combobox').filter({ hasText: 'Dificuldade' }).click()
    await page.getByRole('option', { name: 'Médio' }).click()
    await difficultyResponse
    await expect(page).toHaveURL(/title=soma/)
    await expect(page).toHaveURL(/difficultyLevel=medium/)
    await expect(page.getByText('Soma complementar', { exact: true })).toBeVisible()

    const categoryResponse = page.waitForResponse((response) => {
      const url = new URL(response.url())
      return (
        isChallengesListRequest(response.request()) &&
        response.status() === 200 &&
        url.searchParams.get('categoriesIds') === CATEGORY_ID &&
        url.searchParams.get('difficulty') === 'medium'
      )
    })
    await page.getByRole('button', { name: 'Categorias' }).click()
    const categoryButton = page.getByRole('button', { name: 'laços', exact: true })
    await expect(categoryButton).toBeVisible()
    await categoryButton.click()
    await categoryResponse

    await expect(page).toHaveURL(new RegExp(`categoriesIds=${CATEGORY_ID}`))
    await expect(page.getByText('Laços', { exact: true }).first()).toBeVisible()
  })

  test('requests the next page when showing more challenges', async ({
    page,
    challenging,
  }) => {
    await registerScenario(page, challenging)
    await page.goto(CHALLENGES_ROUTE)
    await expect(page.getByText('Soma complementar', { exact: true })).toBeVisible()

    const nextPageRequest = page.waitForRequest((request) => {
      const url = new URL(request.url())
      return isChallengesListRequest(request) && url.searchParams.get('page') === '2'
    })

    await page.getByRole('button', { name: 'Mostrar mais' }).click()
    const request = await nextPageRequest
    const requestUrl = new URL(request.url())

    expect(requestUrl.searchParams.get('page')).toBe('2')
    expect(requestUrl.searchParams.get('itemsPerPage')).toBe('20')
  })

  test('navigates to the selected challenge page', async ({ page, challenging }) => {
    await registerScenario(page, challenging)
    await page.goto(CHALLENGES_ROUTE)
    await expect(page.getByText('Soma complementar', { exact: true })).toBeVisible()

    await Promise.all([
      page.waitForURL(`**${CHALLENGE_PAGE_ROUTE}`),
      page.getByRole('link', { name: 'Soma complementar', exact: true }).click(),
    ])

    await expect(page).toHaveURL(CHALLENGE_PAGE_ROUTE)
    await expect(page.getByRole('heading', { name: 'Soma complementar' })).toBeVisible()
  })
})
