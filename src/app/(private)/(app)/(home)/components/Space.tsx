'use client'

import { useEffect, useState } from 'react'
import { CaretDown, CaretUp, Icon } from '@phosphor-icons/react'

import { TransitionPageAnimation } from '../../components/TransitionPageAnimation'

import { FabButton } from './FabButton'
import { Planet } from './Planet'

import { StarViewPortPosition } from '@/contexts/SpaceContext'
import { usePlanet } from '@/hooks/usePlanet'
import { useSiderbar } from '@/hooks/useSiderbar'
import { useSpace } from '@/hooks/useSpace'

const fabButtonIcon: Record<StarViewPortPosition, Icon> = {
  above: CaretDown,
  bellow: CaretUp,
  in: CaretDown,
}

export function Space() {
  const { lastUnlockedStarPosition, scrollIntoLastUnlockedStar } = useSpace()
  const { planets, lastUnlockedStarId } = usePlanet()
  const { isOpen, toggle, setIsAchievementsListVisible } = useSiderbar()
  const [isTransitionVisible, setIsTransitionVisible] = useState(
    !planets?.length
  )

  function handleClick() {
    if (isOpen) toggle()

    setIsAchievementsListVisible(false)
  }

  function handleFabButtonClick() {
    scrollIntoLastUnlockedStar()
  }

  useEffect(() => {
    if (planets?.length && isTransitionVisible) {
      setTimeout(() => setIsTransitionVisible(false), 3500)
    }
  }, [planets, isTransitionVisible])
  return (
    <main
      className="flex flex-col items-center bg-green-900 bg-[url('/images/space.png')] bg-center pb-6"
      onClick={handleClick}
    >
      <TransitionPageAnimation isVisible={isTransitionVisible} />
      <ul className=" mt-10 flex max-w-[75vw] flex-col items-start justify-center gap-12">
        {planets?.map((planet) => (
          <Planet
            key={planet.id}
            data={planet}
            lastUnlockedStarId={lastUnlockedStarId}
          />
        ))}
      </ul>

      <FabButton
        isVisible={lastUnlockedStarPosition !== 'in'}
        icon={fabButtonIcon[lastUnlockedStarPosition]}
        onClick={handleFabButtonClick}
      />
    </main>
  )
}
