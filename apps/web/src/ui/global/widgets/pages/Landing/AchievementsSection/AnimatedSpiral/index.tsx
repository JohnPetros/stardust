'use client'

import { useRef, useEffect, type PropsWithChildren } from 'react'
import { useInView } from 'framer-motion'

import { AnimatedOpacity } from '@/ui/global/widgets/components/AnimatedOpacity'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { AchievementCard } from '@/ui/profile/widgets/components/AchievementCard'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { AnimatedCard } from './AnimatedCard'

export function AnimatedSpiral({ children }: PropsWithChildren) {
  const containerRef = useRef(null)
  const animationRef = useRef<AnimationRef>(null)
  const isInView = useInView(containerRef, { once: true })

  useEffect(() => {
    if (isInView) animationRef.current?.restart()
  }, [isInView])

  return (
    <div ref={containerRef} className='grid grid-cols-2'>
      <div className='grid place-content-center'>
        <Animation name='trophy' size={220} hasLoop={false} />
        {children}
      </div>

      <div className='relative'>
        <AnimatedOpacity delay={0.5} isVisible={isInView} className='absoute z-[-5]'>
          <Animation name='spiral' size={620} hasLoop={true} />
        </AnimatedOpacity>

        <AnimatedCard containerRef={containerRef} className='absolute top-80 left-24'>
          <AchievementCard
            id='17'
            name='A constância é a mãe da excelência'
            icon='achievement-17.svg'
            description='Mantenha uma sequência de 10 dias estudados'
            isUnlocked
          />
        </AnimatedCard>

        <AnimatedCard containerRef={containerRef} className='absolute top-6 left-2'>
          <AchievementCard
            id='13'
            name='Ao infinito e além'
            icon='achievement-13.svg'
            description='Complete 8 planetas'
            isUnlocked
          />
        </AnimatedCard>

        <AnimatedCard containerRef={containerRef} className='absolute top-32 left-24'>
          <AchievementCard
            id='10'
            name='Colecionador de estrelas'
            icon='achievement-10.svg'
            description='Complete 10 estrelas'
          />
        </AnimatedCard>

        <AnimatedCard containerRef={containerRef} className='absolute top-6 left-64'>
          <AchievementCard
            id='9'
            name='Sênior'
            icon='achievement-9.svg'
            description='Ganhe 5000 XP'
          />
        </AnimatedCard>

        <AnimatedCard containerRef={containerRef} className='absolute top-52 left-80'>
          <AchievementCard
            id='8'
            name='Pleno'
            icon='achievement-8.svg'
            description='Ganhe 2500 XP'
            isUnlocked
          />
        </AnimatedCard>

        <AnimatedCard containerRef={containerRef} className='absolute top-64 left-2'>
          <AchievementCard
            id='4'
            name='Coletor de estrelas'
            icon='achievement-4.svg'
            description='Complete 5 estrelas'
          />
        </AnimatedCard>
      </div>
    </div>
  )
}
