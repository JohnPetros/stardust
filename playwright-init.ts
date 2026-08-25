export default async ({ page }) => {
  const baseUrl = 'https://web-staging.stardust-app.com.br'
  const email = process.env.WEB_APP_E2E_EMAIL
  const password = process.env.WEB_APP_E2E_PASSWORD

  if (!email || !password) {
    throw new Error('Web App E2E credentials are not configured')
  }

  await page.goto(`${baseUrl}/auth/sign-in`, {
    waitUntil: 'domcontentloaded',
  })

  // An existing authenticated session may redirect directly to a protected page.
  if (!page.url().includes('/auth/sign-in')) return

  const emailInput = page.getByTestId('email-input')
  const passwordInput = page.getByTestId('password-input')

  try {
    await emailInput.fill(email)
    await passwordInput.fill(password)

    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/auth/sign-in') &&
        response.request().method() === 'POST',
      { timeout: 30_000 },
    )

    await page.getByTestId('submit-button').click()

    const response = await responsePromise

    if (!response.ok()) {
      throw new Error(`Web App authentication failed with HTTP ${response.status()}`)
    }

    await page.waitForURL((url) => !url.pathname.includes('/auth/sign-in'), {
      timeout: 30_000,
    })
  } catch (error) {
    // Prevent credentials from remaining visible in a later browser snapshot.
    await emailInput.fill('').catch(() => {})
    await passwordInput.fill('').catch(() => {})
    throw error
  }
}
