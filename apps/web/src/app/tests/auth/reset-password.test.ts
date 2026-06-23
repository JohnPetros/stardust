import { expect, test, type BrowserContext, type Page } from '@playwright/test'

import type { SessionDto } from '@stardust/core/auth/structures/dtos'
import { SessionFaker } from '../../../../../../packages/core/src/auth/domain/structures/fakers'
import { IdFaker } from '../../../../../../packages/core/src/global/domain/structures/fakers'
import { ServerMock } from '../shared/mocks/ServerMock'
import type { ServerMockRoute } from '../shared/types/ServerMockRoute'

const RESET_PASSWORD_ROUTE = '/auth/reset-password'
const SIGN_IN_ROUTE = '/auth/sign-in'
const CONFIRM_PASSWORD_RESET_ROUTE = '/api/auth/confirm-password-reset'
const TEST_SERVER_URL = '/api/tests/server'
const LOCAL_WEB_URL = 'http://127.0.0.1:3100'

const RESET_PASSWORD_COOKIES = {
  shouldResetPassword: '@stardust:should-reset-password',
  accessToken: '@stardust:access-token',
  refreshToken: '@stardust:refresh-token',
}

test.describe('/auth/reset-password', () => {
  test.setTimeout(60000)

  const validFields = {
    email: 'reset.estelar@stardust.dev',
    newPassword: '123456',
    confirmation: '123456',
  }

  function createSessionDto(): SessionDto {
    return {
      ...SessionFaker.fakeDto(),
      accessToken: IdFaker.fake().value,
      refreshToken: IdFaker.fake().value,
      durationInSeconds: 3600,
    }
  }

  function createAuthAccountFallbackRoute(): ServerMockRoute {
    return {
      method: 'GET',
      path: '/auth/account',
      status: 401,
      body: {
        title: 'Unauthorized',
        message: 'Não autorizado.',
      },
    }
  }

  function createRequestPasswordResetSuccessRoute(): ServerMockRoute {
    return {
      method: 'POST',
      path: '/auth/request-password-reset',
      status: 200,
      body: null,
    }
  }

  function createConfirmPasswordResetSuccessRoute(session: SessionDto): ServerMockRoute {
    return {
      method: 'POST',
      path: '/auth/confirm-password-reset',
      status: 200,
      body: session,
    }
  }

  function createResetPasswordSuccessRoute(): ServerMockRoute {
    return {
      method: 'PATCH',
      path: '/auth/reset-password',
      status: 200,
      body: null,
    }
  }

  function createSignOutSuccessRoute(): ServerMockRoute {
    return {
      method: 'DELETE',
      path: '/auth/sign-out',
      status: 200,
      body: null,
    }
  }

  function createRefreshSessionUnauthorizedRoute(): ServerMockRoute {
    return {
      method: 'POST',
      path: '/auth/refresh-session',
      status: 401,
      body: {
        title: 'Unauthorized',
        message: 'Não autorizado.',
      },
    }
  }

  async function registerResetPasswordDefaults(
    page: Page,
    routes: ServerMockRoute[] = [],
  ) {
    await ServerMock(page).reset()
    await ServerMock(page).register([
      ...routes,
      createAuthAccountFallbackRoute(),
      createRequestPasswordResetSuccessRoute(),
      createResetPasswordSuccessRoute(),
      createSignOutSuccessRoute(),
      createRefreshSessionUnauthorizedRoute(),
    ])
  }

  async function setCookie(
    context: BrowserContext,
    cookie: { name: string; value: string; maxAge?: number },
  ) {
    await context.addCookies([
      {
        name: cookie.name,
        value: cookie.value,
        url: LOCAL_WEB_URL,
        httpOnly: true,
        sameSite: 'Lax',
        expires: Math.floor(Date.now() / 1000) + (cookie.maxAge ?? 900),
      },
    ])
  }

  async function setTemporaryResetCookies(context: BrowserContext, session: SessionDto) {
    await Promise.all([
      setCookie(context, {
        name: RESET_PASSWORD_COOKIES.shouldResetPassword,
        value: 'true',
      }),
      setCookie(context, {
        name: RESET_PASSWORD_COOKIES.accessToken,
        value: session.accessToken,
      }),
      setCookie(context, {
        name: RESET_PASSWORD_COOKIES.refreshToken,
        value: session.refreshToken,
      }),
    ])
  }

  async function getTemporaryResetCookies(context: BrowserContext) {
    const cookies = await context.cookies(LOCAL_WEB_URL)

    return {
      shouldResetPassword: cookies.find(
        (cookie) => cookie.name === RESET_PASSWORD_COOKIES.shouldResetPassword,
      )?.value,
      accessToken: cookies.find(
        (cookie) => cookie.name === RESET_PASSWORD_COOKIES.accessToken,
      )?.value,
      refreshToken: cookies.find(
        (cookie) => cookie.name === RESET_PASSWORD_COOKIES.refreshToken,
      )?.value,
    }
  }

  async function expectTemporaryCookies(context: BrowserContext, session: SessionDto) {
    await expect
      .poll(async () => await getTemporaryResetCookies(context))
      .toEqual({
        shouldResetPassword: 'true',
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      })
  }

  async function expectTemporaryPermissionCleared(context: BrowserContext) {
    await expect
      .poll(async () => (await getTemporaryResetCookies(context)).shouldResetPassword)
      .toBeUndefined()
  }

  async function expectTemporaryCookiesCleared(context: BrowserContext) {
    await expect
      .poll(async () => await getTemporaryResetCookies(context))
      .toEqual({
        shouldResetPassword: undefined,
        accessToken: undefined,
        refreshToken: undefined,
      })
  }

  async function gotoResetPasswordPage(page: Page, routes: ServerMockRoute[] = []) {
    await registerResetPasswordDefaults(page, routes)
    await page.goto(RESET_PASSWORD_ROUTE)
  }

  async function gotoAuthorizedResetPasswordPage(
    page: Page,
    session: SessionDto,
    routes: ServerMockRoute[] = [],
  ) {
    await setTemporaryResetCookies(page.context(), session)
    await gotoResetPasswordPage(page, routes)
  }

  async function fillResetRequestEmail(page: Page, email: string) {
    await page.getByTestId('email-input').fill(email)
    await expect(page.getByTestId('email-input')).toHaveValue(email)
  }

  async function openNewPasswordDialog(page: Page) {
    await page.getByTestId('open-reset-password-dialog-button').click()
    await expect(
      page.getByRole('heading', { name: 'Insira sua nova senha' }),
    ).toBeVisible()
  }

  async function fillNewPasswordForm(
    page: Page,
    fields: { newPassword: string; confirmation: string },
  ) {
    await page.getByTestId('new-password-input').fill(fields.newPassword)
    await page.getByTestId('new-password-confirmation-input').fill(fields.confirmation)
  }

  async function submitNewPasswordForm(page: Page) {
    await page.getByTestId('reset-password-submit-button').click()
  }

  async function submitSuccessfulPasswordReset(page: Page, session: SessionDto) {
    await gotoAuthorizedResetPasswordPage(page, session)
    await openNewPasswordDialog(page)
    await fillNewPasswordForm(page, validFields)

    const resetPasswordRequestPromise = page.waitForRequest((request) => {
      return (
        request.method() === 'PATCH' &&
        request.url().endsWith(`${TEST_SERVER_URL}/auth/reset-password`)
      )
    })
    const signOutResponsePromise = page.waitForResponse((response) => {
      return (
        response.request().method() === 'DELETE' &&
        response.url().endsWith(`${TEST_SERVER_URL}/auth/sign-out`)
      )
    })

    await submitNewPasswordForm(page)

    const resetPasswordRequest = await resetPasswordRequestPromise
    await signOutResponsePromise

    expect(resetPasswordRequest.postDataJSON()).toEqual({
      newPassword: validFields.newPassword,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    })

    await expect(
      page.getByRole('alertdialog', {
        name: 'Você redefiniu sua senha com sucesso!',
      }),
    ).toBeVisible()
  }

  test.afterEach(async ({ page }) => {
    await ServerMock(page).reset()
  })

  test('renders reset request form without temporary permission', async ({ page }) => {
    await gotoResetPasswordPage(page)

    await expect(page.getByRole('heading', { name: 'Redefina sua senha' })).toBeVisible()
    await expect(page.getByLabel('E-mail')).toBeVisible()
    await expect(page.getByPlaceholder('seu@email.com')).toBeVisible()
    await expect(page.getByTestId('submit-button')).toHaveText('Enviar e-mail')
    await expect(page.getByTestId('sign-in-link')).toHaveAttribute('href', SIGN_IN_ROUTE)
  })

  test('validates email before requesting password reset', async ({ page }) => {
    await gotoResetPasswordPage(page)

    let requestPasswordResetRequestsCount = 0
    page.on('request', (request) => {
      if (
        request.method() === 'POST' &&
        request.url().endsWith(`${TEST_SERVER_URL}/auth/request-password-reset`)
      ) {
        requestPasswordResetRequestsCount += 1
      }
    })

    await fillResetRequestEmail(page, 'email-invalido')
    await page.getByTestId('submit-button').click()

    await expect(page.getByText('Informe um e-mail válido')).toBeVisible()
    expect(requestPasswordResetRequestsCount).toBe(0)
  })

  test('posts email and shows generic success message', async ({ page }) => {
    await gotoResetPasswordPage(page)
    await fillResetRequestEmail(page, validFields.email)

    const requestPasswordResetRequestPromise = page.waitForRequest((request) => {
      return (
        request.method() === 'POST' &&
        request.url().endsWith(`${TEST_SERVER_URL}/auth/request-password-reset`)
      )
    })
    const requestPasswordResetResponsePromise = page.waitForResponse((response) => {
      return (
        response.request().method() === 'POST' &&
        response.url().endsWith(`${TEST_SERVER_URL}/auth/request-password-reset`)
      )
    })

    await page.getByTestId('submit-button').click()

    const requestPasswordResetRequest = await requestPasswordResetRequestPromise
    await requestPasswordResetResponsePromise

    expect(requestPasswordResetRequest.postDataJSON()).toEqual({
      email: validFields.email,
    })
    await expect(
      page.getByText(
        'Enviamos um e-mail para você redefinir sua senha (se seu e-mail estiver cadastrado, claro)',
      ),
    ).toBeVisible()
  })

  test('shows request error when password reset request fails', async ({ page }) => {
    await gotoResetPasswordPage(page, [
      {
        method: 'POST',
        path: '/auth/request-password-reset',
        status: 500,
        body: {
          title: 'Request password reset error',
          message: 'Falha ao solicitar redefinição',
        },
      },
    ])
    await fillResetRequestEmail(page, validFields.email)

    await page.getByTestId('submit-button').click()

    await expect(
      page.getByText('Erro ao enviar e-mail de redefinição de senha'),
    ).toBeVisible()
  })

  test('confirms reset token, stores temporary cookies and redirects to reset page', async ({
    page,
  }) => {
    const token = 'token-de-reset'
    const session = createSessionDto()

    await registerResetPasswordDefaults(page, [
      createConfirmPasswordResetSuccessRoute(session),
    ])

    await page.goto(`${CONFIRM_PASSWORD_RESET_ROUTE}?token=${token}`)

    await expect(page).toHaveURL(new RegExp(`${RESET_PASSWORD_ROUTE}$`))
    await expectTemporaryCookies(page.context(), session)
  })

  test('removes temporary permission and redirects to sign in when token confirmation fails', async ({
    page,
  }) => {
    const token = 'token-expirado'
    const session = createSessionDto()

    await setTemporaryResetCookies(page.context(), session)
    await registerResetPasswordDefaults(page, [
      {
        method: 'POST',
        path: '/auth/confirm-password-reset',
        status: 401,
        body: {
          title: 'Confirm password reset error',
          message: 'Invalid or expired token',
        },
      },
    ])

    await page.goto(`${CONFIRM_PASSWORD_RESET_ROUTE}?token=${token}`)

    await expect(page).toHaveURL(/\/auth\/sign-in\?error=invalid-or-expired-token$/)
    await expectTemporaryPermissionCleared(page.context())
  })

  test('renders authorized reset state and opens new password dialog', async ({
    page,
  }) => {
    await gotoAuthorizedResetPasswordPage(page, createSessionDto())

    await expect(page.getByText('Você já pode redefinir sua senha 🚀!')).toBeVisible()

    await openNewPasswordDialog(page)

    await expect(page.getByTestId('new-password-input')).toBeVisible()
    await expect(page.getByTestId('new-password-confirmation-input')).toBeVisible()
  })

  test('validates new password policy and matching confirmation', async ({ page }) => {
    await gotoAuthorizedResetPasswordPage(page, createSessionDto())
    await openNewPasswordDialog(page)

    await submitNewPasswordForm(page)
    await expect(
      page.getByText('Sua senha deve conter pelo menos 6 caracteres'),
    ).toBeVisible()

    await fillNewPasswordForm(page, {
      newPassword: '123',
      confirmation: '123',
    })
    await submitNewPasswordForm(page)
    await expect(
      page.getByText('Sua senha deve conter pelo menos 6 caracteres'),
    ).toBeVisible()

    await fillNewPasswordForm(page, {
      newPassword: validFields.newPassword,
      confirmation: '654321',
    })
    await submitNewPasswordForm(page)
    await expect(page.getByText('as senhas devem ser iguais')).toBeVisible()
  })

  test('patches new password with temporary tokens, signs out and returns to sign in from success action', async ({
    page,
  }) => {
    await submitSuccessfulPasswordReset(page, createSessionDto())

    await page.getByRole('button', { name: 'Fazer login' }).click()

    await expect(page).toHaveURL(new RegExp(`${SIGN_IN_ROUTE}$`))
    await expectTemporaryCookiesCleared(page.context())
  })

  test('returns to sign in when success dialog is closed with Escape', async ({
    page,
  }) => {
    await submitSuccessfulPasswordReset(page, createSessionDto())

    await page.keyboard.press('Escape')

    await expect(page).toHaveURL(new RegExp(`${SIGN_IN_ROUTE}$`))
    await expectTemporaryCookiesCleared(page.context())
  })

  test('returns to sign in when success dialog is closed by clicking outside', async ({
    page,
  }) => {
    await submitSuccessfulPasswordReset(page, createSessionDto())

    await page.mouse.click(10, 10)

    await expect(page).toHaveURL(new RegExp(`${SIGN_IN_ROUTE}$`))
    await expectTemporaryCookiesCleared(page.context())
  })

  test('keeps authorized flow and shows error when password reset fails', async ({
    page,
  }) => {
    await gotoAuthorizedResetPasswordPage(page, createSessionDto(), [
      {
        method: 'PATCH',
        path: '/auth/reset-password',
        status: 400,
        body: {
          title: 'Reset password error',
          message: 'Senha recusada',
        },
      },
    ])
    await openNewPasswordDialog(page)
    await fillNewPasswordForm(page, validFields)

    await submitNewPasswordForm(page)

    await expect(
      page.getByText('Erro de redefinição, escolha outra senha', { exact: true }),
    ).toBeVisible()
    await expect(page).toHaveURL(new RegExp(`${RESET_PASSWORD_ROUTE}$`))
    await expect(page.getByText('Você já pode redefinir sua senha 🚀!')).toBeVisible()
  })
})
