import type { ListOrder } from '@stardust/core/global/types'

import * as Select from '@/ui/global/widgets/components/Select'
import { usePriceOrderSelect } from './usePriceOrderSelect'

type SortersProps = {
  onPriceOrderChange: (listOrder: ListOrder) => void
}

export function PriceOrderSelect({ onPriceOrderChange }: SortersProps) {
  const { priceOrder, handleListOrderSelectChange } =
    usePriceOrderSelect(onPriceOrderChange)

  return (
    <div className='flex items-center gap-3'>
      <Select.Container
        onValueChange={(value) => handleListOrderSelectChange(value as ListOrder)}
      >
        <Select.Trigger value={priceOrder} />
        <Select.Content>
          <Select.Item value='ascending'>Menor preço</Select.Item>
          <Select.Separator />
          <Select.Item value='descending'>Maior preço</Select.Item>
        </Select.Content>
      </Select.Container>
    </div>
  )
}
