import { RANKING } from '@/@core/domain/constants'
import { RankingPosition } from '@/@core/domain/structs'
import type { RankingUserDTO } from '@/@core/dtos'

import { Icon } from '@/modules/global/components/shared/Icon'
import { RankingUser } from './RankingUser'

const ICON_SIZE = 16

type UserListProps = {
  rankingUsers: RankingUserDTO[]
}

export function RankingUsersList({ rankingUsers }: UserListProps) {
  const losersPositionOffset = rankingUsers.length - RANKING.losersCount

  return (
    <ul className='mx-auto mt-6 flex max-w-2xl flex-col items-center gap-2 w-full'>
      {rankingUsers.map((user, index) => {
        const rankingPosition = RankingPosition.create(index + 1)
        return (
          <li key={user.id} className='w-full'>
            <RankingUser
              id={user.id}
              name={user.name}
              avatarImage={user.avatar.image}
              avatarName={user.avatar.name}
              losersPositionOffset={losersPositionOffset}
              weeklyXp={user.weeklyXp}
              position={rankingPosition.position.value}
            />
            {rankingPosition.isWinnersPositionOffset && (
              <div className='mt-2 flex items-center justify-center gap-2 w-full'>
                <Icon name='arrow-up' size={ICON_SIZE} className='text-green-500' />
                <p className='text-green-500'>Zona de promoção</p>
                <Icon name='arrow-up' size={ICON_SIZE} className='text-green-500' />
              </div>
            )}
            {rankingPosition.isLosersPositionOffset(losersPositionOffset) && (
              <div className='mt-2 flex items-center justify-center gap-2 w-full'>
                <Icon name='arrow-down' size={ICON_SIZE} className='text-red-700' />
                <p className='text-red-700'>Zona de rebaixamento</p>
                <Icon name='arrow-down' size={ICON_SIZE} className='text-red-700' />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
