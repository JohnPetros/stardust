import { useSorters } from './useSorters'

import { Select } from '@/app/components/Select'
import { Order } from '@/services/api/types/Order'

type SortersProps = {
  onPriceOrderChange: (order: Order) => void
}

export function Sorters({ onPriceOrderChange }: SortersProps) {
  const { priceOrder, handlePriceOrderSelectChange } =
    useSorters(onPriceOrderChange)

  return (
    <div className="flex items-center gap-3">
      <Select.Container
        onValueChange={(value) => handlePriceOrderSelectChange(value as Order)}
      >
        <Select.Trigger value={priceOrder} />
        <Select.Content>
          <Select.Item value={'ascending'} text={'Menor preço'} />
          <Select.Separator />
          <Select.Item value={'descending'} text={'Maior preço'} />
        </Select.Content>
      </Select.Container>
    </div>
  )
}
