import { Tier } from './Tier'
import type { RankingDTO } from '@/@core/dtos'

type TiersListProps = {
  rankings: RankingDTO[]
}

export function TiersList({ rankings }: TiersListProps) {
  return (
    <div
      style={{ backgroundImage: 'url("/images/space.png")' }}
      className='custom-scrollbar relative z-30 grid grid-cols-[repeat(6,140px)] items-center overflow-x-scroll rounded-md p-4 md:justify-center md:gap-2'
    >
      {rankings?.map(({ id, name, image }, index) => (
        <Tier
          key={id}
          index={index}
          rankingId={id}
          rankingImage={image}
          rankingName={name}
        />
      ))}
    </div>
  )
}
