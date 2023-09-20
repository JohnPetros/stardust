'use client'

import { usePlanet } from '@/hooks/usePlanet'
import { Planet } from './components/Planet'
import { useSiderbar } from '@/hooks/useSiderbar'
import { useEffect, useState } from 'react'
import { TransitionPageAnimation } from '../components/TransitionPageAnimation'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useSpace } from '@/hooks/useSpace'

export default function Home() {
  const { lastUnlockedStarRef } = useSpace()
  const { planets, lastUnlockedStarId } = usePlanet()
  const { isOpen, toggle, setIsAchievementsListVisible } = useSiderbar()
  const [isTransitionVisible, setIsTransitionVisible] = useState(
    !planets?.length
  )

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    console.log(lastUnlockedStarRef.current?.getBoundingClientRect().top)
    
    console.log('Page scroll: ', latest)
  })

  function handleClick() {
    if (isOpen) toggle()

    setIsAchievementsListVisible(false)
  }

  useEffect(() => {
    if (planets?.length && isTransitionVisible) {
      setTimeout(() => setIsTransitionVisible(false), 3500)
    }
  }, [planets])

  return (
    <main
      className="bg-[url('/images/space.png')] bg-center flex flex-col items-center"
      onClick={handleClick}
    >
      <TransitionPageAnimation isVisible={isTransitionVisible} />
      <ul className=" max-w-[75vw] mt-10 flex flex-col items-start justify-center gap-12">
        {planets?.map((planet) => (
          <Planet
            key={planet.id}
            data={planet}
            lastUnlockedStarId={lastUnlockedStarId}
          />
        ))}
      </ul>
    </main>
  )
}
