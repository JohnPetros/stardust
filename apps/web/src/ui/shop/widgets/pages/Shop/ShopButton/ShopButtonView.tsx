'use client'

import Image from 'next/image'

import { Button } from '@/ui/global/widgets/components/Button'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Animation } from '@/ui/global/widgets/components/Animation'

type Product = {
  image: string
  name: string
}

type Props = {
  isLoading: boolean
  isSelected: boolean | null
  isAcquired: boolean
  isBuyable: boolean
  product: Product
  onClick: () => void
  onAlertOpenChange: (isOpen: boolean) => void
}

export const ShopButtonView = ({
  isLoading,
  isAcquired,
  isSelected,
  isBuyable,
  product,
  onClick,
  onAlertOpenChange,
}: Props) => {
  if (isSelected && isAcquired) {
    return (
      <Button className='h-8 w-max bg-yellow-300 px-3 py-1 pointer-events-none'>
        Selecionado
      </Button>
    )
  }

  if (isSelected === null && isAcquired) {
    return (
      <Button className='h-8 w-max bg-yellow-300 px-3 py-1 pointer-events-none'>
        Adquirido
      </Button>
    )
  }

  if (isAcquired) {
    return (
      <Button
        className='h-8 w-max bg-yellow-300 px-3 py-1'
        isLoading={isLoading}
        onClick={onClick}
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
        onOpenChange={onAlertOpenChange}
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
        <Button onClick={onClick} className='h-8 w-max bg-yellow-300 px-3 py-1'>
          Comprar
        </Button>
      </AlertDialog>
    )
  }

  return (
    <AlertDialog
      type='denying'
      title='Parece que você não tem StarCoins o suficiente'
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
