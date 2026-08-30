import { expect, test, type Page, type Request } from '../playwright'

import type { ChallengingFixture } from '../fixtures/ChallengingFixture'
import { AccountsFaker } from '../../../../../../packages/core/src/auth/domain/entities/fakers/AccountsFaker'
import { ChallengesFaker } from '../../../../../../packages/core/src/challenging/domain/entities/fakers/ChallengesFaker'
import { UsersFaker } from '../../../../../../packages/core/src/profile/domain/entities/fakers/UsersFaker'
import { ServerMock } from '../shared/mocks/ServerMock'
import type { ServerMockRoute } from '../shared/types/ServerMockRoute'

const CHALLENGE_SLUG = 'soma-complementar'
const CHALLENGE_ROUTE = `/challenging/challenges/${CHALLENGE_SLUG}/challenge`
const TEST_SERVER_ROUTE = '/api/tests/server'
const USER_ID = '00000000-0000-4000-8000-000000000102'
const CHALLENGE_ID = '00000000-0000-4000-8000-000000000101'

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
    lastWeekRankingPosition: null,
  })

  return [
    { method: 'GET', path: '/auth/account', status: 200, body: account },
    { method: 'GET', path: `/profile/users/id/${USER_ID}`, status: 200, body: user },
    {
      method: 'GET',
      path: `/challenging/challenges/${CHALLENGE_ID}/vote`,
      status: 200,
      body: { challengeVote: 'none' },
    },
  ]
}

async function registerScenario(page: Page, challenging: ChallengingFixture) {
  await challenging.authenticate('assistant-history-test-token')

  await ServerMock(page).register([
    ...createAuthenticatedRoutes(),
    {
      method: 'GET',
      path: `/challenging/challenges/slug/${CHALLENGE_SLUG}`,
      status: 200,
      body: ChallengesFaker.fakeDto({
        id: CHALLENGE_ID,
        slug: CHALLENGE_SLUG,
        title: 'Soma complementar',
        isPublic: true,
        starId: null,
      }),
    },
    {
      method: 'GET',
      path: `/challenging/challenges/slug/${CHALLENGE_SLUG}/navigation`,
      status: 200,
      body: { previousChallengeSlug: null, nextChallengeSlug: null },
    },
    {
      method: 'GET',
      path: '/conversation/chats',
      query: { search: '', page: '1', itemsPerPage: '10' },
      status: 200,
      body: [],
      headers: {
        'X-Pagination-Response': 'true',
        'X-Total-Items-Count': '0',
        'X-Items-Per-Page': '10',
        'X-Page': '1',
      },
    },
    {
      method: 'GET',
      path: '/manual/guides',
      status: 200,
      body: [],
    },
    {
      method: 'GET',
      path: `/challenging/challenges/${CHALLENGE_ID}/code-executions/errors-count`,
      status: 200,
      body: { errorsCount: 0 },
    },
  ])
}

function isChatsRequest(request: Request) {
  return (
    request.method() === 'GET' &&
    new URL(request.url()).pathname === `${TEST_SERVER_ROUTE}/conversation/chats`
  )
}

test.describe(CHALLENGE_ROUTE, () => {
  test('loads the authenticated assistant history with valid pagination params', async ({
    page,
    challenging,
  }) => {
    await registerScenario(page, challenging)

    const chatsRequestPromise = page.waitForRequest(isChatsRequest)
    const chatsResponsePromise = page.waitForResponse(
      (response) => isChatsRequest(response.request()) && response.status() === 200,
    )

    await page.goto(CHALLENGE_ROUTE)

    const [chatsRequest, chatsResponse] = await Promise.all([
      chatsRequestPromise,
      chatsResponsePromise,
    ])
    const chatsUrl = new URL(chatsRequest.url())

    expect(chatsUrl.searchParams.get('search')).toBe('')
    expect(chatsUrl.searchParams.get('page')).toBe('1')
    expect(chatsUrl.searchParams.get('itemsPerPage')).toBe('10')
    expect(chatsResponse.status()).toBe(200)
    expect(chatsResponse.headers()['x-pagination-response']).toBe('true')

    await expect(page.getByText('Soma complementar', { exact: true })).toBeVisible()
    await expect(
      page.getByRole('status').filter({ hasText: /items por página|itemsPerPage|page/i }),
    ).toHaveCount(0)
  })
})
