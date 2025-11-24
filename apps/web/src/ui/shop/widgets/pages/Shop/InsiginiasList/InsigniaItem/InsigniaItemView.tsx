import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { Tooltip } from '@/ui/global/widgets/components/Tooltip'
import { AnimatedItem } from '../../AnimatedItem'
import { ShopButton } from '../../ShopButton'

type Props = {
  image: string
  name: string
  description: string
  price: number
  isAcquired: boolean
  isBuyable: boolean
  onAcquire: () => Promise<boolean>
}

export const InsigniaItemView = ({
  image,
  name,
  description,
  price,
  isAcquired,
  isBuyable,
  onAcquire,
}: Props) => {
  return (
    <AnimatedItem>
      <div
        className={twMerge(
          'flex flex-col gap-6 p-6 rounded-md border-2 h-[24rem]',
          !isAcquired && !isBuyable && 'brightness-50',
          isAcquired && 'border-yellow-300',
        )}
      >
        <header className='flex justify-between'>
          <div className='flex flex-col'>
            <strong className='text-md font-semibold text-gray-100'>{name}</strong>
            <span className='h-1 w-full rounded bg-yellow-300' />
          </div>

          {!isAcquired && price > 0 && (
            <div className='flex items-center gap-2'>
              <Image src='/icons/coin.svg' width={24} height={24} alt='' />
              <span className='text-lg font-semibold text-gray-100'>{price}</span>
            </div>
          )}
        </header>

        <div className='relative flex-1 w-full bg-gray-400 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10'>
          <Image src={image} fill sizes='(min-width: 375px) 100vw' alt={name} />
        </div>

        <footer className='flex items-center justify-between w-full'>
          <Tooltip content={description} direction='top'>
            <p className='text-sm font-semibold text-gray-100'>
              O que esta insígnia faz?
            </p>
          </Tooltip>
          <ShopButton
            isAcquired={isAcquired}
            isBuyable={isBuyable}
            isSelected={null}
            product={{ image, name }}
            onItemAcquire={onAcquire}
          />
        </footer>
      </div>
    </AnimatedItem>
  )
}
