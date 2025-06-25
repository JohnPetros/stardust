import type { Rocket } from '@stardust/core/shop/entities'
import type { ListingOrder } from '@stardust/core/global/structures'

import { Search } from '@/ui/global/widgets/components/Search'
import { Pagination } from '@/ui/global/widgets/components/Pagination'
import { RocketItem } from './RocketItem'
import { PriceOrderSelect } from '../PriceOrderSelect'

type Props = {
  totalRocketsCount: number
  rocketsPerPage: number
  page: number
  rockets: Rocket[]
  onSearchChange: (value: string) => void
  onPriceOrderChange: (ListingOrder: ListingOrder) => void
  onPageChange: (value: number) => void
}

export function RocketsListView({
  totalRocketsCount,
  rocketsPerPage,
  page,
  rockets,
  onSearchChange,
  onPriceOrderChange,
  onPageChange,
}: Props) {
  return (
    <section id='rockets'>
      <h2 className='text-lg font-semibold text-white'>Foguetes</h2>
      <div className='mt-3 flex flex-col gap-3 sm:flex-row sm:items-center'>
        <Search
          id='rocket-search'
          placeholder='Pesquisar foguete'
          onSearchChange={onSearchChange}
          className='max-w-[20rem]'
        />
        <PriceOrderSelect onPriceOrderChange={onPriceOrderChange} />
      </div>

      <ul className='mt-6 grid min-h-[36rem] grid-cols-1 items-start justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {rockets.map((rocket) => (
          <li key={rocket.id.value}>
            <RocketItem
              id={rocket.id.value}
              image={rocket.image.value}
              name={rocket.name.value}
              price={rocket.price.value}
            />
          </li>
        ))}
      </ul>

      {totalRocketsCount && (
        <div className='mt-3'>
          <Pagination
            totalItemsCount={totalRocketsCount}
            page={page}
            itemsPerPage={rocketsPerPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </section>
  )
}
