'use client'

import { Avatar } from './components/Avatar'
import { RocketsSection } from './components/RocketsSection'

import { Loading } from '@/app/components/Loading'
import { useAvatar } from '@/hooks/useAvatar'

export default function Shop() {
  const { avatars, addUserAcquiredAvatar } = useAvatar()

  return (
    <div className="mx-auto max-w-5xl px-6">
      <>
        <RocketsSection />

        <h2 className="mt-8 text-lg font-semibold text-white">Avatares</h2>
        <div className="mt-3 grid grid-cols-1 justify-center gap-8 pb-12 sm:grid-cols-2 lg:grid-cols-2">
          {avatars.map((avatar) => (
            <Avatar
              key={avatar.id}
              data={avatar}
              addUserAcquiredAvatar={addUserAcquiredAvatar}
            />
          ))}
        </div>
      </>

      {/* {!rockets.length && <Loading isSmall={false} />} */}
    </div>
  )
}
