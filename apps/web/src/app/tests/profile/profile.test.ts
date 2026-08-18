import { expect, test } from '../playwright'

import { PROFILE_SLUGS, VISITOR_ID } from '../fixtures/ProfileFixture'

test.describe('/profile/[userSlug]', () => {
  test('renders the profile summary, progress indicators and created challenges', async ({
    page,
    profile: profileFixture,
  }) => {
    const { profile } = await profileFixture.register({
      id: VISITOR_ID,
      slug: PROFILE_SLUGS.visitor,
      name: 'Visitante Estelar',
    })

    await page.goto(`/profile/${PROFILE_SLUGS.visitor}`)

    await expect(
      page.getByRole('main').getByText('Visitante Estelar', { exact: true }).first(),
    ).toBeVisible()
    await expect(page.getByText('Nível 7 - 420 xp', { exact: true })).toBeVisible()
    await expect(page.getByText('Estrelas completadas', { exact: true })).toBeVisible()
    await expect(page.getByText('Planetas concluídos', { exact: true })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Conquistas adquiridas', exact: true }),
    ).toBeVisible()
    await expect(page.getByText('Desafios concluídos', { exact: true })).toBeVisible()
    await expect(page.getByText('Primeira conquista', { exact: true })).toBeVisible()
    await expect(page.getByText('Desafio estelar', { exact: true })).toBeVisible()
    await expect(
      page.locator(`a[href="/profile/${PROFILE_SLUGS.visitor}/settings"]`),
    ).toBeVisible()
    await expect(
      page.locator(`a[href="/profile/${PROFILE_SLUGS.visitor}/api-keys"]`),
    ).toBeVisible()
    await expect(page.locator('a[href="/playground/snippets"]')).toBeVisible()

    await page.getByRole('tab', { name: 'Soluções' }).click()
    await expect(page.getByText('Solução estelar', { exact: true })).toBeVisible()

    expect(profile.id).toBe(VISITOR_ID)
  })

  test('hides owner-only actions when viewing another user profile', async ({
    page,
    profile: profileFixture,
  }) => {
    await profileFixture.register()

    await page.goto(`/profile/${PROFILE_SLUGS.profile}`)

    await expect(page.getByText('Criador Estelar', { exact: true })).toBeVisible()
    await expect(
      page.locator(`a[href="/profile/${PROFILE_SLUGS.visitor}/settings"]`),
    ).toHaveCount(0)
    await expect(
      page.locator(`a[href="/profile/${PROFILE_SLUGS.visitor}/api-keys"]`),
    ).toHaveCount(0)
    await expect(page.locator('a[href="/playground/snippets"]')).toHaveCount(0)
  })

  test('navigates from the own profile to settings and API keys', async ({
    page,
    profile: profileFixture,
  }) => {
    await profileFixture.register({
      id: VISITOR_ID,
      slug: PROFILE_SLUGS.visitor,
      name: 'Visitante Estelar',
    })

    await page.goto(`/profile/${PROFILE_SLUGS.visitor}`)

    await Promise.all([
      page.waitForURL(`**/profile/${PROFILE_SLUGS.visitor}/settings`),
      page.locator(`a[href="/profile/${PROFILE_SLUGS.visitor}/settings"]`).click(),
    ])

    await page.goto(`/profile/${PROFILE_SLUGS.visitor}`)
    await Promise.all([
      page.waitForURL(`**/profile/${PROFILE_SLUGS.visitor}/api-keys`),
      page.locator(`a[href="/profile/${PROFILE_SLUGS.visitor}/api-keys"]`).click(),
    ])
  })

  test('navigates to the profile from the protected space and redirects guests to sign-in', async ({
    page,
    context,
    profile: profileFixture,
    serverApp,
  }) => {
    await profileFixture.register({
      id: VISITOR_ID,
      slug: PROFILE_SLUGS.visitor,
      name: 'Visitante Estelar',
    })

    await page.goto('/space')
    const profileLink = page.getByRole('link', { name: 'Perfil' }).first()
    await expect(profileLink).toHaveAttribute('href', `/profile/${PROFILE_SLUGS.visitor}`)

    await Promise.all([
      page.waitForURL(`**/profile/${PROFILE_SLUGS.visitor}`),
      profileLink.click(),
    ])
    await expect(page.getByText('Primeira conquista', { exact: true })).toBeVisible()

    await context.clearCookies()
    await serverApp.register([
      {
        method: 'GET',
        path: '/auth/account',
        status: 401,
        body: { title: 'Unauthorized', message: 'Não autorizado.' },
      },
    ])

    await page.goto(`/profile/${PROFILE_SLUGS.visitor}`)

    await expect(page).toHaveURL(
      new RegExp(`/auth/sign-in\\?nextRoute=%2Fprofile%2F${PROFILE_SLUGS.visitor}$`),
    )
    await expect(page.getByTestId('email-input')).toBeVisible()
  })
})
