import type { PaginationResponse } from '@stardust/core/global/responses'
import type { AvatarDto, RocketDto } from '@stardust/core/shop/dtos'

import { RocketsList } from './RocketsList'
import { AvatarsList } from './AvatarsList'
import { Footer } from './Footer'

type ShopPageProps = {
  rockets: PaginationResponse<RocketDto>
  avatars: PaginationResponse<AvatarDto>
}

export async function ShopPage({ rockets, avatars }: ShopPageProps) {
  return (
    <main className='mx-auto max-w-5xl space-y-12 px-6 py-1 pb-[12rem] sm:pb-6'>
      <RocketsList initialItems={rockets} />
      <AvatarsList initialItems={avatars} />
      <Footer />
    </main>
  )
}
