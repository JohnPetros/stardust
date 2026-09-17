import { expect, test, type Page, type Request } from '@playwright/test'

import { ChallengeCategoriesFaker } from '../../../../../../../packages/core/src/challenging/domain/entities/fakers/ChallengeCategoriesFaker'
import { ChallengesFaker } from '../../../../../../../packages/core/src/challenging/domain/entities/fakers/ChallengesFaker'
import { ServerMock } from '../../../tests/shared/mocks/ServerMock'
import type { ServerMockRoute } from '../../../tests/shared/types/ServerMockRoute'

const ROADMAP_ROUTE = '/challenging/roadmap'
const TEST_SERVER_ROUTE = '/api/tests/server'
const CATEGORY_ID = '00000000-0000-4000-8000-000000000701'
const FIRST_CHALLENGE_ID = '00000000-0000-4000-8000-000000000702'
const SECOND_CHALLENGE_ID = '00000000-0000-4000-8000-000000000703'

const category = ChallengeCategoriesFaker.fakeDto({
  id: CATEGORY_ID,
  name: 'Básico',
})

const firstChallenge = ChallengesFaker.fakeDto({
  id: FIRST_CHALLENGE_ID,
  slug: 'soma-complementar',
  title: 'Soma complementar',
  difficultyLevel: 'easy',
  categories: [category],
  isPublic: true,
  starId: null,
})

const secondChallenge = ChallengesFaker.fakeDto({
  id: SECOND_CHALLENGE_ID,
  slug: 'pedido-de-ajuda',
  title: 'Pedido de ajuda',
  difficultyLevel: 'hard',
  categories: [category],
  isPublic: true,
  starId: null,
})

const roadmap = {
  revision: {
    key: 'challenge-roadmap-v1',
    version: 1,
    publishedAt: '2026-09-16T00:00:00.000Z',
  },
  nodes: [
    {
      key: 'basico',
      category,
      position: { x: 0, y: 0 },
      recommendationOrder: 1,
      state: 'content' as const,
      challengeIds: [FIRST_CHALLENGE_ID, SECOND_CHALLENGE_ID],
      totalChallenges: 2,
      completedChallenges: null,
      isCompleted: null,
      isEligible: null,
    },
  ],
  edges: [],
  progress: null,
  recommendation: null,
}

const roadmapNodeChallenges = {
  nodeKey: 'basico',
  challenges: [
    { ...firstChallenge, order: 1, isCompleted: null },
    { ...secondChallenge, order: 2, isCompleted: null },
  ],
}

function isRoadmapRequest(request: Request) {
  return (
    request.method() === 'GET' &&
    new URL(request.url()).pathname === `${TEST_SERVER_ROUTE}${ROADMAP_ROUTE}`
  )
}

function isNodeChallengesRequest(request: Request) {
  return (
    request.method() === 'GET' &&
    new URL(request.url()).pathname ===
      `${TEST_SERVER_ROUTE}/challenging/roadmap/nodes/basico/challenges`
  )
}

function createRoutes(): ServerMockRoute[] {
  return [
    { method: 'GET', path: ROADMAP_ROUTE, status: 200, body: roadmap },
    {
      method: 'GET',
      path: '/challenging/roadmap/nodes/basico/challenges',
      status: 200,
      body: roadmapNodeChallenges,
    },
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
      body: [firstChallenge],
      headers: {
        'X-Pagination-Response': 'true',
        'X-Total-Items-Count': '1',
        'X-Items-Per-Page': '20',
        'X-Page': '1',
      },
    },
  ]
}

async function registerScenario(page: Page, routes = createRoutes()) {
  await ServerMock(page).registerSuccessDefaults(routes)
}

test.describe(ROADMAP_ROUTE, () => {
  test.afterEach(async ({ page }) => {
    await ServerMock(page).reset()
  })

  test('renders the public snapshot and switches to the linear challenge list', async ({
    page,
  }) => {
    await registerScenario(page)

    await page.goto(ROADMAP_ROUTE)

    await expect(page.getByRole('heading', { name: 'Roadmap de desafios' })).toBeVisible()
    await expect(
      page.getByRole('region', { name: 'Mapa visual do roadmap' }),
    ).toBeVisible()
    await expect(page.getByRole('progressbar')).toHaveCount(0)
    await expect(page.getByText('2 desafios editoriais')).toBeVisible()
    await expect(
      page.getByText('Entre para acompanhar seu progresso e receber recomendações.'),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'Roadmap' })).toHaveAttribute(
      'aria-current',
      'page',
    )

    await page.getByRole('link', { name: 'Todos os desafios' }).click()
    await expect(page).toHaveURL(/\/challenging\/challenges$/)
    await expect(page.getByText('Soma complementar', { exact: true })).toBeVisible()
  })

  test('opens a node, filters its challenges and preserves the roadmap origin', async ({
    page,
  }) => {
    await registerScenario(page)

    const nodeResponse = page.waitForResponse(
      (response) =>
        isNodeChallengesRequest(response.request()) && response.status() === 200,
    )
    await page.goto(`${ROADMAP_ROUTE}?node=basico`)
    await nodeResponse

    await expect(page.getByRole('dialog', { name: 'Básico' })).toBeVisible()
    await expect(page.getByRole('list', { name: 'Desafios da categoria' })).toBeVisible()
    await expect(page.getByText('Soma complementar', { exact: true })).toBeVisible()
    await expect(page.getByText('Pedido de ajuda', { exact: true })).toBeVisible()

    await page.getByLabel('Buscar desafio').fill('soma')
    await expect(page.getByText('Soma complementar', { exact: true })).toBeVisible()
    await expect(page.getByText('Pedido de ajuda', { exact: true })).toBeHidden()

    await page.getByLabel('Buscar desafio').fill('')
    await page.getByLabel('Dificuldade').selectOption('hard')
    await expect(page.getByText('Pedido de ajuda', { exact: true })).toBeVisible()
    await expect(page.getByText('Soma complementar', { exact: true })).toBeHidden()

    const challengeLink = page.getByRole('link', {
      name: 'Abrir Pedido de ajuda',
    })
    await expect(challengeLink).toHaveAttribute(
      'href',
      '/challenging/challenges/pedido-de-ajuda/challenge?from=roadmap&node=basico',
    )

    await page.getByRole('dialog').getByRole('button', { name: 'Fechar drawer' }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page).toHaveURL(ROADMAP_ROUTE)
  })

  test('clears an invalid node query and retries a failed snapshot', async ({ page }) => {
    await registerScenario(page)
    await page.goto(`${ROADMAP_ROUTE}?node=does-not-exist`)
    await expect(page).toHaveURL(ROADMAP_ROUTE)
    await expect(page.getByRole('dialog')).toHaveCount(0)

    await ServerMock(page).registerSuccessDefaults([
      {
        method: 'GET',
        path: ROADMAP_ROUTE,
        status: 500,
        body: { title: 'Erro', message: 'offline' },
      },
    ])
    await page.reload()
    await expect(page.getByRole('alert')).toBeVisible()

    await ServerMock(page).registerSuccessDefaults(createRoutes())
    const retryResponse = page.waitForResponse(
      (response) => isRoadmapRequest(response.request()) && response.status() === 200,
    )
    await page.getByRole('button', { name: 'Tentar novamente' }).click()
    await retryResponse
    await expect(page.getByRole('heading', { name: 'Roadmap de desafios' })).toBeVisible()
  })

  test('returns from a contextual public challenge to its roadmap node', async ({
    page,
  }) => {
    await registerScenario(page, [
      ...createRoutes(),
      {
        method: 'GET',
        path: '/challenging/challenges/slug/soma-complementar',
        status: 200,
        body: firstChallenge,
      },
      {
        method: 'GET',
        path: '/challenging/challenges/slug/soma-complementar/navigation',
        status: 200,
        body: { previousChallengeSlug: null, nextChallengeSlug: null },
      },
    ])
    await page.goto(`${ROADMAP_ROUTE}?node=basico`)
    await expect(page.getByRole('dialog', { name: 'Básico' })).toBeVisible()

    await page.getByRole('link', { name: 'Soma complementar', exact: true }).click()
    await expect(page).toHaveURL(
      /\/challenging\/challenges\/soma-complementar\/challenge\?from=roadmap&node=basico/,
    )
    await expect(page.getByRole('heading', { name: 'Soma complementar' })).toBeVisible()

    await page.getByRole('button', { name: 'Voltar ao roadmap' }).click()
    await page.getByRole('button', { name: 'Sair', exact: true }).click()
    await expect(page).toHaveURL(`${ROADMAP_ROUTE}?node=basico`)
  })
})
