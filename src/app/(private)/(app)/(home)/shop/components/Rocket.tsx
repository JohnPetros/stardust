import { Button } from '@/app/components/Button'
import { useAuth } from '@/hooks/useAuth'
import { Rocket } from '@/types/rocket'
import { getImage } from '@/utils/functions'
import Image from 'next/image'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface RocketProps {
  data: Rocket
}

export function Rocket({
  data: { name, price, image, isAcquired },
}: RocketProps) {
  const { user } = useAuth()
  if (!user) return null

  const [isSelected, setIsSelected] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)

  const prestigeLevel = 2
  const rocketImage = getImage('rockets', image)
  const isBuyable = user?.coins >= price

  return (
    <div
      style={{ backgroundImage: 'url("/images/space-background.png")' }}
      className={twMerge(
        'rounded-md p-6 bg-center bg-cover',
        !isAcquired ? 'brightness-75' : ''
      )}
    >
      <header className="flex justify-between">
        <div className="flex flex-col">
          <strong className=" font-semibold text-gray-100 text-lg gap-1">
            {name}
          </strong>
          <span className="w-full h-1 bg-yellow-300"></span>
        </div>

        <div className="flex items-center gap-2">
          <Image src="/icons/coin.svg" width={24} height={24} alt="" />
          <span className="font-semibold text-gray-100 text-lg">{price}</span>
        </div>
      </header>

      <div className="relative w-28 h-28 mx-auto my-6">
        <Image src={rocketImage} fill alt={name} />
      </div>

      <footer className="flex items-center justify-between">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, index) => {
            const isFilled = index + 1 <= prestigeLevel

            return (
              <Image
                src="/icons/star.svg"
                width={18}
                height={18}
                className={isFilled ? 'fill-yellow-300' : 'fill-gray-500'}
                alt=""
              />
            )
          })}
        </div>

        <Button className="bg-yellow-300 w-max py-1 px-3">
          {isSelected && isAcquired
            ? 'Selecionado'
            : isAcquired
            ? 'Selecionar'
            : 'Comprar'}
        </Button>
      </footer>
    </div>
  )
}
