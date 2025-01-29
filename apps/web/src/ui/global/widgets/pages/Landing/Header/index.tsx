import Image from 'next/image'

import { ROUTES } from '@/constants'
import { AnimatedBorder } from '../../../components/AnimatedBorder'
import { AnimatedHeader } from './AnimatedHeader'

export function Header() {
  return (
    <AnimatedHeader>
      <div className='flex items-center justify-between max-w-6xl mx-auto'>
        <Image src='/images/logo.svg' width={64} height={64} alt='' />
        <AnimatedBorder className='px-3 py-1 text-gray-50 font-medium'>
          <a href={ROUTES.auth.signIn}>Acessar conta</a>
        </AnimatedBorder>
      </div>
    </AnimatedHeader>
  )
}
