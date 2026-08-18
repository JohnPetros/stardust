import { expect, test } from '../playwright'

import { REPORT_ID } from '../fixtures/ReportingFixture'

test.describe('feedback dialog authenticated flow', () => {
  test('opens history, detail and marks the observed admin reply as read', async ({
    page,
    reporting,
  }) => {
    await reporting.register()
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
    reporting,
  }) => {
    await reporting.register()
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

  test('accepts a selected jpeg as the initial attachment', async ({
    page,
    reporting,
  }) => {
    await reporting.register()
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
    reporting,
  }) => {
    await reporting.register()
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
    reporting,
    serverApp,
  }) => {
    await reporting.register()
    await serverApp.register(
      reporting
        .routes()
        .map((route) =>
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

  test('renders a closed report as read-only', async ({ page, reporting, serverApp }) => {
    await reporting.register()
    const closedRoutes = reporting.routes().map((route) => {
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
    await serverApp.register(closedRoutes)
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
