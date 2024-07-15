'use client'

import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { useApi } from '@/infra/api'
import { AnimatedImage } from './AnimatedImage'
import { AnimatedItem } from '../../AnimatedItem'
import { ShopButton } from '../../ShopButton'
import { useRocketItem } from './useRocketItem'

export type RocketItemProps = {
  id: string
  name: string
  image: string
  price: number
  isAcquired: boolean
  isBuyable: boolean
  isSelected: boolean
}

export function RocketItem({
  id,
  name,
  image,
  price,
  isAcquired,
  isBuyable,
  isSelected,
}: RocketItemProps) {
  const { handleShopButtonClick, handleShopButtonBuy } = useRocketItem({
    id,
    name,
    image,
    price,
  })

  const api = useApi()
  const rocketImage = api.fetchImage('rockets', image)

  return (
    <AnimatedItem>
      <div
        style={{ backgroundImage: 'url("/images/space.png")' }}
        className={twMerge(
          ' rounded-md border-2 bg-cover bg-center p-6',
          !isAcquired && !isBuyable && 'brightness-75',
          isSelected && 'border-yellow-300'
        )}
      >
        <header className='flex justify-between'>
          <div className='flex flex-col'>
            <strong className=' gap-1 text-lg font-semibold text-gray-100'>{name}</strong>
            <span className='h-1 w-full rounded bg-yellow-300' />
          </div>

          {!isAcquired && price > 0 && (
            <div className='flex items-center gap-2'>
              <Image src='/icons/coin.svg' width={24} height={24} alt='' />
              <span className='text-lg font-semibold text-gray-100'>{price}</span>
            </div>
          )}
        </header>

        <AnimatedImage isSelected={isSelected}>
          <Image src={rocketImage} fill sizes='(min-width: 375px) 100vw' alt={name} />
        </AnimatedImage>

        <footer className='flex items-center justify-between'>
          <div className='flex gap-1'>
            {Array.from({ length: 5 }).map((_, index) => {
              const isFilled = index + 1 <= 2
              return (
                <span key={`${id + index}`}>
                  {isFilled ? (
                    <Image src='/icons/filled-star.svg' width={18} height={18} alt='' />
                  ) : (
                    <Image src='/icons/empty-star.svg' width={18} height={18} alt='' />
                  )}
                </span>
              )
            })}
          </div>

          <ShopButton
            isAcquired={isAcquired}
            isBuyable={isBuyable}
            isSelected={isSelected}
            product={{ image: rocketImage, name }}
            onClick={handleShopButtonClick}
            onBuy={handleShopButtonBuy}
          />
        </footer>
      </div>
    </AnimatedItem>
  )
}
