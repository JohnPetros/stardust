import { expect, test, type Page } from '@playwright/test'

const SERVER_MOCK_ROUTE = '/api/tests/server'

type ServerMockRoute = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  query?: Record<string, string>
  status?: number
  delayInMs?: number
  body?: unknown
  headers?: Record<string, string>
}

type UserCreatedPayload = {
  userId: string
  userEmail: string
  userName: string
  userSlug: string
}

test.describe('/auth/sign-up', () => {
  const validFields = {
    name: 'Cadastro Estelar',
    email: 'cadastro.estelar@stardust.dev',
    password: '123456',
  }

  function createUserCreatedPayload(email: string, name: string): UserCreatedPayload {
    return {
      userId: crypto.randomUUID(),
      userEmail: email,
      userName: name,
      userSlug: name.toLowerCase().trim().replace(/\s+/g, '-'),
    }
  }

  async function gotoSignUpPage(page: Page, routes: ServerMockRoute[] = []) {
    const server = createServerMock(page)

    await server.registerSuccessDefaults(routes)
    await page.goto('/auth/sign-up')

    return server
  }

  async function fillValidSignUpForm(
    page: Page,
    fields: { name: string; email: string; password: string },
  ) {
    await page.getByTestId('name-input').fill(fields.name)
    await expect(page.getByTestId('email-input')).toBeVisible()

    await page.getByTestId('email-input').fill(fields.email)
    await expect(page.getByTestId('password-input')).toBeVisible()

    await page.getByTestId('password-input').fill(fields.password)
    await expect(page.getByTestId('submit-button')).toBeVisible()
  }

  async function emitUserCreated(page: Page, payload: UserCreatedPayload) {
    await page.waitForFunction(() => {
      return (window.__STARDUST_PROFILE_CHANNEL_MOCK__?.getListenersCount() ?? 0) > 0
    })

    await page.evaluate((userCreatedPayload) => {
      window.__STARDUST_PROFILE_CHANNEL_MOCK__?.emitUserCreated(userCreatedPayload)
    }, payload)
  }

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      window.__STARDUST_PROFILE_CHANNEL_MOCK__?.reset()
    })
    await createServerMock(page).reset()
  })

  test('progressively reveals sign-up fields', async ({ page }) => {
    await gotoSignUpPage(page)

    await expect(page.getByTestId('name-input')).toBeVisible()
    await expect(page.getByTestId('email-input')).toHaveCount(0)
    await expect(page.getByTestId('password-input')).toHaveCount(0)
    await expect(page.getByTestId('submit-button')).toHaveCount(0)

    await page.getByTestId('name-input').fill('ab')
    await expect(page.getByTestId('name-input-error')).toContainText(
      'Pelo menos 3 caracteres',
    )
    await expect(page.getByTestId('email-input')).toHaveCount(0)

    await page.getByTestId('name-input').fill(validFields.name)
    await expect(page.getByTestId('email-input')).toBeVisible()

    await page.getByTestId('email-input').fill('email-invalido')
    await expect(page.getByTestId('email-input-error')).toContainText(
      'E-mail válido, por favor',
    )
    await expect(page.getByTestId('password-input')).toHaveCount(0)

    await page.getByTestId('email-input').fill(validFields.email)
    await expect(page.getByTestId('password-input')).toBeVisible()

    await page.getByTestId('password-input').fill('123')
    await expect(page.getByTestId('password-input-error')).toContainText(
      'Senha deve conter pelo menos 6 caracteres',
    )
    await expect(page.getByTestId('submit-button')).toHaveCount(0)

    await page.getByTestId('password-input').fill(validFields.password)
    await expect(page.getByTestId('submit-button')).toBeVisible()
  })

  test('waits for realtime user creation before showing success', async ({ page }) => {
    await gotoSignUpPage(page)
    await fillValidSignUpForm(page, validFields)

    const signUpRequestPromise = page.waitForRequest((request) => {
      return (
        request.method() === 'POST' &&
        request.url().endsWith('/api/tests/server/auth/sign-up')
      )
    })
    const signUpResponsePromise = page.waitForResponse((response) => {
      return (
        response.request().method() === 'POST' &&
        response.url().endsWith('/api/tests/server/auth/sign-up')
      )
    })

    await page.getByTestId('submit-button').click()

    const signUpRequest = await signUpRequestPromise
    await signUpResponsePromise

    expect(signUpRequest.postDataJSON()).toEqual({
      email: validFields.email,
      password: validFields.password,
      name: validFields.name,
    })

    await expect(page.getByTestId('sign-up-form')).toBeVisible()
    await expect(page.getByTestId('sign-up-success-message')).toHaveCount(0)

    await emitUserCreated(
      page,
      createUserCreatedPayload(validFields.email, validFields.name),
    )

    await expect(page.getByTestId('sign-up-success-message')).toBeVisible()
    await expect(
      page.getByText('Enviamos para você um e-mail de confirmação', { exact: true }),
    ).toBeVisible()
  })

  test('ignores user created events from another email', async ({ page }) => {
    await gotoSignUpPage(page)
    await fillValidSignUpForm(page, validFields)

    const signUpResponsePromise = page.waitForResponse((response) => {
      return (
        response.request().method() === 'POST' &&
        response.url().endsWith('/api/tests/server/auth/sign-up')
      )
    })

    await page.getByTestId('submit-button').click()
    await signUpResponsePromise

    await emitUserCreated(
      page,
      createUserCreatedPayload('outro-usuario@stardust.dev', 'Outro Usuario'),
    )

    await expect(page.getByTestId('sign-up-success-message')).toHaveCount(0)
    await expect(page.getByTestId('sign-up-form')).toBeVisible()
  })

  test('resends sign-up confirmation email after success', async ({ page }) => {
    await gotoSignUpPage(page, [
      {
        method: 'POST',
        path: '/auth/resend-email/sign-up',
        status: 200,
        delayInMs: 750,
        body: null,
      },
    ])
    await fillValidSignUpForm(page, validFields)
    const signUpResponsePromise = page.waitForResponse((response) => {
      return (
        response.request().method() === 'POST' &&
        response.url().endsWith('/api/tests/server/auth/sign-up')
      )
    })

    await page.getByTestId('submit-button').click()
    await signUpResponsePromise

    await emitUserCreated(
      page,
      createUserCreatedPayload(validFields.email, validFields.name),
    )

    const resendButton = page.getByTestId('sign-up-success-message').getByRole('button')
    await expect(resendButton).toBeVisible()
    await expect(resendButton).toContainText(
      'Reenviar e-mail de confirmação de cadastro.',
    )

    const resendRequestPromise = page.waitForRequest((request) => {
      return (
        request.method() === 'POST' &&
        request.url().endsWith('/api/tests/server/auth/resend-email/sign-up')
      )
    })
    const resendResponsePromise = page.waitForResponse((response) => {
      return (
        response.request().method() === 'POST' &&
        response.url().endsWith('/api/tests/server/auth/resend-email/sign-up')
      )
    })

    await resendButton.click()
    await expect(resendButton).toBeDisabled()

    const resendRequest = await resendRequestPromise
    await resendResponsePromise

    expect(resendRequest.postDataJSON()).toEqual({
      email: validFields.email,
    })

    await expect(
      page.getByText('Reenviamos para você o e-mail de confirmação'),
    ).toBeVisible()
  })

  test('shows resend error when resend endpoint fails', async ({ page }) => {
    const resendErrorMessage = 'Falha ao reenviar o e-mail de confirmação'

    await gotoSignUpPage(page, [
      {
        method: 'POST',
        path: '/auth/resend-email/sign-up',
        status: 500,
        body: {
          title: 'Resend sign-up email error',
          message: resendErrorMessage,
        },
      },
    ])
    await fillValidSignUpForm(page, validFields)
    const signUpResponsePromise = page.waitForResponse((response) => {
      return (
        response.request().method() === 'POST' &&
        response.url().endsWith('/api/tests/server/auth/sign-up')
      )
    })

    await page.getByTestId('submit-button').click()
    await signUpResponsePromise

    await emitUserCreated(
      page,
      createUserCreatedPayload(validFields.email, validFields.name),
    )

    await page.getByTestId('sign-up-success-message').getByRole('button').click()

    await expect(page.getByText(resendErrorMessage)).toBeVisible()
  })

  test('keeps sign-in link pointing to sign-in page', async ({ page }) => {
    await gotoSignUpPage(page)

    await expect(page.getByTestId('sign-in-link')).toHaveAttribute(
      'href',
      '/auth/sign-in',
    )
  })
})
function createServerMock(page: Page) {
  return {
    async register(routes: ServerMockRoute[]) {
      const response = await page.request.put(SERVER_MOCK_ROUTE, {
        data: { routes },
      })

      if (!response.ok()) {
        throw new Error(
          `ServerMock.register failed: ${response.status()} ${await response.text()}`,
        )
      }
    },

    async reset() {
      const response = await page.request.delete(SERVER_MOCK_ROUTE)

      if (!response.ok()) {
        throw new Error(
          `ServerMock.reset failed: ${response.status()} ${await response.text()}`,
        )
      }
    },

    async registerSuccessDefaults(overrides: ServerMockRoute[] = []) {
      const defaultRoutes: ServerMockRoute[] = [
        {
          method: 'GET',
          path: '/auth/account',
          status: 200,
          body: null,
        },
        {
          method: 'GET',
          path: '/profile/users/verify-name-in-use',
          status: 200,
          body: null,
        },
        {
          method: 'GET',
          path: '/profile/users/verify-email-in-use',
          status: 200,
          body: null,
        },
        {
          method: 'POST',
          path: '/auth/sign-up',
          status: 200,
          body: null,
        },
      ]

      const routes = [...defaultRoutes]

      for (const override of overrides) {
        const routeIndex = routes.findIndex((route) => {
          return (
            route.method === override.method &&
            route.path === override.path &&
            JSON.stringify(route.query ?? {}) === JSON.stringify(override.query ?? {})
          )
        })

        if (routeIndex === -1) {
          routes.push(override)
          continue
        }

        routes[routeIndex] = override
      }

      await this.register(routes)
    },
  }
}
