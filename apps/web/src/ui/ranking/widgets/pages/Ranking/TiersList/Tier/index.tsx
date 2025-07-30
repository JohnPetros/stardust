'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { twMerge } from 'tailwind-merge'

import { useImage } from '@/ui/global/hooks/useImage'
import { useTier } from './useTier'
import { AnimatedImage } from './AnimatedImage'

type TierProps = {
  index: number
  rankingId: string
  rankingName: string
  rankingImage: string
}

export function Tier({ index, rankingId, rankingName, rankingImage }: TierProps) {
  const tierRef = useRef<HTMLDivElement | null>(null)
  const { isLocked, isFromCurrentTier } = useTier(tierRef, rankingId, index)
  const imageSrc = useImage('rankings', rankingImage)

  return (
    <div
      ref={tierRef}
      className={twMerge(
        'relative flex flex-col items-center justify-center gap-2',
        isLocked ? 'opacity-75 brightness-75' : 'opacity-100 brightness-100',
      )}
    >
      <AnimatedImage isLocked={isLocked}>
        <Image src={imageSrc} width={80} height={80} alt='' />
      </AnimatedImage>

      {isLocked && (
        <div className='absolute top-4'>
          <Image src='/icons/lock.svg' width={24} height={24} alt='Ranking bloqueado' />
        </div>
      )}

      {isFromCurrentTier && (
        <strong className='text-center font-semibold text-gray-100 md:text-lg'>
          {rankingName}
        </strong>
      )}
    </div>
  )
}
