import { ArrowDown, ArrowUp } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { RankedUser } from './RankedUser'

import type { User } from '@/@types/User'

const iconSize = 'text-md'

interface UserListProps {
  rankedUsers: User[]
  authUserId: string
}

export function RankedUsersList({ rankedUsers, authUserId }: UserListProps) {
  const lastPositionsOffset = rankedUsers.length - 5

  return (
    <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-2">
      {rankedUsers.map((user, index) => {
        const position = index + 1
        return (
          <>
            <RankedUser
              data={user}
              position={index + 1}
              lastPositionsOffset={lastPositionsOffset}
              isAuthUser={user.id === authUserId}
            />
            {position === 5 && (
              <div className="mt-2 flex items-center gap-2">
                <ArrowUp className={twMerge(iconSize, 'text-green-500')} />
                <p className="text-green-500">Zona de promoção</p>
                <ArrowUp className={twMerge(iconSize, 'text-green-500')} />
              </div>
            )}
            {position === lastPositionsOffset && (
              <div className="mt-2 flex items-center gap-2">
                <ArrowDown className={twMerge(iconSize, 'text-red-700')} />
                <p className="text-red-700">Zona de rebaixamento</p>
                <ArrowDown className={twMerge(iconSize, 'text-red-700')} />
              </div>
            )}
          </>
        )
      })}
    </div>
  )
}
