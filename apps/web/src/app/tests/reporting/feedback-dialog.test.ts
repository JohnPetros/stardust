import { expect, test, type BrowserContext, type Page } from '@playwright/test'

import { AccountsFaker } from '../../../../../../packages/core/src/auth/domain/entities/fakers'
import { UsersFaker } from '../../../../../../packages/core/src/profile/domain/entities/fakers'
import { ServerMock } from '../shared/mocks/ServerMock'
import type { ServerMockRoute } from '../shared/types/ServerMockRoute'

const USER_ID = '00000000-0000-4000-8000-000000000201'
const REPORT_ID = '00000000-0000-4000-8000-000000000202'
const ADMIN_MESSAGE_ID = '00000000-0000-4000-8000-000000000203'

function createFeedbackFixtures() {
  const account = AccountsFaker.fakeDto({
    id: USER_ID,
    name: 'Explorador de feedback',
    email: 'feedback@stardust.dev',
    isAuthenticated: true,
  })
  const user = UsersFaker.fakeDto({
    id: USER_ID,
    name: account.name,
    email: account.email,
    slug: 'explorador-de-feedback',
    lastWeekRankingPosition: null,
  })
  const author = {
    id: USER_ID,
    entity: {
      name: account.name,
      slug: 'explorador-de-feedback',
      avatar: { name: 'Avatar', image: '/images/profile.svg' },
    },
  }
  const report = {
    id: REPORT_ID,
    content: 'Um relato de teste com conteúdo suficiente.',
    title: 'Um relato de teste',
    intent: 'bug',
    author,
    status: 'open' as const,
    createdAt: '2026-08-06T12:00:00.000Z',
    lastActivityAt: '2026-08-06T12:05:00.000Z',
    hasUnreadAdminReply: true,
    preview: 'Resposta administrativa disponível.',
  }
  const detail = {
    ...report,
    latestAdminMessageId: ADMIN_MESSAGE_ID,
    messages: [
      {
        id: ADMIN_MESSAGE_ID,
        reportId: REPORT_ID,
        authorRole: 'admin' as const,
        authorId: '00000000-0000-4000-8000-000000000299',
        content: 'Resposta administrativa de teste.',
        createdAt: '2026-08-06T12:05:00.000Z',
        attachments: [],
      },
    ],
  }

  return { account, user, report, detail }
}

function authenticatedRoutes(): ServerMockRoute[] {
  const { account, user, report, detail } = createFeedbackFixtures()

  return [
    { method: 'GET', path: '/auth/account', status: 200, body: account },
    { method: 'GET', path: `/profile/users/id/${USER_ID}`, status: 200, body: user },
    { method: 'GET', path: '/profile/achievements', status: 200, body: [] },
    {
      method: 'POST',
      path: `/profile/achievements/${USER_ID}/observe`,
      status: 200,
      body: [],
    },
    { method: 'GET', path: '/space/planets', status: 200, body: [] },
    {
      method: 'GET',
      path: '/reporting/feedback/mine/unread-count',
      status: 200,
      body: { count: 1 },
    },
    {
      method: 'GET',
      path: '/reporting/feedback/mine',
      status: 200,
      body: { page: 1, itemsPerPage: 10, total: 1, items: [report] },
    },
    {
      method: 'GET',
      path: `/reporting/feedback/mine/${REPORT_ID}`,
      status: 200,
      body: detail,
    },
    {
      method: 'PUT',
      path: `/reporting/feedback/mine/${REPORT_ID}/read`,
      status: 204,
      body: null,
    },
    {
      method: 'POST',
      path: '/reporting/feedback',
      status: 201,
      body: { ...report, id: '00000000-0000-4000-8000-000000000204' },
    },
    {
      method: 'POST',
      path: '/reporting/feedback/attachments/signed-upload-url',
      status: 200,
      body: {
        url: 'https://storage.example.com/feedback-upload',
        folderPath: 'images/feedback-reports',
        fileName: 'feedback-upload.jpg',
      },
    },
    {
      method: 'POST',
      path: `/reporting/feedback/${REPORT_ID}/messages`,
      status: 201,
      body: {
        report,
        message: {
          id: '00000000-0000-4000-8000-000000000205',
          reportId: REPORT_ID,
          authorRole: 'user',
          authorId: USER_ID,
          content: 'Resposta criada pelo teste autenticado.',
          attachments: [],
        },
        isDuplicate: false,
      },
    },
  ]
}

async function registerAuthenticatedScenario(page: Page, context: BrowserContext) {
  await context.clearCookies()
  await context.addCookies([
    {
      name: '@stardust:access-token',
      value: 'feedback-dialog-test-token',
      domain: '127.0.0.1',
      path: '/',
    },
  ])
  await ServerMock(page).register(authenticatedRoutes())
}

test.describe('feedback dialog authenticated flow', () => {
  test.afterEach(async ({ page }) => {
    await ServerMock(page).reset()
  })

  test('opens history, detail and marks the observed admin reply as read', async ({
    page,
    context,
  }) => {
    await registerAuthenticatedScenario(page, context)
    await page.goto('/space')

    await expect(page.getByRole('button', { name: 'Feedback' })).toBeVisible()
    await page.getByRole('button', { name: 'Feedback' }).click()
    await page.getByRole('button', { name: 'Ver meus reportes' }).click()
    await expect(page.locator('#feedback-history-title')).toBeVisible()
    await expect(page.getByText('Nova resposta')).toBeVisible()

    const readResponse = page.waitForResponse(
      (response) =>
        response.url().includes(`/reporting/feedback/mine/${REPORT_ID}/read`) &&
        response.status() === 204,
    )
    await page.getByRole('button', { name: /Um relato de teste/ }).click()
    await expect(page.getByText('Resposta administrativa de teste.')).toBeVisible()
    await readResponse
  })

  test('submits a valid initial report and shows the success step', async ({
    page,
    context,
  }) => {
    await registerAuthenticatedScenario(page, context)
    await page.goto('/space')
    await page.getByRole('button', { name: 'Feedback' }).click()
    await page.getByRole('button', { name: 'Problema' }).click()
    await page
      .getByRole('textbox', { name: 'Descrição do feedback' })
      .fill('Relato criado pelo teste autenticado.')

    const createResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith('/reporting/feedback') &&
        response.request().method() === 'POST' &&
        response.status() === 201,
    )
    await page.getByRole('button', { name: 'Enviar feedback' }).click()
    await createResponse
    await expect(page.getByText('Agradecemos o feedback!')).toBeVisible()
  })

  test('accepts a selected jpeg as the initial attachment', async ({ page, context }) => {
    await registerAuthenticatedScenario(page, context)
    await page.route('https://storage.example.com/feedback-upload', (route) =>
      route.fulfill({ status: 200 }),
    )
    await page.goto('/space')
    await page.getByRole('button', { name: 'Feedback' }).click()
    await page.getByRole('button', { name: 'Ideia' }).click()
    await page
      .getByRole('textbox', { name: 'Descrição do feedback' })
      .fill('Relato com imagem selecionada pelo teste.')
    await page.getByLabel('Selecionar imagem PNG ou JPEG').setInputFiles({
      name: 'evidence.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-jpeg'),
    })
    await expect(page.getByAltText('Screenshot')).toBeVisible()

    const createResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith('/reporting/feedback') &&
        response.request().method() === 'POST' &&
        response.status() === 201,
    )
    await page.getByRole('button', { name: 'Enviar feedback' }).click()
    await createResponse
    await expect(page.getByText('Agradecemos o feedback!')).toBeVisible()
  })

  test('sends a reply in an open report and refreshes the detail', async ({
    page,
    context,
  }) => {
    await registerAuthenticatedScenario(page, context)
    await page.goto('/space')
    await page.getByRole('button', { name: 'Feedback' }).click()
    await page.getByRole('button', { name: 'Ver meus reportes' }).click()
    await page.locator('#feedback-history-title').waitFor()
    await page.getByRole('button', { name: /Um relato de teste/ }).click()
    await page.getByText('Resposta administrativa de teste.').waitFor()

    await page
      .getByRole('textbox', { name: 'Nova resposta' })
      .fill('Resposta criada pelo teste autenticado.')
    const sendResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith(`/reporting/feedback/${REPORT_ID}/messages`) &&
        response.request().method() === 'POST' &&
        response.status() === 201,
    )
    await page.getByRole('button', { name: 'Enviar' }).click()
    await sendResponse
    await expect(page.getByRole('textbox', { name: 'Nova resposta' })).toHaveValue('')
  })

  test('keeps the initial draft after a recoverable creation failure', async ({
    page,
    context,
  }) => {
    await registerAuthenticatedScenario(page, context)
    await ServerMock(page).register(
      authenticatedRoutes().map((route) =>
        route.method === 'POST' && route.path === '/reporting/feedback'
          ? { ...route, status: 500, body: { message: 'creation failed' } }
          : route,
      ),
    )
    await page.goto('/space')
    await page.getByRole('button', { name: 'Feedback' }).click()
    await page.getByRole('button', { name: 'Problema' }).click()
    const textarea = page.getByRole('textbox', { name: 'Descrição do feedback' })
    const content = 'Rascunho preservado após falha de criação.'
    await textarea.fill(content)

    const failureResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith('/reporting/feedback') &&
        response.request().method() === 'POST' &&
        response.status() === 500,
    )
    await page.getByRole('button', { name: 'Enviar feedback' }).click()
    await failureResponse
    await expect(textarea).toHaveValue(content)
    await expect(page.getByRole('button', { name: 'Enviar feedback' })).toBeEnabled()
  })

  test('renders a closed report as read-only', async ({ page, context }) => {
    await registerAuthenticatedScenario(page, context)
    const closedRoutes = authenticatedRoutes().map((route) => {
      if (route.path === '/reporting/feedback/mine' && route.method === 'GET') {
        const body = route.body as { items: Array<Record<string, unknown>> }
        return {
          ...route,
          body: {
            ...body,
            items: body.items.map((item) => ({
              ...item,
              status: 'closed',
              hasUnreadAdminReply: false,
            })),
          },
        }
      }
      if (
        route.path === `/reporting/feedback/mine/${REPORT_ID}` &&
        route.method === 'GET'
      ) {
        return { ...route, body: { ...(route.body as object), status: 'closed' } }
      }
      return route
    })
    await ServerMock(page).register(closedRoutes)
    await page.goto('/space')
    await page.getByRole('button', { name: 'Feedback' }).click()
    await page.getByRole('button', { name: 'Ver meus reportes' }).click()
    await page.getByRole('button', { name: /Um relato de teste/ }).click()
    await expect(page.getByText('Fechado', { exact: true })).toBeVisible()
    await expect(
      page.getByText(
        'Este reporte está fechado. A conversa permanece disponível para consulta.',
      ),
    ).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Nova resposta' })).toHaveCount(0)
  })
})
