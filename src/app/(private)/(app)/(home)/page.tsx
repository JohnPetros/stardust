'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePlanet } from '@/hooks/usePlanet'
import { Planet } from './components/Planet'
import { useSiderbar } from '@/hooks/useSiderbar'

export default function Home() {
  const { user } = useAuth()
  const { planets, lastUnlockedStarId } = usePlanet()
  const { isOpen, toggle } = useSiderbar()

  function handleClick() {
    if (isOpen) toggle()
  }

  return (
    <main
      style={{ backgroundImage: 'url("/images/space-background.png")' }}
      className="bg-center flex flex-col items-center"
      onClick={handleClick}
    >
      <ul className="w-[480px] max-w-[90vw] mt-24 flex flex-col items-center justify-center gap-12">
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
