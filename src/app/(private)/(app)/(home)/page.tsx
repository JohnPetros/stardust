'use client'

import { usePlanet } from '@/hooks/usePlanet'
import { Planet } from './components/Planet'
import { useSiderbar } from '@/hooks/useSiderbar'
import { useEffect, useState } from 'react'
import { TransitionPageAnimation } from '../components/TransitionPageAnimation'

export default function Home() {
  const { planets, lastUnlockedStarId } = usePlanet()
  const { isOpen, toggle } = useSiderbar()
  const [isTransitionVisible, setIsTransitionVisible] = useState(!!planets?.length)

  function handleClick() {
    if (isOpen) toggle()
  }

  useEffect(() => {
    if (planets?.length && !isTransitionVisible) {
      setTimeout(() => setIsTransitionVisible(false), 3500)
    }
  }, [planets])

  return (
    <main
      style={{ backgroundImage: 'url("/images/space-background.png")' }}
      className="bg-center flex flex-col items-center"
      onClick={handleClick}
    >
      <TransitionPageAnimation isVisible={isTransitionVisible} />
      <ul className=" max-w-[90vw] mt-24 flex flex-col items-start justify-center gap-12">
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
