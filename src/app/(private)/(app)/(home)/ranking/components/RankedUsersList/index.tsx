import { useAuth } from '@/hooks/useAuth'

import { RankedUser } from './RankedUser'

import type { User } from '@/types/user'

import { ArrowDown, ArrowUp } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

const iconSize = 'text-md'

interface UserListProps {
  users: User[]
  authUserId: string
}

export function RankedUsersList({ users, authUserId }: UserListProps) {
  const lastPositionsOffset = users.length - 5

  return (
    <div className="flex flex-col items-center mx-auto mt-6 gap-2 px-6 md:px-0 max-w-2xl">
      {users.map((user, index) => {
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
              <div className="flex items-center gap-2 mt-2">
                <ArrowUp className={twMerge(iconSize, 'text-green-500')} />
                <p className="text-green-500">Zona de promoção</p>
                <ArrowUp className={twMerge(iconSize, 'text-green-500')} />
              </div>
            )}
            {position === lastPositionsOffset && (
              <div className="flex items-center gap-2 mt-2">
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
