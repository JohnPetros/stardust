import { expect, test, type BrowserContext, type Page } from '@playwright/test'

import type { AccountDto } from '../../../../../../packages/core/src/auth/domain/entities/dtos'
import type { UserDto } from '../../../../../../packages/core/src/profile/domain/entities/dtos'
import { AccountsFaker } from '../../../../../../packages/core/src/auth/domain/entities/fakers/AccountsFaker'
import { ChallengesFaker } from '../../../../../../packages/core/src/challenging/domain/entities/fakers/ChallengesFaker'
import { SolutionsFaker } from '../../../../../../packages/core/src/challenging/domain/entities/fakers/SolutionsFaker'
import { AuthorsFakers } from '../../../../../../packages/core/src/global/domain/entities/fakers/AuthorsFakers'
import { UsersFaker } from '../../../../../../packages/core/src/profile/domain/entities/fakers/UsersFaker'
import { ServerMock } from '../shared/mocks/ServerMock'
import type { ServerMockRoute } from '../shared/types/ServerMockRoute'

const VISITOR_ID = '00000000-0000-4000-8000-000000000401'
const PROFILE_ID = '00000000-0000-4000-8000-000000000402'
const ACHIEVEMENT_ID = '00000000-0000-4000-8000-000000000403'
const CHALLENGE_ID = '00000000-0000-4000-8000-000000000404'
const SOLUTION_ID = '00000000-0000-4000-8000-000000000405'

const VISITOR_SLUG = 'visitante-estelar'
const PROFILE_SLUG = 'criador-estelar'

function createAccountDto(): AccountDto {
  return AccountsFaker.fakeDto({
    id: VISITOR_ID,
    name: 'Visitante Estelar',
    email: 'visitante.estelar@stardust.dev',
    isAuthenticated: true,
  })
}

function createProfileDto(overrides: Partial<UserDto> = {}): UserDto {
  return UsersFaker.fakeDto({
    id: PROFILE_ID,
    name: 'Criador Estelar',
    email: 'criador.estelar@stardust.dev',
    slug: PROFILE_SLUG,
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

function createPaginationHeaders(totalItemsCount: number, itemsPerPage: number) {
  return {
    'X-Pagination-Response': 'true',
    'X-Total-Items-Count': String(totalItemsCount),
    'X-Items-Per-Page': String(itemsPerPage),
    'X-Page': '1',
  }
}

function createProfileRoutes(account: AccountDto, profile: UserDto): ServerMockRoute[] {
  const profileId = profile.id as string
  const author = { id: profileId, entity: AuthorsFakers.fakeDto({ name: profile.name }) }
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
      body: { ...profile, id: VISITOR_ID, slug: VISITOR_SLUG, name: account.name },
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
    {
      method: 'GET',
      path: '/profile/achievements',
      status: 200,
      body: [],
    },
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
      headers: createPaginationHeaders(1, 10),
    },
    {
      method: 'GET',
      path: '/challenging/solutions',
      status: 200,
      body: [solution],
      headers: createPaginationHeaders(1, 30),
    },
  ]
}

async function registerProfileScenario(
  page: Page,
  context: BrowserContext,
  profileOverrides: Partial<UserDto> = {},
) {
  const account = createAccountDto()
  const profile = createProfileDto(profileOverrides)

  await context.clearCookies()
  await context.addCookies([
    {
      name: '@stardust:access-token',
      value: 'profile-page-test-token',
      domain: '127.0.0.1',
      path: '/',
    },
  ])
  await ServerMock(page).registerSuccessDefaults(createProfileRoutes(account, profile))

  return { account, profile }
}

test.describe('/profile/[userSlug]', () => {
  test.afterEach(async ({ page }) => {
    await ServerMock(page).reset()
  })

  test('renders the profile summary, progress indicators and created challenges', async ({
    page,
    context,
  }) => {
    const { profile } = await registerProfileScenario(page, context, {
      id: VISITOR_ID,
      slug: VISITOR_SLUG,
      name: 'Visitante Estelar',
    })

    await page.goto(`/profile/${VISITOR_SLUG}`)

    await expect(
      page.getByRole('main').getByText('Visitante Estelar', { exact: true }).first(),
    ).toBeVisible()
    await expect(page.getByText('Nível 7 - 420 xp', { exact: true })).toBeVisible()
    await expect(page.getByText('Estrelas completadas', { exact: true })).toBeVisible()
    await expect(page.getByText('Planetas concluídos', { exact: true })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Conquistas adquiridas', exact: true }),
    ).toBeVisible()
    await expect(page.getByText('Desafios concluídos', { exact: true })).toBeVisible()
    await expect(page.getByText('Primeira conquista', { exact: true })).toBeVisible()
    await expect(page.getByText('Desafio estelar', { exact: true })).toBeVisible()
    await expect(
      page.locator(`a[href="/profile/${VISITOR_SLUG}/settings"]`),
    ).toBeVisible()
    await expect(
      page.locator(`a[href="/profile/${VISITOR_SLUG}/api-keys"]`),
    ).toBeVisible()
    await expect(page.locator('a[href="/playground/snippets"]')).toBeVisible()

    await page.getByRole('tab', { name: 'Soluções' }).click()
    await expect(page.getByText('Solução estelar', { exact: true })).toBeVisible()

    expect(profile.id).toBe(VISITOR_ID)
  })

  test('hides owner-only actions when viewing another user profile', async ({
    page,
    context,
  }) => {
    await registerProfileScenario(page, context)

    await page.goto(`/profile/${PROFILE_SLUG}`)

    await expect(page.getByText('Criador Estelar', { exact: true })).toBeVisible()
    await expect(page.locator(`a[href="/profile/${VISITOR_SLUG}/settings"]`)).toHaveCount(
      0,
    )
    await expect(page.locator(`a[href="/profile/${VISITOR_SLUG}/api-keys"]`)).toHaveCount(
      0,
    )
    await expect(page.locator('a[href="/playground/snippets"]')).toHaveCount(0)
  })

  test('navigates from the own profile to settings and API keys', async ({
    page,
    context,
  }) => {
    await registerProfileScenario(page, context, {
      id: VISITOR_ID,
      slug: VISITOR_SLUG,
      name: 'Visitante Estelar',
    })

    await page.goto(`/profile/${VISITOR_SLUG}`)

    await Promise.all([
      page.waitForURL(`**/profile/${VISITOR_SLUG}/settings`),
      page.locator(`a[href="/profile/${VISITOR_SLUG}/settings"]`).click(),
    ])

    await page.goto(`/profile/${VISITOR_SLUG}`)
    await Promise.all([
      page.waitForURL(`**/profile/${VISITOR_SLUG}/api-keys`),
      page.locator(`a[href="/profile/${VISITOR_SLUG}/api-keys"]`).click(),
    ])
  })

  test('navigates to the profile from the protected space and redirects guests to sign-in', async ({
    page,
    context,
  }) => {
    await registerProfileScenario(page, context, {
      id: VISITOR_ID,
      slug: VISITOR_SLUG,
      name: 'Visitante Estelar',
    })

    await page.goto('/space')
    const profileLink = page.getByRole('link', { name: 'Perfil' }).first()
    await expect(profileLink).toHaveAttribute('href', `/profile/${VISITOR_SLUG}`)

    await Promise.all([
      page.waitForURL(`**/profile/${VISITOR_SLUG}`),
      profileLink.click(),
    ])
    await expect(page.getByText('Primeira conquista', { exact: true })).toBeVisible()

    await context.clearCookies()
    await ServerMock(page).register([
      {
        method: 'GET',
        path: '/auth/account',
        status: 401,
        body: { title: 'Unauthorized', message: 'Não autorizado.' },
      },
    ])

    await page.goto(`/profile/${VISITOR_SLUG}`)

    await expect(page).toHaveURL(
      new RegExp(`/auth/sign-in\\?nextRoute=%2Fprofile%2F${VISITOR_SLUG}$`),
    )
    await expect(page.getByTestId('email-input')).toBeVisible()
  })
})
