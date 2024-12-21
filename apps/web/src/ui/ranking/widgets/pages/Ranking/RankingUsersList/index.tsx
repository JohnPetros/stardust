import { Icon } from '@/ui/global/widgets/components/Icon'
import { useRankingContext } from '@/ui/ranking/contexts/RankingContext'
import { RankingUser } from './RankingUser'
import { Ranking } from '@/@core/domain/structs'

const ICON_SIZE = 16

export function RankingUsersList() {
  const { ranking } = useRankingContext()

  if (!ranking) return

  const losersPositionOffset = ranking.users.length - Ranking.LOSERS_COUNT

  return (
    <ul className='mx-auto mt-6 flex max-w-2xl flex-col items-center gap-2 w-full'>
      {ranking.users.map((user) => {
        return (
          <li key={user.id} className='w-full'>
            <RankingUser
              id={user.id}
              name={user.name.value}
              avatarImage={user.avatar.image.value}
              avatarName={user.avatar.name.value}
              xp={user.xp.value}
              losersPositionOffset={losersPositionOffset}
              position={user.rankingPosition.position.value}
            />
            {user.rankingPosition.isWinnersPositionOffset && (
              <div className='mt-2 flex items-center justify-center gap-2 w-full'>
                <Icon name='arrow-up' size={ICON_SIZE} className='text-green-500' />
                <p className='text-green-500'>Zona de promoção</p>
                <Icon name='arrow-up' size={ICON_SIZE} className='text-green-500' />
              </div>
            )}
            {user.rankingPosition.isLosersPositionOffset(losersPositionOffset) && (
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
