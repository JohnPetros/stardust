'use client'

import { useRocket } from '@/hooks/useRocket'
import { Rocket } from './components/Rocket'
import { Loading } from '@/app/components/Loading'
import { Suspense } from 'react'

export default function Shop() {
  const { rockets, addUserAcquiredRocket } = useRocket()

  console.log(rockets)

  return (
    <div className=" max-w-[1024px] mx-auto">
      <Suspense fallback={<Loading isSmall={true} />}>
        <h2 className="text-white font-semibold text-lg">Foguetes</h2>
        <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
          {rockets.map((rocket) => (
            <Rocket
              key={rocket.id}
              data={rocket}
              addUserAcquiredRocket={addUserAcquiredRocket}
            />
          ))}
        </div>
      </Suspense>
    </div>
  )
}
