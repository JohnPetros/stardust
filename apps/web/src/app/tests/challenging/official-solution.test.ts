import {
  expect,
  test,
  type BrowserContext,
  type Page,
  type Request,
} from '@playwright/test'

import { AccountsFaker } from '../../../../../../packages/core/src/auth/domain/entities/fakers/AccountsFaker'
import { ChallengesFaker } from '../../../../../../packages/core/src/challenging/domain/entities/fakers/ChallengesFaker'
import { CodePlaybacksFaker } from '../../../../../../packages/core/src/global/domain/structures/fakers/CodePlaybacksFaker'
import { UsersFaker } from '../../../../../../packages/core/src/profile/domain/entities/fakers/UsersFaker'
import { ServerMock } from '../shared/mocks/ServerMock'
import type { ServerMockRoute } from '../shared/types/ServerMockRoute'

const CHALLENGE_ID = '00000000-0000-4000-8000-000000000101'
const BLOCKED_CHALLENGE_ID = '00000000-0000-4000-8000-000000000104'
const USER_ID = '00000000-0000-4000-8000-000000000102'
const CHALLENGE_SLUG = 'soma-complementar'
const CHALLENGE_ROUTE = `/challenging/challenges/${CHALLENGE_SLUG}/challenge`
const SOLUTIONS_ROUTE = `${CHALLENGE_ROUTE}/solutions`
const OFFICIAL_SOLUTION_ROUTE = `${SOLUTIONS_ROUTE}/official`
const TEST_SERVER_ROUTE = '/api/tests/server'

const officialSolution = CodePlaybacksFaker.fakeDto({
  code: Array.from(
    { length: 30 },
    (_, index) => `var linha${index + 1} = ${index + 1}`,
  ).join('\n'),
  input: {
    content: `nums = [${Array.from({ length: 32 }, (_, index) => index + 1).join(
      ', ',
    )}]\nalvo = 31`,
    overflow: 'scroll',
  },
  steps: [
    {
      activeLineRanges: [
        { startLine: 2, endLine: 3 },
        { startLine: 25, endLine: 26 },
      ],
      explanation: 'Prepara o mapa de complementos.',
      panels: [
        {
          type: 'sequence',
          title: 'NÚMEROS',
          kind: 'array',
          items: Array.from({ length: 18 }, (_, index) => index + 1),
          showIndices: true,
          pointers: [{ label: 'i', index: 0 }],
          highlights: [{ startIndex: 0, endIndex: 1, state: 'active' }],
          overflow: 'scroll',
        },
        {
          type: 'scalar',
          title: 'ALVO',
          value: 31,
          state: 'active',
        },
      ],
    },
    {
      activeLineRanges: [{ startLine: 12, endLine: 13 }],
      explanation: 'Registra o primeiro complemento no mapa.',
      panels: [
        {
          type: 'map',
          title: 'COMPLEMENTOS',
          entries: [{ key: '30', value: 0, state: 'visited' }],
        },
      ],
    },
    {
      activeLineRanges: [{ startLine: 29, endLine: 30 }],
      explanation: 'Encontra e devolve os índices esperados.',
      panels: [
        {
          type: 'result',
          title: 'RESULTADO',
          value: [0, 29],
          status: 'success',
          overflow: 'scroll',
        },
      ],
    },
  ],
})

type Scenario = {
  isAuthenticated: boolean
  hasSolutionsAccess?: boolean
  hasOfficialSolution?: boolean
}

function createChallenge(hasOfficialSolution: boolean, challengeId = CHALLENGE_ID) {
  return ChallengesFaker.fakeDto({
    id: challengeId,
    slug: CHALLENGE_SLUG,
    title: 'Soma complementar',
    isPublic: true,
    starId: null,
    author: {
      id: '00000000-0000-4000-8000-000000000103',
      entity: {
        name: 'Equipe Stardust',
        slug: 'equipe-stardust',
        avatar: {
          name: 'Apollo',
          image: '/images/avatar.png',
        },
      },
    },
    officialSolution: hasOfficialSolution ? officialSolution : null,
  })
}

function createAuthenticatedRoutes(
  hasSolutionsAccess: boolean,
  challengeId: string,
): ServerMockRoute[] {
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
    completedChallengesIds: hasSolutionsAccess ? [challengeId] : [],
    lastWeekRankingPosition: null,
  })

  return [
    { method: 'GET', path: '/auth/account', status: 200, body: account },
    {
      method: 'GET',
      path: `/profile/users/id/${USER_ID}`,
      status: 200,
      body: user,
    },
    {
      method: 'GET',
      path: `/challenging/challenges/${challengeId}/vote`,
      status: 200,
      body: { challengeVote: 'none' },
    },
  ]
}

function createScenarioRoutes({
  isAuthenticated,
  hasSolutionsAccess = false,
  hasOfficialSolution = true,
}: Scenario): ServerMockRoute[] {
  const challengeId = hasSolutionsAccess ? CHALLENGE_ID : BLOCKED_CHALLENGE_ID

  return [
    ...(isAuthenticated
      ? createAuthenticatedRoutes(hasSolutionsAccess, challengeId)
      : [
          {
            method: 'GET' as const,
            path: '/auth/account',
            status: 401,
            body: { title: 'Unauthorized', message: 'Não autorizado.' },
          },
          {
            method: 'GET' as const,
            path: `/profile/users/id/${USER_ID}`,
            status: 200,
            body: UsersFaker.fakeDto({
              id: USER_ID,
              name: 'Visitante de testes',
              email: 'visitante@stardust.dev',
              slug: 'visitante-de-testes',
              completedChallengesIds: [],
              lastWeekRankingPosition: null,
            }),
          },
        ]),
    {
      method: 'GET',
      path: `/challenging/challenges/slug/${CHALLENGE_SLUG}`,
      status: 200,
      body: createChallenge(hasOfficialSolution, challengeId),
    },
    {
      method: 'GET',
      path: `/challenging/challenges/slug/${CHALLENGE_SLUG}/navigation`,
      status: 200,
      body: { previousChallengeSlug: null, nextChallengeSlug: null },
    },
    {
      method: 'GET',
      path: '/challenging/solutions',
      status: 200,
      body: [],
      headers: {
        'X-Pagination-Response': 'true',
        'X-Total-Items-Count': '0',
        'X-Items-Per-Page': '15',
        'X-Page': '1',
      },
    },
  ]
}

async function registerScenario(page: Page, context: BrowserContext, scenario: Scenario) {
  await context.clearCookies()

  if (scenario.isAuthenticated) {
    await context.addCookies([
      {
        name: '@stardust:access-token',
        value: `official-solution-token-${scenario.hasSolutionsAccess ? 'allowed' : 'blocked'}`,
        domain: '127.0.0.1',
        path: '/',
      },
    ])
  }

  await ServerMock(page).register(createScenarioRoutes(scenario))
}

function isSolutionsRequest(request: Request) {
  return (
    request.method() === 'GET' &&
    request.url().includes(`${TEST_SERVER_ROUTE}/challenging/solutions`)
  )
}

async function waitForChallengeTransition(page: Page) {
  await expect(page.getByTestId('page transition')).toHaveCount(0, {
    timeout: 15000,
  })
}

function getContentPanel(page: Page) {
  return page.getByRole('region', { name: 'Painel Conteúdo' })
}

test.describe(OFFICIAL_SOLUTION_ROUTE, () => {
  test.setTimeout(90000)

  test.afterEach(async ({ page }) => {
    await ServerMock(page).reset()
  })

  test('navigates from the solutions list and keeps the official playback in the Solutions tab', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context, {
      isAuthenticated: true,
      hasSolutionsAccess: true,
    })

    const observedServerRequests: string[] = []
    page.on('request', (request) => {
      if (request.url().includes(TEST_SERVER_ROUTE)) {
        observedServerRequests.push(request.url())
      }
    })
    const solutionsRequestPromise = page.waitForRequest(isSolutionsRequest)

    await page.goto(SOLUTIONS_ROUTE)
    await solutionsRequestPromise
    await waitForChallengeTransition(page)

    const contentPanel = getContentPanel(page)
    const officialCard = contentPanel.getByTestId('official-solution-card')
    await expect(officialCard).toBeVisible()
    const officialLink = officialCard.getByRole('link', {
      name: 'Abrir solução oficial do desafio',
    })
    await expect(officialLink).toHaveAttribute('href', OFFICIAL_SOLUTION_ROUTE)
    await Promise.all([page.waitForURL(OFFICIAL_SOLUTION_ROUTE), officialLink.click()])

    await waitForChallengeTransition(page)
    const officialContentPanel = getContentPanel(page)
    const playback = officialContentPanel.getByTestId('code-playback')
    await expect(playback).toBeVisible()
    await expect(
      officialContentPanel.getByRole('tab', { name: 'Soluções', exact: true }),
    ).toHaveAttribute('data-state', 'active')
    await expect(
      officialContentPanel.getByRole('link', { name: 'Ver todas as soluções' }),
    ).toHaveAttribute('href', SOLUTIONS_ROUTE)

    await expect(playback.getByTestId('previous-step')).toBeDisabled()
    await expect(playback.getByTestId('next-step')).toBeEnabled()
    await expect(playback.getByTestId('step-position')).toHaveText('Etapa 1 de 3')
    await expect(
      playback.getByTestId('code-playback-editor').locator('.code-editor-active-line'),
    ).toHaveCount(2, { timeout: 15000 })

    const requestsBeforePlayback = observedServerRequests.length

    await playback.getByTestId('next-step').click()
    await expect(playback.getByTestId('step-position')).toHaveText('Etapa 2 de 3')
    await expect(playback.getByTestId('code-playback-explanation')).toContainText(
      'Registra o primeiro complemento',
    )
    await expect(playback.getByTestId('code-playback-panel-map')).toBeVisible()

    await playback.getByTestId('play-pause').click()
    await expect(playback.getByTestId('play-pause')).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await playback.getByTestId('play-pause').click()
    await playback.getByTestId('speed').selectOption('2x')
    await expect(playback.getByTestId('speed')).toHaveValue('2x')

    await playback.getByTestId('toggle-expanded').click()
    const expandedPlayback = page.getByRole('dialog', { name: 'Code Playback' })
    await expect(expandedPlayback).toBeVisible()
    await expect(expandedPlayback.getByTestId('code-playback-layout')).toHaveAttribute(
      'data-layout-direction',
      'responsive-split',
    )
    await page.keyboard.press('Escape')
    await expect(expandedPlayback).toHaveCount(0)

    expect(observedServerRequests.length).toBe(requestsBeforePlayback)
  })

  test('renders the empty state and omits the official card without an official solution', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context, {
      isAuthenticated: true,
      hasSolutionsAccess: true,
      hasOfficialSolution: false,
    })
    const solutionsRequestPromise = page.waitForRequest(isSolutionsRequest)

    await page.goto(SOLUTIONS_ROUTE)
    await solutionsRequestPromise
    await waitForChallengeTransition(page)
    await expect(getContentPanel(page).getByTestId('official-solution-card')).toHaveCount(
      0,
    )

    await page.goto(OFFICIAL_SOLUTION_ROUTE)
    await waitForChallengeTransition(page)

    const officialContentPanel = getContentPanel(page)
    await expect(
      officialContentPanel.getByTestId('official-solution-empty'),
    ).toContainText('Solução oficial indisponível')
    await expect(officialContentPanel.getByTestId('code-playback')).toHaveCount(0)
    await expect(
      officialContentPanel.getByRole('link', { name: 'Ver todas as soluções' }),
    ).toHaveAttribute('href', SOLUTIONS_ROUTE)
  })

  test('does not expose the playback to a visitor', async ({ page, context }) => {
    await registerScenario(page, context, {
      isAuthenticated: false,
      hasOfficialSolution: true,
    })

    await page.goto(OFFICIAL_SOLUTION_ROUTE)
    await waitForChallengeTransition(page)

    await expect(
      page.getByText('Ei, você ainda não completou esse desafio!').first(),
    ).toBeVisible()
    await expect(page.getByTestId('code-playback')).toHaveCount(0)
    await expect(
      page.getByText('Tente resolver esse desafio antes de ver essa solução.').first(),
    ).toBeVisible()
  })

  test('does not expose the playback to an authenticated blocked user', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context, {
      isAuthenticated: true,
      hasSolutionsAccess: false,
      hasOfficialSolution: true,
    })

    await page.goto(OFFICIAL_SOLUTION_ROUTE)
    await waitForChallengeTransition(page)

    await expect(
      page.getByText('Ei, você ainda não completou esse desafio!').first(),
    ).toBeVisible()
    await expect(page.getByTestId('code-playback')).toHaveCount(0)
  })

  test('keeps expanded content scrollable and non-overlapping in a narrow viewport', async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await registerScenario(page, context, {
      isAuthenticated: true,
      hasSolutionsAccess: true,
      hasOfficialSolution: true,
    })

    await page.goto(OFFICIAL_SOLUTION_ROUTE)
    await waitForChallengeTransition(page)
    await page.getByTestId('toggle-expanded').click()

    const playback = page.getByRole('dialog', { name: 'Code Playback' })
    const controls = page.getByTestId('code-playback-controls')
    const layout = page.getByTestId('code-playback-layout')
    const stateColumn = layout.locator('[data-slot="state-column"]')
    const codeColumn = page.getByTestId('code-playback-editor')

    await expect(playback).toBeVisible()
    await expect(page.getByTestId('code-playback-input')).toHaveAttribute(
      'data-overflow',
      'scroll',
    )
    await expect(layout).toHaveAttribute('data-layout-direction', 'responsive-split')

    const [controlsBox, layoutBox, stateBox, codeBox] = await Promise.all([
      controls.boundingBox(),
      layout.boundingBox(),
      stateColumn.boundingBox(),
      codeColumn.boundingBox(),
    ])

    expect(controlsBox).not.toBeNull()
    expect(layoutBox).not.toBeNull()
    expect(stateBox).not.toBeNull()
    expect(codeBox).not.toBeNull()
    expect((controlsBox?.y ?? 0) + (controlsBox?.height ?? 0)).toBeLessThanOrEqual(
      (layoutBox?.y ?? 0) + 1,
    )
    expect((stateBox?.y ?? 0) + (stateBox?.height ?? 0)).toBeLessThanOrEqual(
      (codeBox?.y ?? 0) + 1,
    )

    const hasInternalOverflow = await layout.evaluate(
      (element) => element.scrollHeight > element.clientHeight,
    )
    expect(hasInternalOverflow).toBe(true)

    await page.keyboard.press('Tab')
    await page.keyboard.press('Escape')
    await expect(playback).toHaveCount(0)
  })
})
