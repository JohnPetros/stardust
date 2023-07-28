'use client'

import { useRocket } from '@/hooks/useRocket'
import { useAvatar } from '@/hooks/useAvatar'
import { Rocket } from './components/Rocket'
import { Loading } from '@/app/components/Loading'
import { Avatar } from './components/Avatar'

export default function Shop() {
  const { rockets, addUserAcquiredRocket } = useRocket()
  const { avatars, addUserAcquiredAvatar } = useAvatar()

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

        <h2 className="text-white font-semibold text-lg mt-8">Avatares</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 justify-center gap-8 mt-3 pb-12">
          {avatars.map((avatar) => (
            <Avatar
              key={avatar.id}
              data={avatar}
              addUserAcquiredAvatar={addUserAcquiredAvatar}
            />
          ))}
        </div>
      </>

      {!rockets.length && <Loading isSmall={false} />}
    </div>
  )
}
