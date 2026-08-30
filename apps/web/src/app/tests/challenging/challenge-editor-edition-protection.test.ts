import { expect, test, type BrowserContext, type Page } from '@playwright/test'

import { AccountsFaker } from '../../../../../../packages/core/src/auth/domain/entities/fakers/AccountsFaker'
import { ChallengeCategoriesFaker } from '../../../../../../packages/core/src/challenging/domain/entities/fakers/ChallengeCategoriesFaker'
import { ChallengesFaker } from '../../../../../../packages/core/src/challenging/domain/entities/fakers/ChallengesFaker'
import { UsersFaker } from '../../../../../../packages/core/src/profile/domain/entities/fakers/UsersFaker'
import { ServerMock } from '../shared/mocks/ServerMock'
import type { ServerMockRoute } from '../shared/types/ServerMockRoute'

const USER_ID = '00000000-0000-4000-8000-000000000102'
const CHALLENGE_ID = '00000000-0000-4000-8000-000000000101'
const CATEGORY_ID = '00000000-0000-4000-8000-000000000103'
const CHALLENGE_SLUG = 'soma-complementar'
const EDITED_CHALLENGE_SLUG = 'titulo-editado'
const CREATE_ROUTE = '/challenging/challenge'
const EDIT_ROUTE = `${CREATE_ROUTE}/${CHALLENGE_SLUG}`

const category = ChallengeCategoriesFaker.fakeDto({ id: CATEGORY_ID, name: 'Arrays' })
const persistedChallenge = ChallengesFaker.fakeDto({
  id: CHALLENGE_ID,
  slug: CHALLENGE_SLUG,
  title: 'Soma complementar',
  description: 'Encontre os números complementares.',
  initialCode: 'console.log("resultado")',
  testCases: [
    { position: 1, inputs: [], expectedOutput: 'caso 1', isLocked: false },
    { position: 2, inputs: [], expectedOutput: 'caso 2', isLocked: false },
    { position: 3, inputs: [], expectedOutput: 'caso 3', isLocked: false },
  ],
  categories: [category],
  isEvaluatedByFunction: false,
  author: {
    id: USER_ID,
    entity: {
      name: 'Explorador de testes',
      slug: 'explorador',
      avatar: { name: 'Apollo', image: '/images/avatar.png' },
    },
  },
})
const updatedChallenge = {
  ...persistedChallenge,
  slug: EDITED_CHALLENGE_SLUG,
  title: 'Título editado',
}

function accountRoutes(): ServerMockRoute[] {
  const user = UsersFaker.fakeDto({
    id: USER_ID,
    name: 'Explorador de testes',
    email: 'explorador@stardust.dev',
    slug: 'explorador',
    completedChallengesIds: [],
    lastWeekRankingPosition: null,
  })

  return [
    {
      method: 'GET',
      path: '/auth/account',
      status: 200,
      body: AccountsFaker.fakeDto({
        id: USER_ID,
        name: 'Explorador de testes',
        email: 'explorador@stardust.dev',
        isAuthenticated: true,
      }),
    },
    {
      method: 'GET',
      path: `/profile/users/id/${USER_ID}`,
      status: 200,
      body: user,
    },
  ]
}

function editorRoutes(challenge?: typeof persistedChallenge): ServerMockRoute[] {
  return [
    ...accountRoutes(),
    {
      method: 'GET',
      path: '/challenging/challenges/categories',
      status: 200,
      body: [category],
    },
    updatedChallengeRoute(),
    updatedChallengeNavigationRoute(),
    {
      method: 'GET',
      path: `/challenging/challenges/${CHALLENGE_ID}/vote`,
      status: 200,
      body: { challengeVote: 'none' },
    },
    ...(challenge
      ? [
          {
            method: 'GET' as const,
            path: `/challenging/challenges/slug/${CHALLENGE_SLUG}`,
            status: 200,
            body: challenge,
          },
        ]
      : []),
  ]
}

function updatedChallengeRoute(): ServerMockRoute {
  return {
    method: 'GET',
    path: `/challenging/challenges/slug/${EDITED_CHALLENGE_SLUG}`,
    status: 200,
    body: updatedChallenge,
  }
}

function updatedChallengeNavigationRoute(): ServerMockRoute {
  return {
    method: 'GET',
    path: `/challenging/challenges/slug/${EDITED_CHALLENGE_SLUG}/navigation`,
    status: 200,
    body: { previousChallengeSlug: null, nextChallengeSlug: null },
  }
}

async function registerEditor(
  page: Page,
  context: BrowserContext,
  challenge = persistedChallenge,
  overrides: ServerMockRoute[] = [],
) {
  await context.clearCookies()
  await context.addCookies([
    {
      name: '@stardust:access-token',
      value: 'challenge-editor-testing-token',
      domain: '127.0.0.1',
      path: '/',
    },
  ])
  await ServerMock(page).register([...editorRoutes(challenge), ...overrides])
}

async function loadEditor(page: Page, route = EDIT_ROUTE) {
  await page.goto(CREATE_ROUTE)
  await page.goto(route)
  await expect(page.getByPlaceholder('Ex.: O problema dos 3 corpos')).toHaveValue(
    'Soma complementar',
  )
  await expect(page.getByRole('heading', { name: 'Categorias' })).toBeVisible()
}

async function makeDirty(page: Page) {
  const title = page.getByPlaceholder('Ex.: O problema dos 3 corpos')
  await title.fill('Título editado')
  await expect(title).toHaveValue('Título editado')
}

test.describe('proteção de edição do editor de desafios', () => {
  test.afterEach(async ({ page }) => {
    await ServerMock(page).reset()
  })

  test('mantém edição dirty ao cancelar Voltar e descarta somente após confirmação', async ({
    page,
    context,
  }) => {
    await registerEditor(page, context)
    await loadEditor(page)
    await makeDirty(page)

    await page.getByRole('button', { name: 'Voltar' }).click()
    await expect(page.getByRole('heading', { name: 'Sair sem salvar?' })).toBeVisible()
    await expect(page).toHaveURL(new RegExp(`${EDIT_ROUTE}$`))
    await expect(page.getByPlaceholder('Ex.: O problema dos 3 corpos')).toHaveValue(
      'Título editado',
    )

    await page.getByRole('button', { name: 'Continuar editando' }).click()
    await expect(page.getByRole('heading', { name: 'Sair sem salvar?' })).toBeHidden()
    await page.getByRole('button', { name: 'Voltar' }).click()
    await page.getByRole('button', { name: 'Sair sem salvar' }).click()
    await expect(page).toHaveURL(new RegExp(`${CREATE_ROUTE}$`))
  })

  test('fecha o diálogo com Escape e protege uma nova tentativa', async ({
    page,
    context,
  }) => {
    await registerEditor(page, context)
    await loadEditor(page)
    await makeDirty(page)

    await page.getByRole('button', { name: 'Voltar' }).click()
    await expect(page.getByRole('heading', { name: 'Sair sem salvar?' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('heading', { name: 'Sair sem salvar?' })).toBeHidden()
    await page.getByRole('button', { name: 'Voltar' }).click()
    await expect(page.getByRole('heading', { name: 'Sair sem salvar?' })).toBeVisible()
  })

  test('navega imediatamente quando o editor está limpo', async ({ page, context }) => {
    await registerEditor(page, context)
    await loadEditor(page)
    await page.getByRole('button', { name: 'Voltar' }).click()
    await expect(page).toHaveURL(new RegExp(`${CREATE_ROUTE}$`))
    await expect(page.getByRole('heading', { name: 'Sair sem salvar?' })).toBeHidden()
  })

  test('preserva o formulário e reabre a proteção quando a atualização falha', async ({
    page,
    context,
  }) => {
    await registerEditor(page, context, persistedChallenge, [
      {
        method: 'PUT',
        path: `/challenging/challenges/${CHALLENGE_ID}`,
        status: 500,
        body: { title: 'Falha de teste', message: 'Não foi possível atualizar.' },
      },
    ])
    await loadEditor(page)
    await makeDirty(page)
    await expect(page.getByRole('button', { name: /atualizar/i })).toBeEnabled()
    await expect(page.getByRole('button', { name: /atualizar/i })).toHaveAttribute(
      'type',
      'submit',
    )
    const [updateRequest, updateResponse] = await Promise.all([
      page.waitForRequest(
        (request) =>
          request.method() === 'PUT' &&
          request.url().includes(`/challenging/challenges/${CHALLENGE_ID}`),
      ),
      page.waitForResponse(
        (response) =>
          response.request().method() === 'PUT' &&
          response.url().includes(`/challenging/challenges/${CHALLENGE_ID}`),
      ),
      page.getByRole('button', { name: /atualizar/i }).click(),
    ])
    expect(updateRequest.postDataJSON()).toMatchObject({
      id: CHALLENGE_ID,
      title: 'Título editado',
      slug: EDITED_CHALLENGE_SLUG,
    })
    expect(updateResponse.status()).toBe(500)
    await expect(page.getByPlaceholder('Ex.: O problema dos 3 corpos')).toHaveValue(
      'Título editado',
    )
    await page.getByRole('button', { name: 'Voltar' }).click()
    await expect(page.getByRole('heading', { name: 'Sair sem salvar?' })).toBeVisible()
  })

  test('desarma a proteção após atualização bem-sucedida e observa o redirect', async ({
    page,
    context,
  }) => {
    await registerEditor(page, context, persistedChallenge, [
      {
        method: 'PUT',
        path: `/challenging/challenges/${CHALLENGE_ID}`,
        status: 200,
        body: updatedChallenge,
      },
    ])
    await loadEditor(page)
    await makeDirty(page)
    await expect(page.getByRole('button', { name: /atualizar/i })).toBeEnabled()
    const redirect = page.waitForURL(
      new RegExp(`/challenging/challenges/${EDITED_CHALLENGE_SLUG}/challenge$`),
    )
    const [updateRequest, updateResponse] = await Promise.all([
      page.waitForRequest(
        (request) =>
          request.method() === 'PUT' &&
          request.url().includes(`/challenging/challenges/${CHALLENGE_ID}`),
      ),
      page.waitForResponse(
        (response) =>
          response.request().method() === 'PUT' &&
          response.url().includes(`/challenging/challenges/${CHALLENGE_ID}`),
      ),
      redirect,
      page.getByRole('button', { name: /atualizar/i }).click(),
    ])
    expect(updateRequest.postDataJSON()).toMatchObject({
      id: CHALLENGE_ID,
      title: 'Título editado',
      slug: EDITED_CHALLENGE_SLUG,
    })
    expect(updateResponse.status()).toBe(200)
    expect(page.url()).toMatch(
      new RegExp(`/challenging/challenges/${EDITED_CHALLENGE_SLUG}/challenge$`),
    )
  })

  test('confirma antes de descarregar o documento quando beforeunload é suportado', async ({
    page,
    context,
  }) => {
    await registerEditor(page, context)
    await loadEditor(page)
    await makeDirty(page)

    let dialogSeen = false
    page.once('dialog', async (dialog) => {
      dialogSeen = dialog.type() === 'beforeunload'
      await dialog.dismiss()
    })
    await page.goto('about:blank').catch(() => undefined)
    expect(dialogSeen).toBe(true)
    // Playwright/Chromium does not expose a stable assertion for custom native text.
  })

  test('preserva a proteção quando a exclusão falha', async ({ page, context }) => {
    await registerEditor(page, context, persistedChallenge, [
      {
        method: 'DELETE',
        path: `/challenging/challenges/${CHALLENGE_ID}`,
        status: 500,
        body: { title: 'Falha de teste', message: 'Não foi possível excluir.' },
      },
    ])
    await loadEditor(page)
    await makeDirty(page)

    await page.getByRole('button', { name: 'Deletar' }).click()
    await expect(
      page.getByRole('heading', { name: 'Seu desafio está prestes a ser removido' }),
    ).toBeVisible()
    const deleteRequest = page.waitForRequest(
      (request) =>
        request.method() === 'DELETE' &&
        request.url().includes(`/challenging/challenges/${CHALLENGE_ID}`),
    )
    const deleteResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'DELETE' &&
        response.url().includes(`/challenging/challenges/${CHALLENGE_ID}`),
    )
    await page.getByRole('button', { name: 'Deletar meu desafio' }).click()
    await deleteRequest
    expect((await deleteResponse).status()).toBe(500)
    await page.getByRole('button', { name: 'Voltar' }).click()
    await expect(page.getByRole('heading', { name: 'Sair sem salvar?' })).toBeVisible()
  })

  test('desarma a proteção e navega após exclusão bem-sucedida', async ({
    page,
    context,
  }) => {
    await registerEditor(page, context, persistedChallenge, [
      {
        method: 'DELETE',
        path: `/challenging/challenges/${CHALLENGE_ID}`,
        status: 200,
        body: {},
      },
    ])
    await loadEditor(page)
    await makeDirty(page)

    await page.getByRole('button', { name: 'Deletar' }).click()
    const deleteRequest = page.waitForRequest(
      (request) =>
        request.method() === 'DELETE' &&
        request.url().includes(`/challenging/challenges/${CHALLENGE_ID}`),
    )
    const deleteResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'DELETE' &&
        response.url().includes(`/challenging/challenges/${CHALLENGE_ID}`),
    )
    await page.getByRole('button', { name: 'Deletar meu desafio' }).click()
    await deleteRequest
    expect((await deleteResponse).status()).toBe(200)
    await expect(page).toHaveURL(/\/challenging\/challenges$/)
  })

  test('não inventa cobertura de link interno ou Navigation API quando o editor não os expõe', async ({
    page,
    context,
  }) => {
    await registerEditor(page, context)
    await loadEditor(page)
    await expect(page.locator('a')).toHaveCount(0)
    // O editor integrado só renderiza Voltar; não há link controlado para exercitar.
    // Back/forward same-document depende de window.navigation, não disponível de
    // forma determinística no Chromium usado pela configuração testing.
  })
})
