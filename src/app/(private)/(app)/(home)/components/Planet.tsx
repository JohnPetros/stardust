import Image from 'next/image'
import type { Planet } from '@/types/planet'
import { getImage } from '@/utils/functions'

interface PlanetProps {
  data: Planet
}

export function Planet({ data: { name, image, icon, stars } }: PlanetProps) {
  const planetImage = getImage('planets', image)
  const planetIcon = getImage('planets', icon)

  return (
    <div>
      <div className='flex items-center gap-3'>
        <Image src={planetImage} width={64} height={64} alt={name} />

        <div className="bg-green-800 max-w-sm p-3 flex items-center gap-3 rounded-lg">
          <Image src={planetIcon} width={32} height={32} alt="" />
          <strong className="text-zinc-100 font-semibold">{name}</strong>
        </div>
      </div>
    

    </div>
  )
}
