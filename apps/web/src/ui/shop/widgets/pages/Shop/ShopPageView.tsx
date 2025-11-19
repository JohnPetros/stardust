import { InsigniasList } from './InsiginiasList'
import { RocketsList } from './RocketsList'
import { AvatarsList } from './AvatarsList'
import { Footer } from './Footer'

export const ShopPageView = () => {
  return (
    <main className='mx-auto max-w-5xl space-y-12 px-6 py-6 pb-[12rem] sm:pb-6'>
      <InsigniasList />
      <RocketsList />
      <AvatarsList />
      <Footer />
    </main>
  )
}
