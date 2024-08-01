import type { AvatarDTO, RocketDTO } from '@/@core/dtos'
import { ShopPage } from '@/modules/app/components/pages/shop'
import { ROUTES } from '@/modules/global/constants'
import { waitFor } from '@/modules/global/utils'
import { NextClient } from '@/server/NextApiClient'

type ShopItems = {
  rockets: {
    items: RocketDTO[]
    count: number
  }
  avatars: {
    items: AvatarDTO[]
    count: number
  }
}

export default async function Shop() {
  const client = NextClient()

  const response = await client.get<ShopItems>(ROUTES.server.shop)

  if (response.isError) response.throwError()

  await waitFor(1000)

  return <ShopPage rockets={response.body.rockets} avatars={response.body.avatars} />
}
