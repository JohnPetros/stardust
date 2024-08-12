import type { AvatarDTO, RocketDTO } from '@/@core/dtos'
import type { PaginationResponse } from '@/@core/responses'
import { RocketsList } from './RocketsList'
import { AvatarsList } from './AvatarsList'
import { Footer } from './Footer'

type ShopPageProps = {
  rockets: PaginationResponse<RocketDTO>
  avatars: PaginationResponse<AvatarDTO>
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
