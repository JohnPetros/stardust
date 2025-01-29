'use client'

import { useRef, type PropsWithChildren } from 'react'

import { AnimatedOpacity } from '@/ui/global/widgets/components/AnimatedOpacity'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { AnimatedItem } from './AnimatedItem'

export function AnimatedSpiral({ children }: PropsWithChildren) {
  const containerRef = useRef(null)

  return (
    <div ref={containerRef} className='relative'>
      <AnimatedOpacity delay={0.5} className='h-full w-full'>
        <Animation name='spiral' size='full' hasLoop={true} />
      </AnimatedOpacity>

      <AnimatedItem
        containerRef={containerRef}
        src='https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4'
        width={200}
        height={200}
        alt=''
        className='absolute top-4 left-2'
      />
      <AnimatedItem
        containerRef={containerRef}
        src='https://fastly.picsum.photos/id/11/2500/1667.jpg?hmac=xxjFJtAPgshYkysU_aqx2sZir-kIOjNR9vx0te7GycQ'
        width={200}
        height={200}
        alt=''
        className='absolute top-8 left-8'
      />

      {children}
    </div>
  )
}
