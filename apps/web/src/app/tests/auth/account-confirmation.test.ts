import { expect, test, type BrowserContext, type Page } from '@playwright/test'

import type { AccountDto } from '../../../../../../packages/core/src/auth/domain/entities/dtos/AccountDto'
import type { UserDto } from '../../../../../../packages/core/src/profile/domain/entities/dtos/UserDto'
import type { SessionDto } from '../../../../../../packages/core/src/auth/domain/structures/dtos/SessionDto'
import { AccountsFaker } from '../../../../../../packages/core/src/auth/domain/entities/fakers'
import { UsersFaker } from '../../../../../../packages/core/src/profile/domain/entities/fakers'
import { IdFaker } from '../../../../../../packages/core/src/global/domain/structures/fakers'
import { ServerMock } from '../shared/mocks/ServerMock'
import type { ServerMockRoute } from '../shared/types/ServerMockRoute'

type UserCreatedPayload = {
  userId: string
  userEmail: string
  userName: string
  userSlug: string
}

let deterministicIdCounter = 0

function createDeterministicId(): string {
  deterministicIdCounter += 1
  return `00000000-0000-4000-8000-${String(deterministicIdCounter).padStart(12, '0')}`
}

function createAuthenticatedAccountDto(overrides: Partial<AccountDto> = {}): AccountDto {
  return AccountsFaker.fakeDto({
    id: createDeterministicId(),
    email: 'confirmacao@stardust.dev',
    name: 'Confirmacao Estelar',
    isAuthenticated: true,
    ...overrides,
  })
}

function createUserDto(account: AccountDto): UserDto {
  return UsersFaker.fakeDto({
    id: account.id,
    email: account.email,
    name: account.name,
    slug: 'confirmacao-estelar',
    lastWeekRankingPosition: null,
    avatar: {
      id: IdFaker.fake().value,
      entity: { name: 'Avatar Padrao', image: '/images/avatar.png' },
    },
    rocket: {
      id: IdFaker.fake().value,
      entity: { name: 'Foguete Padrao', image: '/images/rocket.png' },
    },
    tier: {
      id: IdFaker.fake().value,
      entity: { name: 'Bronze', image: '/images/tier.png', position: 1, reward: 0 },
    },
  })
}

function createConfirmEmailSession(account: AccountDto): SessionDto {
  return {
    accessToken: IdFaker.fake().value,
    refreshToken: IdFaker.fake().value,
    durationInSeconds: 3600,
    account,
  }
}

function createUserCreatedPayload(email: string, name: string): UserCreatedPayload {
  return {
    userId: IdFaker.fake().value,
    userEmail: email,
    userName: name,
    userSlug: name.toLowerCase().trim().replace(/\s+/g, '-'),
  }
}

async function setSessionCookies(
  context: BrowserContext,
  session: SessionDto,
): Promise<void> {
  await context.addCookies([
    {
      name: '@stardust:access-token',
      value: session.accessToken,
      domain: '127.0.0.1',
      path: '/',
    },
    {
      name: '@stardust:refresh-token',
      value: session.refreshToken,
      domain: '127.0.0.1',
      path: '/',
    },
  ])
}

async function expectSessionCookies(
  context: BrowserContext,
  session: SessionDto,
): Promise<void> {
  const cookies = await context.cookies()
  const accessTokenCookie = cookies.find((c) => c.name === '@stardust:access-token')
  const refreshTokenCookie = cookies.find((c) => c.name === '@stardust:refresh-token')

  expect(accessTokenCookie?.value).toBe(session.accessToken)
  expect(refreshTokenCookie?.value).toBe(session.refreshToken)
}

function createAuthenticatedDefaults(
  account: AccountDto,
  params: { userStatus: 'pending' | 'created'; user?: UserDto },
): ServerMockRoute[] {
  const userRoute: ServerMockRoute =
    params.userStatus === 'pending'
      ? {
          method: 'GET',
          path: `/profile/users/id/${account.id}`,
          status: 404,
          body: { title: 'Not Found', message: 'User not found' },
        }
      : {
          method: 'GET',
          path: `/profile/users/id/${account.id}`,
          status: 200,
          body: params.user ?? createUserDto(account),
        }

  return [
    { method: 'GET', path: '/auth/account', status: 200, body: account },
    userRoute,
    {
      method: 'POST',
      path: '/auth/refresh-session',
      status: 200,
      body: createConfirmEmailSession(account),
    },
  ]
}

async function registerAccountConfirmationDefaults(
  page: Page,
  account: AccountDto,
  params: {
    userStatus: 'pending' | 'created'
    user?: UserDto
    extraRoutes?: ServerMockRoute[]
  },
): Promise<void> {
  const defaults = createAuthenticatedDefaults(account, params)
  await ServerMock(page).registerSuccessDefaults([
    ...defaults,
    ...(params.extraRoutes ?? []),
  ])
}

async function gotoConfirmEmail(
  page: Page,
  token: string,
  session: SessionDto,
  extraRoutes: ServerMockRoute[] = [],
): Promise<void> {
  await ServerMock(page).registerSuccessDefaults([
    {
      method: 'POST',
      path: '/auth/confirm-email',
      status: 200,
      body: session,
    },
    {
      method: 'GET',
      path: '/auth/account',
      status: 200,
      body: session.account,
    },
    {
      method: 'GET',
      path: `/profile/users/id/${session.account.id}`,
      status: 404,
      body: { title: 'Not Found', message: 'User not found' },
    },
    {
      method: 'POST',
      path: '/auth/refresh-session',
      status: 200,
      body: session,
    },
    ...extraRoutes,
  ])

  await page.goto(`/api/auth/confirm-email?token=${token}`)
}

async function gotoAccountConfirmationPage(
  page: Page,
  context: BrowserContext,
  account: AccountDto,
  params: {
    userStatus: 'pending' | 'created'
    user?: UserDto
    extraRoutes?: ServerMockRoute[]
  } = { userStatus: 'pending' },
): Promise<void> {
  const session = createConfirmEmailSession(account)
  await setSessionCookies(context, session)
  await registerAccountConfirmationDefaults(page, account, params)
  await page.goto('/auth/account-confirmation')
}

async function registerRetryRoute(
  page: Page,
  status: number,
  body?: unknown,
): Promise<void> {
  await ServerMock(page).register([
    {
      method: 'POST',
      path: '/auth/sign-up/retry',
      status,
      body: body ?? null,
    },
  ])
}

async function emitUserCreated(page: Page, payload: UserCreatedPayload): Promise<void> {
  await page.waitForFunction(() => {
    return (window.__STARDUST_PROFILE_CHANNEL_MOCK__?.getListenersCount() ?? 0) > 0
  })

  await page.evaluate((userCreatedPayload) => {
    window.__STARDUST_PROFILE_CHANNEL_MOCK__?.emitUserCreated(userCreatedPayload)
  }, payload)
}

test.describe('/auth/account-confirmation', () => {
  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      window.__STARDUST_PROFILE_CHANNEL_MOCK__?.reset()
    })
    await ServerMock(page).reset()
  })

  test('confirms email, stores session cookies and redirects to account confirmation', async ({
    page,
    context,
  }) => {
    const account = createAuthenticatedAccountDto()
    const session = createConfirmEmailSession(account)
    const token = 'valid-token-hash'

    await gotoConfirmEmail(page, token, session)

    await expect(page).toHaveURL(/\/auth\/account-confirmation/, { timeout: 15000 })
    await expectSessionCookies(context, session)
  })

  test('redirects to sign in with error when email confirmation fails', async ({
    page,
    context,
  }) => {
    const errorMessage = 'Link de confirmação de e-mail expirado'

    await ServerMock(page).registerSuccessDefaults([
      {
        method: 'POST',
        path: '/auth/confirm-email',
        status: 401,
        body: { title: 'Auth Error', message: errorMessage },
      },
      {
        method: 'GET',
        path: '/auth/account',
        status: 401,
        body: { title: 'Unauthorized', message: 'Não autorizado.' },
      },
      {
        method: 'POST',
        path: '/auth/refresh-session',
        status: 401,
        body: { title: 'Unauthorized', message: 'Não autorizado.' },
      },
    ])

    await page.goto('/api/auth/confirm-email?token=expired-token')

    await expect(page).toHaveURL(/\/auth\/sign-in\?error=/, { timeout: 15000 })

    const cookies = await context.cookies()
    const accessTokenCookie = cookies.find((c) => c.name === '@stardust:access-token')
    expect(accessTokenCookie).toBeUndefined()
  })

  test('renders pending state while profile does not exist', async ({
    page,
    context,
  }) => {
    const account = createAuthenticatedAccountDto()

    await gotoAccountConfirmationPage(page, context, account, { userStatus: 'pending' })

    await expect(page.getByText('Aquecendo os motores')).toBeVisible({ timeout: 15000 })
  })

  test('reveals retry button only after the configured delay', async ({
    page,
    context,
  }) => {
    test.setTimeout(30000)

    const account = createAuthenticatedAccountDto()

    await gotoAccountConfirmationPage(page, context, account, { userStatus: 'pending' })

    await expect(page.getByTestId('retry-user-creation-button')).toHaveCount(0, {
      timeout: 5000,
    })

    await expect(page.getByTestId('retry-user-creation-button')).toBeVisible({
      timeout: 10000,
    })
  })

  test('refetches user and shows success when matching profile creation event arrives', async ({
    page,
    context,
  }) => {
    const account = createAuthenticatedAccountDto()
    const user = createUserDto(account)

    await gotoAccountConfirmationPage(page, context, account, { userStatus: 'pending' })

    await expect(page.getByText('Aquecendo os motores')).toBeVisible({ timeout: 15000 })

    await ServerMock(page).registerSuccessDefaults([
      { method: 'GET', path: '/auth/account', status: 200, body: account },
      {
        method: 'GET',
        path: `/profile/users/id/${account.id}`,
        status: 200,
        body: user,
      },
      {
        method: 'POST',
        path: '/auth/refresh-session',
        status: 200,
        body: createConfirmEmailSession(account),
      },
    ])

    await emitUserCreated(page, createUserCreatedPayload(account.email, account.name))

    await expect(page.getByText('Bem-vindo(a) 👋')).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('Seu perfil foi criado com sucesso!')).toBeVisible()
    await expect(page.getByTestId('go-to-space-button')).toBeVisible()
  })

  test('ignores profile creation events from another email', async ({
    page,
    context,
  }) => {
    const account = createAuthenticatedAccountDto()

    await gotoAccountConfirmationPage(page, context, account, { userStatus: 'pending' })

    await expect(page.getByText('Aquecendo os motores')).toBeVisible({ timeout: 15000 })

    await emitUserCreated(
      page,
      createUserCreatedPayload('outro-usuario@stardust.dev', 'Outro Usuario'),
    )

    await expect(page.getByText('Bem-vindo(a) 👋')).toHaveCount(0)
    await expect(page.getByText('Aquecendo os motores')).toBeVisible()
  })

  test('navigates to space from the main action after success', async ({
    page,
    context,
  }) => {
    test.setTimeout(60000)

    const account = createAuthenticatedAccountDto()
    const user = createUserDto(account)

    await gotoAccountConfirmationPage(page, context, account, { userStatus: 'pending' })

    await expect(page.getByText('Aquecendo os motores')).toBeVisible({ timeout: 15000 })

    await ServerMock(page).registerSuccessDefaults([
      { method: 'GET', path: '/auth/account', status: 200, body: account },
      {
        method: 'GET',
        path: `/profile/users/id/${account.id}`,
        status: 200,
        body: user,
      },
      {
        method: 'POST',
        path: '/auth/refresh-session',
        status: 200,
        body: createConfirmEmailSession(account),
      },
      {
        method: 'GET',
        path: '/profile/achievements',
        status: 200,
        body: [],
      },
      {
        method: 'GET',
        path: '/space/planets',
        status: 200,
        body: [],
      },
    ])

    await emitUserCreated(page, createUserCreatedPayload(account.email, account.name))

    await expect(page.getByTestId('go-to-space-button')).toBeVisible({ timeout: 15000 })
    await page.getByTestId('go-to-space-button').click()

    await expect(page).toHaveURL(/\/space$/, { timeout: 45000 })
  })

  test('requests retry user creation and shows loading while pending', async ({
    page,
    context,
  }) => {
    test.setTimeout(30000)

    const account = createAuthenticatedAccountDto()

    await gotoAccountConfirmationPage(page, context, account, {
      userStatus: 'pending',
      extraRoutes: [
        {
          method: 'POST',
          path: '/auth/sign-up/retry',
          status: 200,
          delayInMs: 1000,
          body: null,
        },
      ],
    })

    await expect(page.getByTestId('retry-user-creation-button')).toBeVisible({
      timeout: 10000,
    })

    const retryRequestPromise = page.waitForRequest((request) => {
      return request.method() === 'POST' && request.url().includes('/auth/sign-up/retry')
    })

    await page.getByTestId('retry-user-creation-button').click()

    await retryRequestPromise

    await expect(page.getByTestId('retry-user-creation-button')).toBeDisabled()
  })

  test('shows error toast when retry user creation fails', async ({ page, context }) => {
    test.setTimeout(30000)

    const account = createAuthenticatedAccountDto()
    const errorMessage = 'Erro ao recriar perfil'

    await gotoAccountConfirmationPage(page, context, account, {
      userStatus: 'pending',
      extraRoutes: [
        {
          method: 'POST',
          path: '/auth/sign-up/retry',
          status: 500,
          body: { title: 'Server Error', message: errorMessage },
        },
      ],
    })

    await expect(page.getByTestId('retry-user-creation-button')).toBeVisible({
      timeout: 10000,
    })

    await page.getByTestId('retry-user-creation-button').click()

    await expect(page.getByRole('alert')).toBeVisible({ timeout: 10000 })
  })

  test('redirects authenticated account without profile to account confirmation on private route', async ({
    page,
    context,
  }) => {
    test.setTimeout(30000)

    const account = createAuthenticatedAccountDto()
    const session = createConfirmEmailSession(account)

    await setSessionCookies(context, session)

    await ServerMock(page).registerSuccessDefaults([
      { method: 'GET', path: '/auth/account', status: 200, body: account },
      {
        method: 'GET',
        path: `/profile/users/id/${account.id}`,
        status: 404,
        body: { title: 'Not Found', message: 'User not found' },
      },
      {
        method: 'POST',
        path: '/auth/refresh-session',
        status: 200,
        body: session,
      },
      {
        method: 'GET',
        path: '/ranking/tiers',
        status: 200,
        body: [],
      },
      {
        method: 'GET',
        path: '/profile/achievements',
        status: 200,
        body: [],
      },
    ])

    await page.goto('/ranking')

    await expect(page).toHaveURL(/\/auth\/account-confirmation/, { timeout: 20000 })
  })
})
