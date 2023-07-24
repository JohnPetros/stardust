'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePlanet } from '@/hooks/usePlanet'
import { Planet } from './components/Planet'

export default function Home() {
  const { user } = useAuth()
  const { planets, lastUnlockedStarId } = usePlanet()

  return (
    <main
      style={{ backgroundImage: 'url("/images/space-background.png")' }}
      className="bg-center flex flex-col items-center "
    >
      <ul className="w-[480px] max-w-[90vw] mt-8 flex flex-col items-center justify-center gap-12">
        
        {planets?.map((planet) => (
          <Planet key={planet.id} data={planet} />
        ))}
      </ul>
    </main>
  )
}
