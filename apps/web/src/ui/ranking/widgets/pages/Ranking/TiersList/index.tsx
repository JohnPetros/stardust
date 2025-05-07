import { useRankingContext } from '@/ui/ranking/contexts/RankingContext'
import { Tier } from './Tier'

export function TiersList() {
  const { tiers } = useRankingContext()

  return (
    <div
      style={{ backgroundImage: 'url("/images/space.png")' }}
      className='custom-scrollbar relative z-30 grid grid-cols-[repeat(6,140px)] items-center overflow-x-scroll rounded-md p-4 md:justify-center md:gap-2'
    >
      {tiers.map(({ id, name, image }, index) => (
        <Tier
          key={id.value}
          index={index}
          rankingId={id.value}
          rankingImage={image.value}
          rankingName={name.value}
        />
      ))}
    </div>
  )
}
