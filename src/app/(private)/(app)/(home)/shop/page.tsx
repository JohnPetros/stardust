import type { AvatarDTO, RocketDTO } from '@/@core/dtos'

import { NextApiClient } from '@/infra/api/next/apiClient'
import { ShopPage } from '@/ui/app/components/pages/Shop'
import { ROUTES } from '@/ui/global/constants'
import { waitFor } from '@/ui/global/utils'

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
  const client = NextApiClient()

  const response = await client.get<ShopItems>(ROUTES.server.shop)

  if (response.isError) response.throwError()

  await waitFor(1000)

  return <ShopPage rockets={response.body.rockets} avatars={response.body.avatars} />
}
