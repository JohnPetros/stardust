import { RocketsList } from './RocketsList'
import { AvatarsList } from './AvatarsList'
import { Footer } from './Footer'

export async function ShopPage() {
  return (
    <main className='mx-auto max-w-5xl space-y-12 px-6 py-1 pb-[12rem] sm:pb-6'>
      <RocketsList />
      <AvatarsList />
      <Footer />
    </main>
  )
}
