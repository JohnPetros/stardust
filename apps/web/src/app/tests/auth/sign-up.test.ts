import { expect, test, type Page } from '@playwright/test'

import { ServerMock } from '../shared/mocks/ServerMock'
import type { ServerMockRoute } from '../shared/types/ServerMockRoute'

type UserCreatedPayload = {
  userId: string
  userEmail: string
  userName: string
  userSlug: string
}

test.describe('/auth/sign-up', () => {
  const attemptId = '00000000-0000-4000-8000-000000000101'
  const webOrigin = 'http://127.0.0.1:3100'
  const validFields = {
    name: 'Cadastro Estelar',
    email: 'cadastro.estelar@stardust.dev',
    password: '123456',
  }

  function createUserCreatedPayload(email: string, name: string): UserCreatedPayload {
    return {
      userId: attemptId,
      userEmail: email,
      userName: name,
      userSlug: name.toLowerCase().trim().replace(/\s+/g, '-'),
    }
  }

  async function gotoSignUpPage(page: Page, routes: ServerMockRoute[] = []) {
    const server = ServerMock(page)

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()
    await server.registerSuccessDefaults([
      {
        method: 'POST',
        path: '/auth/sign-up',
        status: 201,
        body: null,
        headers: {
          'X-Onboarding-Receipt': 'signup-receipt-fixture',
          'X-Onboarding-Expires-At': expiresAt,
        },
      },
      {
        method: 'GET',
        path: '/profile/onboarding-attempt',
        status: 200,
        body: {
          account: { id: attemptId, email: validFields.email, name: validFields.name },
          expiresAt,
          isUserCreated: false,
        },
      },
      ...routes,
    ])
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
    await ServerMock(page).reset()
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
      return request.method() === 'POST' && request.url().endsWith('/api/auth/sign-up')
    })
    const signUpResponsePromise = page.waitForResponse((response) => {
      return (
        response.request().method() === 'POST' &&
        response.url().endsWith('/api/auth/sign-up')
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
        response.url().endsWith('/api/auth/sign-up')
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
        response.url().endsWith('/api/auth/sign-up')
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
        response.url().endsWith('/api/auth/sign-up')
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

  test('navigates to sign in through the visible sign-in link', async ({ page }) => {
    await gotoSignUpPage(page, [
      {
        method: 'GET',
        path: '/auth/account',
        status: 401,
        body: { title: 'Unauthorized', message: 'Não autorizado.' },
      },
    ])
    await page.getByTestId('sign-in-link').click()
    await expect(page).toHaveURL(/\/auth\/sign-in$/)
  })

  test('BFF middleware allows anonymous signup, resume and finite SSE while auth verification would fail', async ({
    page,
    context,
  }) => {
    await context.clearCookies()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()
    const attempt = {
      account: { id: attemptId, email: validFields.email, name: validFields.name },
      expiresAt,
      isUserCreated: false,
    }
    const rawBody = `retry: 1000\n\nevent: user.created\nid: profile:${attemptId}\ndata: ${JSON.stringify(createUserCreatedPayload(validFields.email, validFields.name))}\n\n`
    await ServerMock(page).register([
      {
        method: 'GET',
        path: '/auth/account',
        status: 500,
        body: { title: 'Unavailable', message: 'Must not run on BFF paths' },
      },
      {
        method: 'POST',
        path: '/auth/sign-up',
        status: 201,
        body: { id: attemptId, email: validFields.email, name: validFields.name },
        headers: {
          'X-Onboarding-Receipt': 'signup-receipt-fixture',
          'X-Onboarding-Expires-At': expiresAt,
        },
      },
      { method: 'GET', path: '/profile/onboarding-attempt', status: 200, body: attempt },
      {
        method: 'GET',
        path: '/profile/events',
        status: 200,
        rawBody,
        headers: { 'Content-Type': 'text/event-stream' },
      },
    ])
    const signup = await page.request.post('/api/auth/sign-up', {
      headers: { Origin: webOrigin },
      data: validFields,
    })
    expect(signup.status()).toBe(201)
    expect(await signup.json()).toEqual(attempt.account)
    expect(signup.headers()['x-onboarding-receipt']).toBeUndefined()
    expect(signup.headers()['x-onboarding-expires-at']).toBeUndefined()
    const cookies = await context.cookies(`${webOrigin}/api/auth/onboarding-attempt`)
    expect(
      cookies.find((cookie) => cookie.name === '@stardust:onboarding-attempt'),
    ).toEqual(
      expect.objectContaining({ httpOnly: true, sameSite: 'Lax', path: '/api/auth' }),
    )
    expect(
      cookies.find((cookie) => cookie.name === '@stardust:access-token'),
    ).toBeUndefined()
    const resume = await page.request.get('/api/auth/onboarding-attempt')
    expect(resume.status()).toBe(200)
    expect(await resume.json()).toEqual(attempt)
    const events = await page.request.get('/api/auth/profile-events')
    expect(events.status()).toBe(200)
    expect(events.headers()['content-type']).toContain('text/event-stream')
    expect(await events.text()).toBe(rawBody)
  })

  test('BFF middleware stops anonymous SSE and absent attempts without authentication calls', async ({
    page,
    context,
  }) => {
    await context.clearCookies()
    await ServerMock(page).register([
      { method: 'GET', path: '/auth/account', status: 500, body: null },
    ])
    const events = await page.request.get('/api/auth/profile-events')
    expect(events.status()).toBe(204)
    const resume = await page.request.get('/api/auth/onboarding-attempt')
    expect(resume.status()).toBe(200)
    expect(await resume.json()).toBeNull()
  })

  test('BFF middleware preserves Origin rejection and clears invalid resume receipts', async ({
    page,
    context,
  }) => {
    await ServerMock(page).register([
      {
        method: 'GET',
        path: '/profile/onboarding-attempt',
        status: 401,
        body: { title: 'Unauthorized', message: 'Expired fixture' },
      },
    ])
    const rejected = await page.request.post('/api/auth/sign-up', {
      headers: { Origin: 'http://other.test' },
      data: validFields,
    })
    expect(rejected.status()).toBe(403)
    await context.addCookies([
      {
        name: '@stardust:onboarding-attempt',
        value: 'invalid-fixture',
        domain: '127.0.0.1',
        path: '/api/auth',
        httpOnly: true,
        sameSite: 'Lax',
      },
    ])
    const resume = await page.request.get('/api/auth/onboarding-attempt')
    expect(resume.status()).toBe(200)
    expect(await resume.json()).toBeNull()
    expect(
      (await context.cookies()).some(
        (cookie) => cookie.name === '@stardust:onboarding-attempt',
      ),
    ).toBe(false)
  })
})
