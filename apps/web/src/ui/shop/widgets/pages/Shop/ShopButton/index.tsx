'use client'

import { useShopButton } from './useShopButton'
import { ShopButtonView } from './ShopButtonView'

type Product = {
  image: string
  name: string
}

type Props = {
  isSelected: boolean | null
  isAcquired: boolean
  isBuyable: boolean
  product: Product
  onItemAcquire: () => Promise<boolean>
}

export const ShopButton = ({
  isAcquired,
  isSelected,
  isBuyable,
  product,
  onItemAcquire,
}: Props) => {
  const { isLoading, handleShopButtonClick, handleAlertOpenChange } =
    useShopButton(onItemAcquire)

  return (
    <ShopButtonView
      isLoading={isLoading}
      isAcquired={isAcquired}
      isSelected={isSelected}
      isBuyable={isBuyable}
      product={product}
      onClick={handleShopButtonClick}
      onAlertOpenChange={handleAlertOpenChange}
    />
  )
}
