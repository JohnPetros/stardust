'use client'

import { useEffect, useState } from 'react'
import { useSpace } from '@/hooks/useSpace'
import { usePlanet } from '@/hooks/usePlanet'
import { useSiderbar } from '@/hooks/useSiderbar'

import { Planet } from './components/Planet'
import { TransitionPageAnimation } from '../components/TransitionPageAnimation'
import { FabButton } from './components/FabButton'
import { CaretDown, CaretUp, Icon } from '@phosphor-icons/react'

import type { StarViewPortPosition } from '@/contexts/SpaceContext'

const fabButtonIcon: Record<StarViewPortPosition, Icon> = {
  above: CaretDown,
  bellow: CaretUp,
  in: CaretDown,
}

export default function Home() {
  const { lastUnlockedStarPosition } = useSpace()
  const { planets, lastUnlockedStarId } = usePlanet()
  const { isOpen, toggle, setIsAchievementsListVisible } = useSiderbar()
  const [isTransitionVisible, setIsTransitionVisible] = useState(
    !planets?.length
  )

  function handleClick() {
    if (isOpen) toggle()

    setIsAchievementsListVisible(false)
  }

  function handleFabButtonClick() {}

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

      {lastUnlockedStarPosition !== 'in' && (
        <FabButton
          icon={fabButtonIcon[lastUnlockedStarPosition]}
          onCLick={handleFabButtonClick}
        />
      )}
    </main>
  )
}
