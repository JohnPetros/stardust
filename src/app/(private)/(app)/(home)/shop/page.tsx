import type { AvatarDTO, RocketDTO } from '@/@core/dtos'
import { ShopPage } from '@/ui/app/components/pages/shop'
import { ROUTES } from '@/ui/global/constants'
import { waitFor } from '@/ui/global/utils'
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
