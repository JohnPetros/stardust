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
const COMPLETED_STAR_ID = '00000000-0000-4000-8000-000000000303'
const AVAILABLE_STAR_ID = '00000000-0000-4000-8000-000000000304'
const LOCKED_STAR_ID = '00000000-0000-4000-8000-000000000305'
const LAST_STAR_ID = '00000000-0000-4000-8000-000000000306'
const GALAXY_ID = '00000000-0000-4000-8000-000000000307'
const SECOND_PLANET_ID = '00000000-0000-4000-8000-000000000308'
const SECOND_PLANET_STAR_ID = '00000000-0000-4000-8000-000000000309'
const GALAXY_SLUG = 'logica-de-programacao'
const GALAXY_NAME = 'Lógica de Programação'
const GALAXY_ROUTE = new RegExp(`/space/${GALAXY_SLUG}$`)
const PLANET_NAME = 'Planeta de testes'
const SECOND_PLANET_NAME = 'Segundo planeta'
const CHALLENGE_ERROR = 'Não foi possível abrir o desafio. Tente de novo.'

const STAR_NAMES = {
  completed: 'Primeira estrela',
  available: 'Estrela disponível',
  locked: 'Estrela bloqueada',
  last: 'Última estrela',
}

type Facts = { completed: string[]; opened: string[] }

type SpaceOptions = {
  facts?: Facts
  hasCompletedSpace?: boolean
  availableStarIsChallenge?: boolean
  fillerPlanetsCount?: number
  planetsRoute?: { status: number; body: unknown }
  noPlanets?: boolean
}

const DEFAULT_FACTS: Facts = {
  completed: [COMPLETED_STAR_ID],
  opened: [PLANET_ID],
}

const ALL_FACTS: Facts = {
  completed: [
    COMPLETED_STAR_ID,
    AVAILABLE_STAR_ID,
    LOCKED_STAR_ID,
    LAST_STAR_ID,
    SECOND_PLANET_STAR_ID,
  ],
  opened: [PLANET_ID, SECOND_PLANET_ID],
}

function createSpaceFakes(options: SpaceOptions = {}) {
  const facts = options.facts ?? DEFAULT_FACTS
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
    completedStarsIds: facts.completed,
    openedPlanetsIds: facts.opened,
    hasCompletedSpace: options.hasCompletedSpace ?? false,
    lastWeekRankingPosition: null,
  })
  const completedStar = StarsFaker.fakeDto({
    id: COMPLETED_STAR_ID,
    name: STAR_NAMES.completed,
    number: 1,
    slug: 'primeira-estrela',
    isChallenge: false,
    description: 'Estrela de história sobre a primeira estrela.',
  })
  const availableStar = StarsFaker.fakeDto({
    id: AVAILABLE_STAR_ID,
    name: STAR_NAMES.available,
    number: 2,
    slug: 'estrela-disponivel',
    isChallenge: options.availableStarIsChallenge ?? false,
  })
  const lockedStar = StarsFaker.fakeDto({
    id: LOCKED_STAR_ID,
    name: STAR_NAMES.locked,
    number: 3,
    slug: 'estrela-bloqueada',
    isChallenge: false,
  })
  const lastStar = StarsFaker.fakeDto({
    id: LAST_STAR_ID,
    name: STAR_NAMES.last,
    number: 4,
    slug: 'ultima-estrela',
    isChallenge: false,
  })
  const planet = PlanetsFaker.fakeDto({
    id: PLANET_ID,
    name: PLANET_NAME,
    concept: 'Introdução',
    position: 1,
    image: 'planet-image.png',
    stars: [completedStar, availableStar, lockedStar, lastStar],
  })
  const secondPlanet = PlanetsFaker.fakeDto({
    id: SECOND_PLANET_ID,
    name: SECOND_PLANET_NAME,
    position: 2,
    image: 'planet-image.png',
    stars: [StarsFaker.fakeDto({ id: SECOND_PLANET_STAR_ID, number: 1 })],
  })
  const fillerPlanets = Array.from(
    { length: options.fillerPlanetsCount ?? 0 },
    (_, index) =>
      PlanetsFaker.fakeDto({
        position: index + 3,
        image: 'planet-image.png',
        stars: [StarsFaker.fakeDto({ number: 1 }), StarsFaker.fakeDto({ number: 2 })],
      }),
  )
  const planets = options.noPlanets ? [] : [planet, secondPlanet, ...fillerPlanets]

  return { account, user, planet, availableStar, planets }
}

function createAuthenticatedRoutes(
  fixtures: ReturnType<typeof createSpaceFakes>,
  options: SpaceOptions = {},
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
    {
      method: 'GET',
      path: '/space/galaxies/current',
      status: 200,
      body: {
        galaxy: { id: GALAXY_ID, slug: GALAXY_SLUG, name: GALAXY_NAME },
        isFirstGalaxy: true,
        hasGalaxyChoice: false,
      },
    },
    {
      method: 'GET',
      path: `/space/galaxies/${GALAXY_SLUG}/planets`,
      status: options.planetsRoute?.status ?? 200,
      body: options.planetsRoute?.body ?? fixtures.planets,
    },
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

function createLessonRoutes(star: { id?: string; slug?: string }): ServerMockRoute[] {
  return [
    { method: 'GET', path: `/space/stars/slug/${star.slug}`, status: 200, body: star },
    { method: 'GET', path: `/lesson/questions/star/${star.id}`, status: 200, body: [] },
    { method: 'GET', path: `/lesson/text-blocks/star/${star.id}`, status: 200, body: [] },
  ]
}

async function registerSpaceScenario(
  page: Page,
  context: BrowserContext,
  options: SpaceOptions = {},
  extraRoutes: ServerMockRoute[] = [],
) {
  const fixtures = createSpaceFakes(options)

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
  await ServerMock(page).register([
    ...createAuthenticatedRoutes(fixtures, options),
    ...extraRoutes,
  ])

  return fixtures
}

function starButton(page: Page, name: string) {
  return page.getByRole('button', { name: new RegExp(`Estrela \\d: ${name},`) })
}

test.describe('/space', () => {
  test.afterEach(async ({ page }) => {
    await ServerMock(page).reset()
  })

  test('renders the state of the planets and of each star without new content or rocket', async ({
    page,
    context,
  }) => {
    await registerSpaceScenario(page, context)

    await page.goto('/space')
    await expect(page).toHaveURL(GALAXY_ROUTE)

    await expect(page.getByText(PLANET_NAME, { exact: true })).toBeVisible()
    await expect(page.getByText('Aberto')).toBeVisible()
    await expect(page.getByText('1 de 4 estrelas concluídas')).toBeVisible()
    await expect(starButton(page, STAR_NAMES.completed)).toContainText('Concluída')
    await expect(starButton(page, STAR_NAMES.available)).toContainText('Disponível')
    await expect(starButton(page, STAR_NAMES.locked)).toHaveCount(0)
    await expect(
      page.getByRole('group', { name: new RegExp(STAR_NAMES.locked) }),
    ).toContainText('Conclua a estrela 2 para liberar')
    await expect(
      page.getByText(`Conclua ${PLANET_NAME} para liberar`).first(),
    ).toBeVisible()
    await expect(page.getByText('Conteúdo novo')).toHaveCount(0)
  })

  test('fills the details panel by hover and by focus and keeps the last star', async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await registerSpaceScenario(page, context)
    await page.goto('/space')

    const panel = page.getByRole('region', { name: 'Detalhes da estrela' })
    await expect(panel).toContainText(STAR_NAMES.available)

    await starButton(page, STAR_NAMES.completed).hover()
    await expect(panel).toContainText(STAR_NAMES.completed)
    await expect(panel.getByRole('button', { name: 'Revisar história' })).toBeVisible()

    await page.mouse.move(0, 0)
    await expect(panel).toContainText(STAR_NAMES.completed)

    await starButton(page, STAR_NAMES.available).focus()
    await expect(panel).toContainText(STAR_NAMES.available)
    await expect(panel.getByRole('button', { name: 'Começar história' })).toBeVisible()
    await expect(page).toHaveURL(GALAXY_ROUTE)
  })

  test('starts a story from the details panel', async ({ page, context }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    const fixtures = await registerSpaceScenario(page, context)
    await ServerMock(page).register([
      ...createAuthenticatedRoutes(fixtures),
      ...createLessonRoutes(fixtures.availableStar),
    ])
    await page.goto('/space')

    await starButton(page, STAR_NAMES.available).hover()
    const lessonNavigation = page.waitForURL(`**/lesson/${fixtures.availableStar.slug}`)
    await page.getByRole('button', { name: 'Começar história' }).click()

    await lessonNavigation
  })

  test('shows a toast and does not navigate when a challenge star has no challenge', async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    const fixtures = await registerSpaceScenario(page, context, {
      availableStarIsChallenge: true,
    })
    await ServerMock(page).register([
      ...createAuthenticatedRoutes(fixtures),
      {
        method: 'GET',
        path: `/challenging/challenges/star/${fixtures.availableStar.id}`,
        status: 404,
        body: { message: 'Challenge not found' },
      },
    ])
    await page.goto('/space')

    await starButton(page, STAR_NAMES.available).hover()
    await page.getByRole('button', { name: 'Começar desafio' }).click()

    await expect(page.getByText(CHALLENGE_ERROR)).toBeVisible()
    await expect(page).toHaveURL(GALAXY_ROUTE)
  })

  test('opens a liberated planet with a single request and makes its first star available', async ({
    page,
    context,
  }) => {
    const options = { facts: { completed: [], opened: [] } }
    const fixtures = await registerSpaceScenario(page, context, options)
    await page.goto('/space')

    const openButton = page.getByRole('button', { name: `Abrir planeta ${PLANET_NAME}` })
    await expect(openButton).toBeVisible()
    await expect(page.getByText('Próximo passo')).toBeVisible()
    await expect(starButton(page, STAR_NAMES.completed)).toHaveCount(0)

    const openedFacts = createSpaceFakes({
      facts: { completed: [], opened: [PLANET_ID] },
    })
    await ServerMock(page).register([
      ...createAuthenticatedRoutes(openedFacts),
      {
        method: 'PUT',
        path: `/profile/users/planets/${PLANET_ID}/open`,
        status: 200,
        body: { openedPlanetId: PLANET_ID },
      },
    ])
    const openRequest = page.waitForRequest(
      (request) =>
        request.method() === 'PUT' &&
        request.url().endsWith(`/profile/users/planets/${PLANET_ID}/open`),
    )
    await openButton.click()
    await openRequest

    await expect(starButton(page, STAR_NAMES.completed)).toContainText('Disponível')
    await expect(
      page.getByRole('button', { name: `Abrir planeta ${PLANET_NAME}` }),
    ).toHaveCount(0)
    await expect(page.getByText(fixtures.planet.name, { exact: true })).toBeVisible()
  })

  test('opens the planet with reduced motion', async ({ page, context }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await registerSpaceScenario(page, context, { facts: { completed: [], opened: [] } })
    await page.goto('/space')

    const openButton = page.getByRole('button', { name: `Abrir planeta ${PLANET_NAME}` })
    await expect(openButton).toBeVisible()
    await ServerMock(page).register([
      ...createAuthenticatedRoutes(
        createSpaceFakes({ facts: { completed: [], opened: [PLANET_ID] } }),
      ),
      {
        method: 'PUT',
        path: `/profile/users/planets/${PLANET_ID}/open`,
        status: 200,
        body: { openedPlanetId: PLANET_ID },
      },
    ])
    await openButton.click()

    await expect(starButton(page, STAR_NAMES.completed)).toContainText('Disponível')
  })

  test('keeps the planet liberated and shows a toast when opening fails', async ({
    page,
    context,
  }) => {
    await registerSpaceScenario(page, context, { facts: { completed: [], opened: [] } }, [
      {
        method: 'PUT',
        path: `/profile/users/planets/${PLANET_ID}/open`,
        status: 500,
        body: { title: 'Internal', message: 'Erro interno.' },
      },
    ])
    await page.goto('/space')

    const openButton = page.getByRole('button', { name: `Abrir planeta ${PLANET_NAME}` })
    await openButton.click()

    await expect(
      page.getByText(`Não foi possível abrir ${PLANET_NAME}. Tente de novo.`).first(),
    ).toBeVisible()
    await expect(openButton).toBeVisible()
  })

  test('opens the bottom sheet by touch on mobile, closes it and avoids horizontal scroll', async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await registerSpaceScenario(page, context)
    await page.goto('/space')

    const star = starButton(page, STAR_NAMES.available)
    await star.click()
    const sheet = page.getByRole('dialog')
    await expect(sheet.getByRole('button', { name: 'Começar história' })).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Voltar à estrela atual' }),
    ).toHaveCount(0)

    await sheet.getByRole('button', { name: 'Fechar detalhes da estrela' }).click()
    await expect(sheet).toHaveCount(0)
    await expect(star).toBeFocused()

    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(hasHorizontalScroll).toBe(false)
  })

  test('shows the return button only when the current item is out of view', async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await registerSpaceScenario(page, context, { fillerPlanetsCount: 6 })
    await page.goto('/space')

    const fab = page.getByRole('button', { name: 'Voltar à estrela atual' })
    await expect(starButton(page, STAR_NAMES.available)).toBeVisible()
    await expect(fab).toHaveCount(0)

    let previousTop: number | null = null
    await expect
      .poll(
        async () => {
          const box = await starButton(page, STAR_NAMES.available).boundingBox()
          const isSettled = box !== null && box.y === previousTop
          previousTop = box?.y ?? null
          return isSettled
        },
        { intervals: [500], timeout: 15000 },
      )
      .toBe(true)
    await starButton(page, STAR_NAMES.available).evaluate((star) => {
      let element: HTMLElement | null = star.parentElement
      while (element) {
        if (element.scrollHeight > element.clientHeight + 1) {
          const { overflowY } = getComputedStyle(element)
          if (overflowY === 'auto' || overflowY === 'scroll') {
            element.scrollTo(0, element.scrollHeight)
            return
          }
        }
        element = element.parentElement
      }
      window.scrollTo(0, document.body.scrollHeight)
    })
    await expect(fab).toBeVisible()

    await fab.click()
    await expect(fab).toHaveCount(0)
  })

  test('shows every star completed, no return button and the ending link when the trail is completed', async ({
    page,
    context,
  }) => {
    await registerSpaceScenario(page, context, {
      facts: ALL_FACTS,
      hasCompletedSpace: true,
    })
    await page.goto('/space')

    await expect(starButton(page, STAR_NAMES.available)).toContainText('Concluída')
    await expect(
      page.getByRole('button', { name: 'Voltar à estrela atual' }),
    ).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Agradecimentos.' })).toHaveAttribute(
      'href',
      '/lesson/ending',
    )
  })

  test('shows the empty message when the galaxy has no planets', async ({
    page,
    context,
  }) => {
    await registerSpaceScenario(page, context, { noPlanets: true })
    await page.goto('/space')

    await expect(page.getByText('Nenhum conteúdo disponível nesta trilha.')).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Voltar à estrela atual' }),
    ).toHaveCount(0)
  })

  test('shows the load failure with a retry action when the planets request fails', async ({
    page,
    context,
  }) => {
    await registerSpaceScenario(page, context, {
      planetsRoute: {
        status: 500,
        body: { title: 'Internal', message: 'Erro interno.' },
      },
    })
    await page.goto('/space')

    await expect(page.getByText('Não foi possível carregar a trilha')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible()
    await expect(page.getByRole('main').getByText('Erro interno.')).toHaveCount(0)
  })

  test('navigates to space from the protected shop and redirects guests to sign-in', async ({
    page,
    context,
  }) => {
    const fixtures = await registerSpaceScenario(page, context)

    await page.goto('/shop')
    const learnLink = page.getByRole('link', { name: 'Aprender' }).first()
    await expect(learnLink).toHaveAttribute('href', '/space')

    await Promise.all([page.waitForURL(`**/space/${GALAXY_SLUG}`), learnLink.click()])
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
