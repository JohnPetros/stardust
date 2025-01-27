import Image from 'next/image'

import { AnimatedOpacity } from '../../../components/AnimatedOpacity'
import { Animation } from '../../../components/Animation'
import { Icon } from '../../../components/Icon'

export function Hero() {
  return (
    <div className='h-screen z-[-5] brightness-[0.25] grid place-content-center'>
      <AnimatedOpacity delay={0.5} className='absolute w-full'>
        <Animation name='galaxy' size='full' hasLoop={true} />
      </AnimatedOpacity>

      <Image
        src='/images/logo.svg'
        width={280}
        height={280}
        loading='eager'
        alt='Estar Dâsti'
        className='mt-6'
      />
      <p className='text-green-400 font-medium mt-3'>
        Aprenda programação viajando pelo espaço
      </p>

      <div className='mt-6'>
        <Animation name='apollo-greeting' size={64} hasLoop={true} />
      </div>

      <AnimatedOpacity delay={1.5} className='mt-6'>
        <a href='#content' className='flex flex-col gap-3 text-gray-50'>
          Veja mais
          <Icon name='arrow-down' />
        </a>
      </AnimatedOpacity>
    </div>
  )
}
