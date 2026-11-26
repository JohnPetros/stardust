import {
  expect,
  test,
  type BrowserContext,
  type Page,
  type Request,
} from '@playwright/test'

import { AccountsFaker } from '../../../../../packages/core/src/auth/domain/entities/fakers'
import { UsersFaker } from '../../../../../packages/core/src/profile/domain/entities/fakers'
import {
  PlanetsFaker,
  StarsFaker,
} from '../../../../../packages/core/src/space/domain/entities/fakers'
import type {
  CurrentGalaxyDto,
  GalaxySummaryDto,
} from '../../../../../packages/core/src/space/domain/entities/dtos'
import { ServerMock } from '@/app/tests/shared/mocks/ServerMock'
import type { ServerMockRoute } from '@/app/tests/shared/types/ServerMockRoute'

const USER_ID = '00000000-0000-4000-8000-000000000401'
const TEST_SERVER_ROUTE = '/api/tests/server'
const SCREENSHOTS_DIR = 'test-results/galaxies-page'

const DESKTOP = { width: 1440, height: 900 }
const MOBILE = { width: 390, height: 844 }

const PROGRAMMING = {
  id: '00000000-0000-4000-8000-000000000411',
  slug: 'logica-de-programacao',
  name: 'Lógica de Programação',
  description: 'Aprenda a pensar como quem programa.',
}
const OBJECTS = {
  id: '00000000-0000-4000-8000-000000000412',
  slug: 'orientacao-a-objetos',
  name: 'Orientação a Objetos',
  description: 'Modele o mundo com objetos.',
}
const TEST_GALAXY = {
  id: '00000000-0000-4000-8000-000000000413',
  slug: 'galaxia-de-teste',
  name: 'Galáxia de teste',
  description: 'Galáxia publicada para os testes.',
}

type GalaxyRef = typeof PROGRAMMING

function summary(
  galaxy: GalaxyRef,
  position: number,
  overrides: Partial<GalaxySummaryDto> = {},
): GalaxySummaryDto {
  return {
    id: galaxy.id,
    slug: galaxy.slug,
    name: galaxy.name,
    description: galaxy.description,
    animation: `${galaxy.slug}.json`,
    position,
    status: 'published',
    planetsCount: 10,
    completedPlanetsCount: 3,
    isCurrent: false,
    ...overrides,
  }
}

const PROGRAMMING_CURRENT = summary(PROGRAMMING, 1, { isCurrent: true })
const OBJECTS_ANNOUNCED = summary(OBJECTS, 2, {
  status: 'announced',
  planetsCount: null,
  completedPlanetsCount: null,
})
const TEST_PUBLISHED = summary(TEST_GALAXY, 3, {
  planetsCount: 1,
  completedPlanetsCount: 0,
})

function currentGalaxyOf(galaxy: GalaxyRef, hasGalaxyChoice = true): CurrentGalaxyDto {
  return {
    galaxy: { id: galaxy.id, slug: galaxy.slug, name: galaxy.name },
    isFirstGalaxy: galaxy.slug === PROGRAMMING.slug,
    hasGalaxyChoice,
  }
}

function planetsOf(galaxy: GalaxyRef) {
  const star = StarsFaker.fakeDto({
    id: `${galaxy.id.slice(0, -3)}901`,
    name: `Estrela de ${galaxy.name}`,
    number: 1,
    slug: `estrela-${galaxy.slug}`,
    isChallenge: false,
  })

  return [
    PlanetsFaker.fakeDto({
      id: `${galaxy.id.slice(0, -3)}902`,
      name: `Planeta de ${galaxy.name}`,
      image: 'planet-image.png',
      stars: [star],
    }),
  ]
}

type Scenario = {
  galaxies?: GalaxySummaryDto[]
  current?: GalaxyRef
  hasGalaxyChoice?: boolean
  userCurrentGalaxy?: GalaxyRef | null
  hasProgressFacts?: boolean
  galaxiesRoute?: Partial<ServerMockRoute>
  enterRoute?: Partial<ServerMockRoute>
  extraRoutes?: ServerMockRoute[]
}

function createRoutes(scenario: Scenario = {}): ServerMockRoute[] {
  const galaxies = scenario.galaxies ?? [PROGRAMMING_CURRENT, OBJECTS_ANNOUNCED]
  const current = scenario.current ?? PROGRAMMING
  const userCurrentGalaxy =
    scenario.userCurrentGalaxy === undefined ? current : scenario.userCurrentGalaxy
  const account = AccountsFaker.fakeDto({
    id: USER_ID,
    name: 'Explorador de galáxias',
    email: 'explorador-de-galaxias@stardust.dev',
    isAuthenticated: true,
  })
  const planets = planetsOf(current)
  const user = UsersFaker.fakeDto({
    id: USER_ID,
    name: account.name,
    email: account.email,
    slug: 'explorador-de-galaxias',
    completedStarsIds:
      scenario.hasProgressFacts === false
        ? []
        : planets
            .flatMap((planet) => planet.stars.map((star) => star.id))
            .filter((starId): starId is string => Boolean(starId)),
    openedPlanetsIds:
      scenario.hasProgressFacts === false
        ? []
        : planets.map((planet) => planet.id).filter((id): id is string => Boolean(id)),
    lastWeekRankingPosition: null,
    currentGalaxy: userCurrentGalaxy
      ? {
          id: userCurrentGalaxy.id,
          entity: { name: userCurrentGalaxy.name, slug: userCurrentGalaxy.slug },
        }
      : null,
  })

  const routes: ServerMockRoute[] = [
    { method: 'GET', path: '/auth/account', status: 200, body: account },
    { method: 'GET', path: `/profile/users/id/${USER_ID}`, status: 200, body: user },
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
      path: '/space/galaxies',
      status: 200,
      body: galaxies,
      ...scenario.galaxiesRoute,
    },
    {
      method: 'GET',
      path: '/space/galaxies/current',
      status: 200,
      body: currentGalaxyOf(current, scenario.hasGalaxyChoice ?? true),
    },
    {
      method: 'GET',
      path: `/space/galaxies/${current.slug}/planets`,
      status: 200,
      body: planets,
    },
    {
      method: 'PUT',
      path: '/profile/users/current-galaxy',
      status: 200,
      body: {
        currentGalaxy: {
          id: TEST_GALAXY.id,
          slug: TEST_GALAXY.slug,
          name: TEST_GALAXY.name,
        },
      },
      ...scenario.enterRoute,
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
    ...(scenario.extraRoutes ?? []),
  ]

  return routes
}

async function signIn(context: BrowserContext) {
  await context.clearCookies()
  await context.addCookies([
    {
      name: '@stardust:access-token',
      value: 'galaxies-page-test-token',
      domain: '127.0.0.1',
      path: '/',
    },
  ])
}

async function registerScenario(
  page: Page,
  context: BrowserContext,
  scenario: Scenario = {},
) {
  await signIn(context)
  await ServerMock(page).reset()
  await ServerMock(page).register(createRoutes(scenario))
}

function trackEnterRequests(page: Page) {
  const requests: Request[] = []

  page.on('request', (request) => {
    if (
      request.method() === 'PUT' &&
      request.url().endsWith(`${TEST_SERVER_ROUTE}/profile/users/current-galaxy`)
    ) {
      requests.push(request)
    }
  })

  return requests
}

async function readHorizontalOverflow(page: Page) {
  return await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
}

function galaxyButton(page: Page, galaxy: GalaxyRef) {
  return page.getByRole('button', {
    name: new RegExp(`^(Você está aqui\\s*)?${galaxy.name}`),
  })
}

test.describe('Galaxies page', () => {
  test.afterEach(async ({ page }) => {
    await ServerMock(page).reset()
  })

  test('renders the map with the current galaxy and the announced galaxy', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context, {
      userCurrentGalaxy: PROGRAMMING,
    })

    await page.goto('/space/galaxies')

    await expect(page.getByRole('heading', { name: 'Galáxias', level: 1 })).toBeVisible()
    await expect(
      page.getByText('Cada galáxia é um curso. Escolha em qual você quer estudar.'),
    ).toBeVisible()

    const current = galaxyButton(page, PROGRAMMING)
    await expect(current).toBeVisible()
    await expect(current).toHaveAttribute('aria-current', 'true')
    await expect(current).toContainText(PROGRAMMING.description)
    await expect(current).toContainText('Você está aqui')
    await expect(current).toContainText('3 de 10 planetas')

    const announced = page.getByRole('article').filter({ hasText: OBJECTS.name })
    await expect(announced).toBeVisible()
    await expect(announced.getByText('Em breve')).toBeVisible()
    await expect(announced.getByText(OBJECTS.description)).toBeVisible()
    await expect(announced.getByRole('heading', { name: OBJECTS.name })).toBeVisible()
    await expect(announced.getByText(/de \d+ planetas/)).toHaveCount(0)

    await expect(page.getByRole('button', { name: /Orientação a Objetos/ })).toHaveCount(
      0,
    )
    await expect(page.getByRole('link', { name: /Orientação a Objetos/ })).toHaveCount(0)

    const names = await page.locator('main li').allInnerTexts()
    const programmingIndex = names.findIndex((text) => text.includes(PROGRAMMING.name))
    const objectsIndex = names.findIndex((text) => text.includes(OBJECTS.name))
    expect(programmingIndex).toBeGreaterThanOrEqual(0)
    expect(objectsIndex).toBeGreaterThan(programmingIndex)

    await expect(page.getByTestId('back-button')).toHaveText(
      `Voltar para ${PROGRAMMING.name}`,
    )
  })

  test('shows the plain back label when the account has no galaxy name', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context, { userCurrentGalaxy: null })

    await page.goto('/space/galaxies')

    await expect(page.getByTestId('back-button')).toHaveText('Voltar')

    await Promise.all([
      page.waitForURL(`**/space/${PROGRAMMING.slug}`),
      page.getByTestId('back-button').click(),
    ])
  })

  test('does not focus or request anything when the announced galaxy is clicked or Enter is pressed', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context)
    const enterRequests = trackEnterRequests(page)
    const galaxyRequests: string[] = []
    page.on('request', (request) => {
      if (request.url().includes(`${TEST_SERVER_ROUTE}/space/galaxies/`)) {
        galaxyRequests.push(request.url())
      }
    })

    await page.goto('/space/galaxies')
    const announced = page.getByRole('article').filter({ hasText: OBJECTS.name })
    await expect(announced).toBeVisible()
    const requestsBeforeInteraction = galaxyRequests.length

    await announced.getByRole('heading', { name: OBJECTS.name }).click()
    await page.keyboard.press('Enter')
    await announced.getByText(OBJECTS.description).click()
    await page.keyboard.press('Enter')
    await announced.evaluate((element) => (element as HTMLElement).focus())

    const isFocusInsideAnnounced = await page.evaluate(() => {
      const active = document.activeElement
      return Boolean(active?.closest('article'))
    })
    expect(isFocusInsideAnnounced).toBe(false)

    await expect(page).toHaveURL(/\/space\/galaxies$/)
    expect(enterRequests).toHaveLength(0)
    expect(galaxyRequests).toHaveLength(requestsBeforeInteraction)
  })

  test('shows the loading state while the galaxies request is pending', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context, {
      userCurrentGalaxy: PROGRAMMING,
      galaxiesRoute: { delayInMs: 8000 },
    })
    await page.setViewportSize(DESKTOP)

    await page.goto('/space/galaxies')

    const status = page.getByRole('status').filter({ hasText: 'Carregando galáxias…' })
    await expect(status).toBeVisible()
    await expect(page.getByTestId('back-button')).toHaveText(
      `Voltar para ${PROGRAMMING.name}`,
    )
    await expect(galaxyButton(page, PROGRAMMING)).toHaveCount(0)
    await expect(page.getByText(/de \d+ planetas/)).toHaveCount(0)
    await expect(page.getByText('Em breve')).toHaveCount(0)
    await page.screenshot({
      path: `${SCREENSHOTS_DIR}/vv-05-galaxies-loading-desktop-1440x900.png`,
    })

    await page.setViewportSize(MOBILE)
    await expect(status).toBeVisible()
    await page.screenshot({
      path: `${SCREENSHOTS_DIR}/vv-05-galaxies-loading-mobile-390x844.png`,
    })
  })

  test('shows the failure state and retries the galaxies request', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context, {
      userCurrentGalaxy: PROGRAMMING,
      galaxiesRoute: {
        status: 500,
        body: { title: 'Internal', message: 'detalhe-interno-do-servidor' },
      },
    })
    await page.setViewportSize(DESKTOP)

    await page.goto('/space/galaxies')

    const alert = page.getByRole('alert').filter({
      hasText: 'Não foi possível carregar as galáxias',
    })
    await expect(alert).toBeVisible()
    await expect(
      alert.getByText(
        'Verifique sua conexão e tente de novo. Seu progresso continua salvo.',
      ),
    ).toBeVisible()
    await expect(
      page.getByRole('main').getByText('detalhe-interno-do-servidor'),
    ).toHaveCount(0)
    await expect(page.getByTestId('back-button')).toHaveText(
      `Voltar para ${PROGRAMMING.name}`,
    )
    const retryButton = page.getByRole('button', { name: 'Tentar novamente' })
    await expect(retryButton).toBeVisible()
    await page.screenshot({
      path: `${SCREENSHOTS_DIR}/vv-06-galaxies-failure-desktop-1440x900.png`,
    })

    await page.setViewportSize(MOBILE)
    await expect(retryButton).toBeVisible()
    await page.screenshot({
      path: `${SCREENSHOTS_DIR}/vv-06-galaxies-failure-mobile-390x844.png`,
    })

    await ServerMock(page).register(createRoutes({ userCurrentGalaxy: PROGRAMMING }))

    const retryRequest = page.waitForRequest(
      (request) =>
        request.method() === 'GET' &&
        request.url().endsWith(`${TEST_SERVER_ROUTE}/space/galaxies`),
    )
    await retryButton.click()
    await retryRequest

    await expect(galaxyButton(page, PROGRAMMING)).toBeVisible()
    await expect(alert).toHaveCount(0)
    await expect(page).toHaveURL(/\/space\/galaxies$/)
  })

  test('enters a published galaxy with a single request and navigates to its route', async ({
    page,
    context,
  }) => {
    const scenario: Scenario = {
      galaxies: [PROGRAMMING_CURRENT, TEST_PUBLISHED],
      enterRoute: { delayInMs: 1500 },
    }
    await registerScenario(page, context, scenario)
    const enterRequests = trackEnterRequests(page)

    await page.goto('/space/galaxies')

    const target = galaxyButton(page, TEST_GALAXY)
    await expect(target).toBeVisible()
    await expect(target).toHaveAttribute('aria-busy', 'false')

    const enterRequest = page.waitForRequest(
      (request) =>
        request.method() === 'PUT' &&
        request.url().endsWith(`${TEST_SERVER_ROUTE}/profile/users/current-galaxy`),
    )
    await target.click()
    const request = await enterRequest

    expect(request.postDataJSON()).toEqual({ galaxySlug: TEST_GALAXY.slug })
    await expect(target).toHaveAttribute('aria-busy', 'true')

    await target.click({ force: true })
    await target.click({ force: true })

    await ServerMock(page).register(
      createRoutes({
        ...scenario,
        current: TEST_GALAXY,
        galaxies: [
          { ...PROGRAMMING_CURRENT, isCurrent: false },
          { ...TEST_PUBLISHED, isCurrent: true },
        ],
      }),
    )

    await page.waitForURL(`**/space/${TEST_GALAXY.slug}`)
    expect(enterRequests).toHaveLength(1)
    await expect(
      page.getByRole('link', { name: `${TEST_GALAXY.name}: ver galáxias` }),
    ).toBeVisible()
    await expect(page.getByText(`Planeta de ${TEST_GALAXY.name}`)).toBeVisible()
  })

  for (const viewport of [
    { label: 'desktop-1440x900', size: DESKTOP },
    { label: 'mobile-390x844', size: MOBILE },
  ]) {
    test(`shows the error toast and stays on the page when entering fails (${viewport.label})`, async ({
      page,
      context,
    }) => {
      await registerScenario(page, context, {
        galaxies: [PROGRAMMING_CURRENT, TEST_PUBLISHED],
        enterRoute: {
          status: 500,
          body: { title: 'Internal', message: 'detalhe-interno-do-servidor' },
        },
      })
      const enterRequests = trackEnterRequests(page)
      await page.setViewportSize(viewport.size)

      await page.goto('/space/galaxies')

      const target = galaxyButton(page, TEST_GALAXY)
      await expect(target).toBeVisible()
      await target.click()

      const message = `Não foi possível entrar em ${TEST_GALAXY.name}. Tente de novo.`
      await expect(page.getByText(message, { exact: true })).toBeVisible()
      await expect(
        page.getByRole('main').getByText('detalhe-interno-do-servidor'),
      ).toHaveCount(0)
      await page.screenshot({
        path: `${SCREENSHOTS_DIR}/vv-07-galaxies-enter-error-toast-${viewport.label}.png`,
      })

      await expect(page).toHaveURL(/\/space\/galaxies$/)
      await expect(target).toHaveAttribute('aria-busy', 'false')
      expect(enterRequests).toHaveLength(1)
    })
  }

  test('shows the new current galaxy when returning to the galaxies page after switching', async ({
    page,
    context,
  }) => {
    const scenario: Scenario = {
      galaxies: [PROGRAMMING_CURRENT, TEST_PUBLISHED],
    }
    await registerScenario(page, context, scenario)

    await page.goto('/space/galaxies')
    const target = galaxyButton(page, TEST_GALAXY)
    await expect(galaxyButton(page, PROGRAMMING)).toHaveAttribute('aria-current', 'true')

    await ServerMock(page).register(
      createRoutes({
        ...scenario,
        current: TEST_GALAXY,
        galaxies: [
          { ...PROGRAMMING_CURRENT, isCurrent: false },
          { ...TEST_PUBLISHED, isCurrent: true },
        ],
      }),
    )
    await target.click()
    await page.waitForURL(`**/space/${TEST_GALAXY.slug}`)

    const control = page.getByRole('link', { name: `${TEST_GALAXY.name}: ver galáxias` })
    await Promise.all([page.waitForURL('**/space/galaxies'), control.click()])

    await expect(galaxyButton(page, TEST_GALAXY)).toHaveAttribute('aria-current', 'true')
    await expect(galaxyButton(page, TEST_GALAXY)).toContainText('Você está aqui')
    await expect(galaxyButton(page, PROGRAMMING)).not.toHaveAttribute(
      'aria-current',
      'true',
    )
    await expect(galaxyButton(page, PROGRAMMING)).not.toContainText('Você está aqui')
  })

  test('does not read the first star of a galaxy as available before opening its planet', async ({
    page,
    context,
  }) => {
    const planets = planetsOf(TEST_GALAXY)
    const star = planets[0].stars[0]
    await registerScenario(page, context, {
      galaxies: [
        { ...PROGRAMMING_CURRENT, isCurrent: false },
        { ...TEST_PUBLISHED, isCurrent: true },
      ],
      current: TEST_GALAXY,
      hasProgressFacts: false,
    })

    await page.goto(`/space/${TEST_GALAXY.slug}`)

    await expect(page.getByRole('button', { name: new RegExp(star.name) })).toHaveCount(0)
    await expect(
      page.getByRole('button', { name: `Abrir planeta ${planets[0].name}` }),
    ).toBeVisible()
  })

  test('redirects to /space when there is a single visible galaxy', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context, {
      galaxies: [PROGRAMMING_CURRENT],
      hasGalaxyChoice: false,
    })

    await page.goto('/space/galaxies')

    await expect(page).toHaveURL(new RegExp(`/space/${PROGRAMMING.slug}$`))
    await expect(page.getByText(`Planeta de ${PROGRAMMING.name}`)).toBeVisible()

    await page.goBack()
    expect(page.url()).not.toMatch(/\/space\/galaxies$/)
  })

  test('redirects /space to the current galaxy route', async ({ page, context }) => {
    await registerScenario(page, context)

    await page.goto('/space')

    await expect(page).toHaveURL(new RegExp(`/space/${PROGRAMMING.slug}$`))
    await expect(page.getByText(`Planeta de ${PROGRAMMING.name}`)).toBeVisible()
  })

  test('redirects another galaxy route to the current galaxy route', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context)

    await page.goto(`/space/${TEST_GALAXY.slug}`)

    await expect(page).toHaveURL(new RegExp(`/space/${PROGRAMMING.slug}$`))
    await expect(page.getByText(`Planeta de ${PROGRAMMING.name}`)).toBeVisible()
  })

  test('shows the planets of the current galaxy returned by its own planets route', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context, {
      galaxies: [
        { ...PROGRAMMING_CURRENT, isCurrent: false },
        { ...TEST_PUBLISHED, isCurrent: true },
      ],
      current: TEST_GALAXY,
    })
    await page.goto(`/space/${TEST_GALAXY.slug}`)

    await expect(page).toHaveURL(new RegExp(`/space/${TEST_GALAXY.slug}$`))
    await expect(page.getByText(`Planeta de ${TEST_GALAXY.name}`)).toBeVisible()
    await expect(
      page.getByRole('button', { name: `Estrela de ${TEST_GALAXY.name}` }),
    ).toBeEnabled()
  })

  test('shows the galaxy control when there are two or more visible galaxies', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context)

    await page.goto(`/space/${PROGRAMMING.slug}`)

    const control = page.getByRole('link', { name: `${PROGRAMMING.name}: ver galáxias` })
    await expect(control).toBeVisible()
    await expect(control).toHaveAttribute('href', '/space/galaxies')
  })

  test('hides the galaxy control when there is a single visible galaxy', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context, {
      galaxies: [PROGRAMMING_CURRENT],
      hasGalaxyChoice: false,
    })

    await page.goto(`/space/${PROGRAMMING.slug}`)

    await expect(page.getByText(`Planeta de ${PROGRAMMING.name}`)).toBeVisible()
    await expect(page.getByRole('link', { name: /ver galáxias/ })).toHaveCount(0)
  })

  test('navigates from /space to the galaxies page through the visible control', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context, { userCurrentGalaxy: PROGRAMMING })

    await page.goto('/space')
    await expect(page).toHaveURL(new RegExp(`/space/${PROGRAMMING.slug}$`))

    const control = page.getByRole('link', { name: `${PROGRAMMING.name}: ver galáxias` })
    await expect(control).toBeVisible()

    const galaxiesRequest = page.waitForRequest(
      (request) =>
        request.method() === 'GET' &&
        request.url().endsWith(`${TEST_SERVER_ROUTE}/space/galaxies`),
    )
    await Promise.all([page.waitForURL('**/space/galaxies'), control.click()])
    await galaxiesRequest

    await expect(page).toHaveURL(/\/space\/galaxies$/)
    await expect(page.getByRole('heading', { name: 'Galáxias', level: 1 })).toBeVisible()
    await expect(galaxyButton(page, PROGRAMMING)).toBeVisible()

    await Promise.all([
      page.waitForURL(`**/space/${PROGRAMMING.slug}`),
      page.getByTestId('back-button').click(),
    ])
  })

  test('redirects guests from the galaxies routes to sign-in', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context)
    await context.clearCookies()
    await ServerMock(page).register([
      {
        method: 'GET',
        path: '/auth/account',
        status: 401,
        body: { title: 'Unauthorized', message: 'Não autorizado.' },
      },
    ])

    await page.goto('/space/galaxies')
    await expect(page).toHaveURL(/\/auth\/sign-in\?nextRoute=%2Fspace%2Fgalaxies$/)
    await expect(page.getByTestId('email-input')).toBeVisible()

    await page.goto(`/space/${PROGRAMMING.slug}`)
    await expect(page).toHaveURL(
      new RegExp(`/auth/sign-in\\?nextRoute=%2Fspace%2F${PROGRAMMING.slug}$`),
    )
    await expect(page.getByTestId('email-input')).toBeVisible()
  })

  test('supports keyboard navigation across the back action, galaxies and control', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context, { userCurrentGalaxy: PROGRAMMING })

    await page.goto('/space/galaxies')
    const back = page.getByTestId('back-button')
    await expect(back).toBeVisible()
    await back.focus()
    await expect(back).toBeFocused()

    await page.keyboard.press('Tab')
    const current = galaxyButton(page, PROGRAMMING)
    await expect(current).toBeFocused()
    const outlineStyle = await current.evaluate(
      (element) => getComputedStyle(element).outlineStyle,
    )
    expect(outlineStyle).not.toBe('none')

    for (let tabCount = 0; tabCount < 12; tabCount++) {
      await page.keyboard.press('Tab')
      const isInsideAnnounced = await page.evaluate(() =>
        Boolean(document.activeElement?.closest('article')),
      )
      expect(isInsideAnnounced).toBe(false)
    }

    await current.focus()
    await Promise.all([
      page.waitForURL(`**/space/${PROGRAMMING.slug}`),
      page.keyboard.press('Enter'),
    ])

    const control = page.getByRole('link', { name: `${PROGRAMMING.name}: ver galáxias` })
    await expect(control).toBeVisible()
    await control.focus()
    await expect(control).toBeFocused()
    await Promise.all([
      page.waitForURL('**/space/galaxies'),
      page.keyboard.press('Enter'),
    ])
    await expect(page.getByRole('heading', { name: 'Galáxias', level: 1 })).toBeVisible()

    await page.getByTestId('back-button').focus()
    await Promise.all([
      page.waitForURL(`**/space/${PROGRAMMING.slug}`),
      page.keyboard.press('Enter'),
    ])
  })

  test('has no horizontal scroll at 390x844 and keeps the same galaxies as on desktop', async ({
    page,
    context,
  }) => {
    await registerScenario(page, context, { userCurrentGalaxy: PROGRAMMING })

    await page.setViewportSize(DESKTOP)
    await page.goto('/space/galaxies')
    await expect(galaxyButton(page, PROGRAMMING)).toBeVisible()
    const desktopNames = await page.locator('main li').allInnerTexts()
    const desktopOverflow = await readHorizontalOverflow(page)
    expect(desktopOverflow.scrollWidth).toBeLessThanOrEqual(desktopOverflow.clientWidth)

    await page.setViewportSize(MOBILE)
    await expect(galaxyButton(page, PROGRAMMING)).toBeVisible()
    await expect(
      page.getByRole('article').filter({ hasText: OBJECTS.name }),
    ).toBeVisible()
    const mobileNames = await page.locator('main li').allInnerTexts()
    const mobileOverflow = await readHorizontalOverflow(page)
    expect(mobileOverflow.scrollWidth).toBeLessThanOrEqual(mobileOverflow.clientWidth)
    expect(mobileNames).toEqual(desktopNames)

    await page.goto(`/space/${PROGRAMMING.slug}`)
    await expect(
      page.getByRole('link', { name: `${PROGRAMMING.name}: ver galáxias` }),
    ).toBeVisible()
    const galaxyOverflow = await readHorizontalOverflow(page)
    expect(galaxyOverflow.scrollWidth).toBeLessThanOrEqual(galaxyOverflow.clientWidth)
  })

  test.describe('with motion allowed', () => {
    test('keeps the published animation running and the announced one static', async ({
      page,
      context,
    }) => {
      await registerScenario(page, context)
      await page.emulateMedia({ reducedMotion: 'no-preference' })

      await page.goto('/space/galaxies')

      const published = galaxyButton(page, PROGRAMMING).getByTestId('galaxy-animation')
      const announced = page
        .getByRole('article')
        .filter({ hasText: OBJECTS.name })
        .getByTestId('galaxy-animation')

      await expect(published).toHaveAttribute('data-static', 'false')
      await expect(announced).toHaveAttribute('data-static', 'true')
    })
  })

  test.describe('with reduced motion', () => {
    test('stops every animation and keeps the same content', async ({
      page,
      context,
    }) => {
      await registerScenario(page, context)
      await page.emulateMedia({ reducedMotion: 'reduce' })

      await page.goto('/space/galaxies')

      const matchesReducedMotion = await page.evaluate(
        () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      )
      expect(matchesReducedMotion).toBe(true)

      await expect(galaxyButton(page, PROGRAMMING)).toBeVisible()
      await expect(
        page.getByRole('article').filter({ hasText: OBJECTS.name }),
      ).toBeVisible()

      const animations = page.getByTestId('galaxy-animation')
      await expect(animations).toHaveCount(2)
      for (const animation of await animations.all()) {
        await expect(animation).toHaveAttribute('data-static', 'true')
      }
      await expect(galaxyButton(page, PROGRAMMING)).toContainText('3 de 10 planetas')
      await expect(page.getByText('Em breve')).toBeVisible()
    })
  })
})
