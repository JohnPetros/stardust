'use client'

import Image from 'next/image'

import { Button } from '@/ui/global/components/shared/Button'
import { AlertDialog } from '@/ui/global/components/shared/AlertDialog'
import { Animation } from '@/ui/global/components/shared/Animation'
import { useShopButton } from './useShopButton'

type Product = {
  image: string
  name: string
}

type ShopButtonProps = {
  isSelected: boolean
  isAcquired: boolean
  isBuyable: boolean
  product: Product
  onClick: () => Promise<void>
  onBuy: () => void
}

export function ShopButton({
  isAcquired,
  isSelected,
  isBuyable,
  product,
  onClick,
  onBuy,
}: ShopButtonProps) {
  const { isLoading, handleShopButtonClick } = useShopButton(onClick)

  if (isSelected && isAcquired) {
    return <Button className='h-8 w-max bg-yellow-300 px-3 py-1'>Selecionado</Button>
  }

  if (isAcquired) {
    return (
      <Button
        className='h-8 w-max bg-yellow-300 px-3 py-1'
        onClick={handleShopButtonClick}
        isLoading={isLoading}
      >
        Selecionar
      </Button>
    )
  }

  if (isBuyable) {
    return (
      <AlertDialog
        type='earning'
        title='Parabéns, você acabou de adquirir um novo item!'
        onOpenChange={(isOpen) => (!isOpen ? onBuy() : null)}
        body={
          <div className='relative flex flex-col items-center justify-center'>
            <span className='left-25 absolute -top-2'>
              <Animation name='shinning' size={180} hasLoop />
            </span>
            <div className='relative mt-6 h-24 w-24'>
              <Image src={product.image} fill alt={product.name} className='rounded-md' />
            </div>
            <strong className='my-6 text-gray-100'>{product.name}</strong>
          </div>
        }
        action={<Button>Entendido</Button>}
      >
        <Button
          onClick={handleShopButtonClick}
          className='h-8 w-max bg-yellow-300 px-3 py-1'
        >
          Comprar
        </Button>
      </AlertDialog>
    )
  }

  return (
    <AlertDialog
      type='denying'
      title='Parece que você não tem poeira estelar o suficiente'
      body={
        <p className='my-6 px-6 text-center text-sm font-medium text-gray-100'>
          Mas você pode adquirir mais completando estrelas ou resolvendo desafios.
        </p>
      }
      action={<Button>Entendido</Button>}
    >
      <Button className='h-8 w-max bg-yellow-300 px-3 py-1'>Comprar</Button>
    </AlertDialog>
  )
}
