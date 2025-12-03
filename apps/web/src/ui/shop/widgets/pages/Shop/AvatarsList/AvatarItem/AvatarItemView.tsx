import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { ShopButton } from '../../ShopButton'
import { AnimatedItem } from '../../AnimatedItem'
import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  image: string
  name: string
  price: number
  isAcquired: boolean
  isBuyable: boolean
  isSelected: boolean
  onAcquire: () => Promise<boolean>
}
export function AvatarItemView({
  name,
  image,
  price,
  isAcquired,
  isBuyable,
  isSelected,
  onAcquire,
}: Props) {
  return (
    <AnimatedItem>
      <div
        className={twMerge(
          'grid grid-cols-[1fr_1.4fr] overflow-hidden rounded-md border-2',
          isSelected ? 'border-yellow-300' : 'border-transparent',
          isAcquired ? 'brightness-100' : 'brightness-50',
        )}
      >
        <div className='flex flex-col justify-between bg-gray-800 p-6'>
          <div className='flex flex-col gap-2'>
            {!isAcquired && price > 0 && (
              <div className=' z-30 flex items-center gap-2'>
                <Image src='/icons/coin.svg' width={24} height={24} alt='' />
                <strong className='text-lg font-semibold text-gray-100'>{price}</strong>
              </div>
            )}
            <strong className='text-gray-100'>{name}</strong>
          </div>

          <ShopButton
            isAcquired={isAcquired}
            isBuyable={isBuyable}
            isSelected={isSelected}
            product={{ image, name }}
            onItemAcquire={onAcquire}
          />
        </div>

        <div className='relative h-64'>
          {!isAcquired && (
            <div className='absolute right-3 top-3 z-30'>
              <Icon name='lock' className='text-xl text-gray-800' weight='bold' />
            </div>
          )}

          <Image
            src={image}
            fill
            alt={name}
            className='skeleton object-cover'
            sizes='(min-width: 375px) 100vw'
            onLoad={(image) => image.currentTarget.classList.remove('skeleton')}
          />
        </div>
      </div>
    </AnimatedItem>
  )
}
