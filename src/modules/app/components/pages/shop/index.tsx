import type { AvatarDTO, RocketDTO } from '@/@core/dtos'
import { Footer } from './Footer'
import { RocketsList } from './RocketsList'
import type { PaginationResponse } from '@/@core/responses'

type ShopPageProps = {
  rockets: PaginationResponse<RocketDTO>
  avatars: PaginationResponse<AvatarDTO>
}

export async function ShopPage({ rockets, avatars }: ShopPageProps) {
  return (
    <main className='mx-auto max-w-5xl space-y-12 px-6 py-1 pb-[12rem] sm:pb-6'>
      <RocketsList initialRocketsPagination={rockets} />
      {/* <AvatarsList /> */}
      <Footer />
    </main>
  )
}
