import Image from 'next/image'
import type { Planet } from '@/types/planet'
import { getImage } from '@/utils/functions'
import { Star } from './Star'

interface PlanetProps {
  data: Planet
  lastUnlockedStarId: string
}

export function Planet({
  data: { name, image, icon, stars },
  lastUnlockedStarId,
}: PlanetProps) {
  const planetImage = getImage('planets', image)
  const planetIcon = getImage('planets', icon)

  return (
    <li>
      <div className="flex items-center gap-3 ">
        <Image src={planetImage} width={90} height={90} alt={name} />

        <div className="bg-green-800 max-w-sm p-3 flex items-center gap-3 rounded-lg">
          <Image src={planetIcon} width={32} height={32} alt="" />
          <strong className="text-zinc-100 font-semibold">{name}</strong>
        </div>
      </div>

      <ul>
        {stars.map((star) => (
          <Star
            key={star.id}
            data={star}
            isLastUnlockedStar={lastUnlockedStarId === star.id}
          />
        ))}
      </ul>
    </li>
  )
}
