import type { AvatarDTO, RocketDTO } from '@/@core/dtos'
import { ShopPage } from '@/modules/app/components/pages/shop'
import { ROUTES } from '@/modules/global/constants'
import { waitFor } from '@/modules/global/utils'
import { NextClient } from '@/server/client'

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

  const { rockets, avatars } = await client.get<ShopItems>(ROUTES.server.shop)

  await waitFor(2000)

  return <ShopPage rockets={rockets} avatars={avatars} />
}
