'use client'

import Lottie from 'lottie-react'
import Image from 'next/image'

import RewardLightAnimation from '../../../../../../../../public/animations/reward-shinning.json'

import { useShopButton } from './useShopButton'

import { Alert } from '@/global/components/Alert'
import { Button } from '@/global/components/Button'

type Product = {
  image: string
  name: string
}

interface ShopButtonProps {
  isSelected: boolean
  isAcquired: boolean
  isBuyable: boolean
  shopHandler: () => Promise<void>
  onSuccess: () => void
  product: Product
}

export function ShopButton({
  isAcquired,
  isSelected,
  isBuyable,
  shopHandler,
  onSuccess,
  product,
}: ShopButtonProps) {
  const { isLoading, handleShopButton } = useShopButton(shopHandler)

  return isSelected && isAcquired ? (
    <Button className="h-8 w-max bg-yellow-300 px-3 py-1">Selecionado</Button>
  ) : isAcquired ? (
    <Button
      className="h-8 w-max bg-yellow-300 px-3 py-1"
      onClick={handleShopButton}
      isLoading={isLoading}
    >
      Selecionar
    </Button>
  ) : isBuyable ? (
    <Alert
      type="earning"
      title="Parabéns, você acabou de adquirir um novo item!"
      onClose={onSuccess}
      body={
        <div className="relative flex flex-col items-center justify-center">
          <span className="left-25 absolute -top-2">
            <Lottie
              animationData={RewardLightAnimation}
              loop={true}
              style={{ width: 180 }}
            />
          </span>
          <div className="relative mt-6 h-24 w-24">
            <Image src={product.image} fill alt={product.name} />
          </div>
          <strong className="my-6 text-gray-100">{product.name}</strong>
        </div>
      }
      action={<Button>Entendido</Button>}
    >
      <Button
        onClick={handleShopButton}
        className="h-8 w-max bg-yellow-300 px-3 py-1"
      >
        Comprar
      </Button>
    </Alert>
  ) : (
    <Alert
      type="denying"
      title="Parece que você não tem poeira estelar o suficiente"
      body={
        <p className="my-6 px-6 text-center text-sm font-medium text-gray-100">
          Mas você pode adquirir mais completando estrelas ou resolvendo
          desafios.
        </p>
      }
      action={<Button>Entendido</Button>}
    >
      <Button className="h-8 w-max bg-yellow-300 px-3 py-1">Comprar</Button>
    </Alert>
  )
}
