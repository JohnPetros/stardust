type Props = {
  id: string
  image: string
  name: string
  price: number
  isAcquired: boolean
  isBuyable: boolean
  isSelected: boolean
  onAcquire: () => Promise<boolean>
}

export const InsigniaItem = ({
  id,
  image,
  name,
  price,
  isAcquired,
  isBuyable,
  isSelected,
  onAcquire,
}: Props) => {
  return <div></div>
}
