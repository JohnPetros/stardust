'use client'

import { useRocket } from '@/hooks/useRocket'
import { Rocket } from './components/Rocket'

export default function Shop() {
  const { rockets } = useRocket()

  console.log(rockets)

  return (
    <div className="w-full max-w-[1024px] mx-auto">
      <h2 className="text-white">Foguetes</h2>
      <div className="grid grid-cols-3 gap-6 mt-3">
        {rockets?.map((rocket) => (
          <Rocket key={rocket.id} data={rocket} />
        ))}
      </div>
    </div>
  )
}
