'use client'

import { useRef, type PropsWithChildren } from 'react'
import { useInView } from 'framer-motion'

import { AnimatedOpacity } from '@/ui/global/widgets/components/AnimatedOpacity'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { AchievementCard } from '@/ui/profile/widgets/components/AchievementCard'
import { AnimatedCard } from './AnimatedCard'

export function AnimatedSpiral({ children }: PropsWithChildren) {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true })

  return (
    <div ref={containerRef} className='grid grid-cols-2'>
      <div className='grid place-content-center'>{children}</div>

      <div className='relative'>
        <AnimatedOpacity delay={0.5} isVisible={isInView} className='absoute z-[-5]'>
          <Animation name='spiral' size={500} hasLoop={true} />
        </AnimatedOpacity>

        <AnimatedCard containerRef={containerRef} className='absolute top-4 left-2'>
          <AchievementCard
            id='1'
            name='A constância é a mãe da excelência'
            icon='achievement-17.svg'
            description='Mantenha uma sequência de 10 dias estudados'
            isUnlocked
          />
        </AnimatedCard>

        <AnimatedCard containerRef={containerRef} className='absolute top-8 left-8'>
          <AchievementCard
            id='2'
            name='Ao infinito e além'
            icon='achievement-13.svg'
            description='Complete 8 planetas'
            isUnlocked
          />
        </AnimatedCard>

        <AnimatedCard containerRef={containerRef} className='absolute top-8 left-8'>
          <AchievementCard
            id='3'
            name='Colecionador de estrelas'
            icon='achievement-10.svg'
            description='Complete 10 estrelas'
          />
        </AnimatedCard>

        <AnimatedCard containerRef={containerRef} className='absolute top-8 left-8'>
          <AchievementCard
            id='4'
            name='Sênior'
            icon='achievement-9.svg'
            description='Ganhe 5000 XP'
          />
        </AnimatedCard>

        <AnimatedCard containerRef={containerRef} className='absolute top-8 left-8'>
          <AchievementCard
            id='5'
            name='Coletor de estrelas'
            icon='achievement-4.svg'
            description='Complete 5 estrelas'
          />
        </AnimatedCard>
      </div>
    </div>
  )
}
