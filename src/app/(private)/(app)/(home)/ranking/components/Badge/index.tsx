import { getImage } from '@/utils/functions'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

interface BadgeProps {
  index: number
  name: string
  image: string
  currentRankingIndex: number
}

export function Badge({ index, name, image, currentRankingIndex }: BadgeProps) {
  const rankingImage = getImage('rankings', image)
  const isCurrentRanking = currentRankingIndex === index
  const isLocked = index > currentRankingIndex

  return (
    <div
      className={twMerge(
        'relative  flex flex-col items-center justify-center gap-2',
        isLocked ? 'brightness-75 opacity-75' : 'brightness-100 opacity-100'
      )}
    >
      <Image src={rankingImage} width={100} height={100} alt="" />

      {isLocked && (
        <div className="absolute top-9">
          <Image
            src="/icons/lock.svg"
            width={32}
            height={32}
            alt="Ranking bloqueado"
          />
        </div>
      )}

      {isCurrentRanking && (
        <strong className="text-lg text-gray-100 font-semibold">{name}</strong>
      )}
    </div>
  )
}
