import { expect, test } from '../playwright'

import { STAR_NAMES } from '../fixtures/SpaceFixture'

test.describe('/space', () => {
  test('loads the journey and renders the progress states for each star', async ({
    page,
    space,
  }) => {
    const fixtures = await space.register()

    await page.goto('/space')

    await expect(page.getByText(fixtures.planet.name, { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: STAR_NAMES.first })).toBeEnabled()
    await expect(page.getByText('Conteúdo novo')).toBeVisible()
    await expect(page.getByRole('button', { name: STAR_NAMES.locked })).toBeDisabled()
  })

  test('does not navigate when a locked star is selected', async ({ page, space }) => {
    await space.register()
    await page.goto('/space')

    const lockedStarButton = page.getByRole('button', { name: STAR_NAMES.locked })
    await expect(lockedStarButton).toBeDisabled()

    await lockedStarButton.click({ force: true })

    await expect(page).toHaveURL(/\/space$/)
  })

  test('falls back to the lesson when an unlocked star has no challenge', async ({
    page,
    space,
    serverApp,
  }) => {
    const fixtures = await space.register()
    const star = fixtures.lastUnlockedStar

    await serverApp.register([
      ...space.authenticatedRoutes(fixtures),
      {
        method: 'GET',
        path: `/challenging/challenges/star/${star.id}`,
        status: 404,
        body: { message: 'Challenge not found' },
      },
      {
        method: 'GET',
        path: `/space/stars/slug/${star.slug}`,
        status: 200,
        body: star,
      },
      {
        method: 'GET',
        path: `/lesson/questions/star/${star.id}`,
        status: 200,
        body: [],
      },
      {
        method: 'GET',
        path: `/lesson/text-blocks/star/${star.id}`,
        status: 200,
        body: [],
      },
    ])

    await page.goto('/space')

    const challengeResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith(`/challenging/challenges/star/${star.id}`) &&
        response.status() === 404,
    )

    const lessonNavigation = page.waitForURL(`/lesson/${star.slug}`)

    await page.locator('button').filter({ hasText: STAR_NAMES.lastUnlocked }).click()
    await challengeResponse
    await lessonNavigation
  })

  test('shows the ending link after the user completes the space', async ({
    page,
    space,
  }) => {
    await space.register({ hasCompletedSpace: true })
    await page.goto('/space')

    await expect(page.getByRole('link', { name: 'Agradecimentos.' })).toHaveAttribute(
      'href',
      '/lesson/ending',
    )
  })

  test('navigates to space from the protected shop and redirects guests to sign-in', async ({
    page,
    context,
    space,
    serverApp,
  }) => {
    const fixtures = await space.register()

    await page.goto('/shop')
    const learnLink = page.getByRole('link', { name: 'Aprender' }).first()
    await expect(learnLink).toHaveAttribute('href', '/space')

    await Promise.all([page.waitForURL('**/space'), learnLink.click()])
    await expect(page.getByText(fixtures.planet.name, { exact: true })).toBeVisible()

    await context.clearCookies()
    await serverApp.register([
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
