import { expect, test } from '../playwright'

async function gotoShopPage(page: import('../playwright').Page) {
  const pageResponses = Promise.all(
    ['/shop/insignias', '/shop/rockets', '/shop/avatars'].map((path) =>
      page.waitForResponse(
        (response) => response.url().includes(path) && response.status() === 200,
      ),
    ),
  )

  await page.goto('/shop')
  await pageResponses
}

test.describe('/shop', () => {
  test('renders the authenticated catalog sections and their items', async ({
    page,
    shop,
  }) => {
    const fixtures = await shop.register()

    await gotoShopPage(page)

    await expect(page.getByRole('heading', { name: 'Insígnias' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Foguetes' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Avatares' })).toBeVisible()
    await expect(page.getByText(fixtures.insignia.name)).toBeVisible()
    await expect(page.getByText(fixtures.rocket.name)).toBeVisible()
    await expect(page.getByText(fixtures.avatar.name)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Comprar' })).toHaveCount(3)
    await expect(page.getByText('Insígnia God')).toHaveCount(0)
  })

  test('navigates to the shop from the protected side navigation', async ({
    page,
    shop,
  }) => {
    await shop.register()

    await page.goto('/space')

    const shopLink = page.getByRole('link', { name: 'Loja' }).first()
    await expect(shopLink).toHaveAttribute('href', '/shop')

    const shopResponses = Promise.all(
      ['/shop/insignias', '/shop/rockets', '/shop/avatars'].map((path) =>
        page.waitForResponse(
          (response) => response.url().includes(path) && response.status() === 200,
        ),
      ),
    )

    await shopLink.click()
    await expect(page).toHaveURL(/\/shop$/)
    await shopResponses
    await expect(page.getByRole('heading', { name: 'Insígnias' })).toBeVisible()
  })

  test('redirects an unauthenticated user to sign-in when opening the shop', async ({
    page,
    context,
    serverApp,
  }) => {
    await context.clearCookies()
    await serverApp.register([
      {
        method: 'GET',
        path: '/auth/account',
        status: 401,
        body: { title: 'Unauthorized', message: 'Não autorizado.' },
      },
    ])

    await page.goto('/shop')

    await expect(page).toHaveURL(/\/auth\/sign-in\?nextRoute=%2Fshop$/)
    await expect(page.getByTestId('email-input')).toBeVisible()
    await expect(page.getByTestId('password-input')).toBeVisible()
  })

  test('filters rockets and requests the next page with the selected order', async ({
    page,
    shop,
  }) => {
    await shop.register()

    await gotoShopPage(page)

    const rocketSearch = page.locator('#rocket-search')
    const filteredRocketRequest = page.waitForRequest((request) => {
      const url = new URL(request.url())
      return (
        request.method() === 'GET' &&
        url.pathname.endsWith('/shop/rockets') &&
        url.searchParams.get('search') === 'orion'
      )
    })

    await rocketSearch.fill('orion')
    await filteredRocketRequest

    await expect(rocketSearch).toHaveValue('orion')

    const orderTrigger = page.locator('#rockets').getByRole('combobox')
    await orderTrigger.click()
    await page.getByRole('option', { name: 'Maior preço' }).click()

    const pageTwoRequest = page.waitForRequest((request) => {
      const url = new URL(request.url())
      return (
        request.method() === 'GET' &&
        url.pathname.endsWith('/shop/rockets') &&
        url.searchParams.get('page') === '2' &&
        url.searchParams.get('priceOrder') === 'descending'
      )
    })

    await page.getByRole('button', { name: '2', exact: true }).first().click()
    await pageTwoRequest
  })

  test('explains when the user cannot afford a shop item', async ({ page, shop }) => {
    const fixtures = await shop.register({ coins: 0 })

    await gotoShopPage(page)

    const rocketSection = page.locator('#rockets')
    await rocketSection.getByRole('button', { name: 'Comprar' }).click()

    await expect(
      page.getByText('Parece que você não tem StarCoins o suficiente'),
    ).toBeVisible()
    await expect(page.getByText(fixtures.rocket.name)).toBeVisible()
  })
})
