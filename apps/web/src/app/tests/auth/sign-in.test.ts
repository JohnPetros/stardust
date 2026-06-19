import { expect, test, type Page } from '@playwright/test'

import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import { AccountsFaker } from '../../../../../../packages/core/src/auth/domain/entities/fakers'
import { IdFaker } from '../../../../../../packages/core/src/global/domain/structures/fakers'
import { UsersFaker } from '../../../../../../packages/core/src/profile/domain/entities/fakers'
import { ServerMock } from '../shared/mocks/ServerMock'
import type { ServerMockRoute } from '../shared/types/ServerMockRoute'

let deterministicIdCounter = 0

test.describe('/auth/sign-in', () => {
  test.setTimeout(60000)

  const validFields = {
    email: 'login.estelar@stardust.dev',
    password: '123456',
  }

  function createDeterministicId() {
    deterministicIdCounter += 1
    return `00000000-0000-4000-8000-${String(deterministicIdCounter).padStart(12, '0')}`
  }

  function createAccountDto(overrides: Partial<AccountDto> = {}): AccountDto {
    return AccountsFaker.fakeDto({
      id: createDeterministicId(),
      email: validFields.email,
      name: 'Login Estelar',
      isAuthenticated: true,
      ...overrides,
    })
  }

  function createUserDto(account: AccountDto): UserDto {
    return UsersFaker.fakeDto({
      id: account.id,
      email: account.email,
      name: account.name,
      slug: 'login-estelar',
      lastWeekRankingPosition: null,
      avatar: {
        id: IdFaker.fake().value,
        entity: {
          name: 'Avatar Padrao',
          image: '/images/avatar.png',
        },
      },
      rocket: {
        id: IdFaker.fake().value,
        entity: {
          name: 'Foguete Padrao',
          image: '/images/rocket.png',
        },
      },
      tier: {
        id: IdFaker.fake().value,
        entity: {
          name: 'Bronze',
          image: '/images/tier.png',
          position: 1,
          reward: 0,
        },
      },
    })
  }

  function createSignInSuccessRoutes(
    account: AccountDto,
    session: unknown,
    params: { signInDelayInMs?: number } = {},
  ) {
    return [
      {
        method: 'POST',
        path: '/auth/sign-in',
        status: 200,
        delayInMs: params.signInDelayInMs,
        body: session,
      },
      {
        method: 'GET',
        path: `/profile/users/id/${account.id}`,
        status: 200,
        body: createUserDto(account),
      },
    ] satisfies ServerMockRoute[]
  }

  async function registerSignInSuccessDefaults(
    page: Page,
    params: { signInDelayInMs?: number; routes?: ServerMockRoute[] } = {},
  ) {
    const account = createAccountDto()
    const session = {
      accessToken: IdFaker.fake().value,
      refreshToken: IdFaker.fake().value,
      durationInSeconds: 3600,
      account,
    }

    await ServerMock(page).registerSuccessDefaults([
      {
        method: 'GET',
        path: '/auth/account',
        status: 401,
        body: {
          title: 'Unauthorized',
          message: 'Não autorizado.',
        },
      },
      ...createSignInSuccessRoutes(account, session, {
        signInDelayInMs: params.signInDelayInMs,
      }),
      {
        method: 'POST',
        path: '/auth/refresh-session',
        status: 401,
        body: {
          title: 'Unauthorized',
          message: 'Não autorizado.',
        },
      },
      ...(params.routes ?? []),
    ])

    return { account, session }
  }

  async function registerAuthenticatedNavigationDefaults(
    page: Page,
    account: AccountDto,
    session: unknown,
    routes: ServerMockRoute[] = [],
  ) {
    await ServerMock(page).registerSuccessDefaults([
      {
        method: 'GET',
        path: '/auth/account',
        status: 200,
        body: account,
      },
      ...createSignInSuccessRoutes(account, session),
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
      ...routes,
    ])
  }

  async function gotoSignInPage(
    page: Page,
    params: {
      nextRoute?: string
      signInDelayInMs?: number
      routes?: ServerMockRoute[]
    } = {},
  ) {
    await ServerMock(page).reset()
    const fixtures = await registerSignInSuccessDefaults(page, {
      signInDelayInMs: params.signInDelayInMs,
      routes: params.routes,
    })

    const searchParams = new URLSearchParams()
    if (params.nextRoute) searchParams.set('nextRoute', params.nextRoute)

    const queryString = searchParams.toString()

    await page.goto(queryString ? `/auth/sign-in?${queryString}` : '/auth/sign-in')

    return fixtures
  }

  async function fillValidSignInForm(
    page: Page,
    fields: { email: string; password: string },
  ) {
    await page.getByTestId('email-input').fill(fields.email)
    await expect(page.getByTestId('email-input')).toHaveValue(fields.email)

    await page.getByTestId('password-input').fill(fields.password)
    await expect(page.getByTestId('password-input')).toHaveValue(fields.password)
  }

  async function submitSignInForm(page: Page) {
    await page.getByTestId('password-input').press('Enter')
  }

  async function waitForSignInPageAction(page: Page) {
    return page.waitForResponse((response) => {
      return (
        response.request().method() === 'POST' && response.url().includes('/auth/sign-in')
      )
    })
  }

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      window.__STARDUST_PROFILE_CHANNEL_MOCK__?.reset()
    })
    await ServerMock(page).reset()
  })

  test('posts credentials and redirects to space after successful sign-in', async ({
    page,
  }) => {
    const { account, session } = await gotoSignInPage(page, {
      signInDelayInMs: 750,
    })
    await fillValidSignInForm(page, validFields)

    const signInRequestPromise = page.waitForRequest((request) => {
      return request.method() === 'POST' && request.url().endsWith('/auth/sign-in')
    })
    const signInActionResponsePromise = waitForSignInPageAction(page)

    await submitSignInForm(page)

    const signInRequest = await signInRequestPromise

    const signInRequestPayload = decodeURIComponent(signInRequest.postData() ?? '')

    expect(signInRequestPayload).toContain(validFields.email)
    expect(signInRequestPayload).toContain(validFields.password)

    await registerAuthenticatedNavigationDefaults(page, account, session)
    await signInActionResponsePromise

    await expect(page).toHaveURL(/\/space$/, {
      timeout: 20000,
    })
  })

  test('renders sign-in form, social links and auxiliary links', async ({ page }) => {
    await gotoSignInPage(page)

    await expect(page.getByTestId('email-input')).toBeVisible()
    await expect(page.getByTestId('password-input')).toBeVisible()
    await expect(page.getByTestId('submit-button')).toBeVisible()
    await expect(page.getByTestId('reset-password-link')).toBeVisible()
    await expect(page.getByTestId('create-account-link')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Entrar com Google' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Entrar com GitHub' })).toBeVisible()
  })

  test('validates form fields before requesting sign-in', async ({ page }) => {
    await gotoSignInPage(page)

    let signInRequestsCount = 0
    page.on('request', (request) => {
      if (
        request.method() === 'POST' &&
        request.url().endsWith('/api/tests/server/auth/sign-in')
      ) {
        signInRequestsCount += 1
      }
    })

    await page.getByTestId('email-input').fill('')
    await page.getByTestId('password-input').fill('123')
    await submitSignInForm(page)

    await expect(page.getByText('Informe um e-mail válido')).toBeVisible()
    await expect(
      page.getByText('Sua senha deve conter pelo menos 6 caracteres'),
    ).toBeVisible()
    expect(signInRequestsCount).toBe(0)
  })

  test('keeps user on sign-in page and shows error when sign-in fails', async ({
    page,
  }) => {
    const errorMessage = 'Falha ao autenticar com as credenciais informadas'

    await gotoSignInPage(page, {
      routes: [
        {
          method: 'POST',
          path: '/auth/sign-in',
          status: 401,
          body: {
            title: 'Sign in error',
            message: errorMessage,
          },
        },
      ],
    })
    await fillValidSignInForm(page, validFields)

    await page.getByTestId('submit-button').click()

    await expect(page).toHaveURL(/\/auth\/sign-in$/, {
      timeout: 10000,
    })
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 10000 })
    await page.waitForTimeout(5000)
    await expect(page).toHaveURL(/\/auth\/sign-in$/)
  })

  test('keeps social links pointing to configured server providers', async ({ page }) => {
    await gotoSignInPage(page)

    const googleLink = page.getByRole('link', { name: 'Entrar com Google' })
    const githubLink = page.getByRole('link', { name: 'Entrar com GitHub' })
    const googleHref = await googleLink.getAttribute('href')
    const githubHref = await githubLink.getAttribute('href')

    expect(googleHref).not.toBeNull()
    expect(githubHref).not.toBeNull()

    const googleUrl = new URL(googleHref as string)
    const githubUrl = new URL(githubHref as string)

    expect(googleUrl.pathname).toBe('/api/tests/server/auth/sign-in/google')
    expect(githubUrl.pathname).toBe('/api/tests/server/auth/sign-in/github')
    expect(googleUrl.searchParams.get('returnUrl')).toBe(
      'http://127.0.0.1:3100/auth/social-account-confirmation',
    )
    expect(githubUrl.searchParams.get('returnUrl')).toBe(
      'http://127.0.0.1:3100/auth/social-account-confirmation',
    )
  })

  test('keeps auxiliary links pointing to reset password and sign-up pages', async ({
    page,
  }) => {
    await gotoSignInPage(page)

    await expect(page.getByTestId('reset-password-link')).toHaveAttribute(
      'href',
      '/auth/reset-password',
    )
    await expect(page.getByTestId('create-account-link')).toHaveAttribute(
      'href',
      '/auth/sign-up',
    )
  })
})
