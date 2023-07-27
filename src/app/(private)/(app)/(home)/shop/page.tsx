'use client'

import { useRocket } from '@/hooks/useRocket'
import { Rocket } from './components/Rocket'
import { Loading } from '@/app/components/Loading'

export default function Shop() {
  const { rockets, addUserAcquiredRocket } = useRocket()

  return (
    <div className="px-6 max-w-[1024px] mx-auto">
      <>
        <h2 className="text-white font-semibold text-lg">Foguetes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-6 mt-3">
          {rockets.map((rocket) => (
            <Rocket
              key={rocket.id}
              data={rocket}
              addUserAcquiredRocket={addUserAcquiredRocket}
            />
          ))}
        </div>
      </>

      {!rockets.length && <Loading isSmall={false} />}
    </div>
  )
}
