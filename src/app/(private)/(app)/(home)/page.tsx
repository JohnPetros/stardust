'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePlanet } from '@/hooks/usePlanet'
import { Planet } from './components/Planet'

export default function Home() {
  const { user } = useAuth()
  const { planets, lastUnlockedStarId } = usePlanet()

  console.log(planets)

  return (
    <div
      style={{ backgroundImage: 'url("/images/space-background.png")' }}
      className="bg-center h-full flex flex-col items-center "
    >
      <main className="w-[480px] max-w-[90vw] mt-8 grid place-content-center gap-3">
        {planets?.map((planet) => (
          <Planet data={planet} />
        ))}
      </main>
    </div>
  )
}
