'use client'

import type { PaginationResponse } from '@stardust/core/responses'
import type { RocketDto } from '@stardust/core/shop/dtos'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Search } from '@/ui/global/widgets/components/Search'
import { Pagination } from '@/ui/global/widgets/components/Pagination'
import { RocketItem } from './RocketItem'
import { PriceOrderSelect } from '../PriceOrderSelect'
import { useRocketsList } from './useRocketsList'

type RocketsListProps = {
  initialItems: PaginationResponse<RocketDto>
}

export function RocketsList({ initialItems }: RocketsListProps) {
  const {
    totalRocketsCount,
    rocketsPerPage,
    rocketsDto,
    page,
    handlePageChange,
    handlePriceOrderChange,
    handleSearchChange,
  } = useRocketsList(initialItems)
  const { user } = useAuthContext()

  return (
    <section id='rockets'>
      <h2 className='text-lg font-semibold text-white'>Foguetes</h2>
      <div className='mt-3 flex flex-col gap-3 sm:flex-row sm:items-center'>
        <Search
          id='rocket-search'
          placeholder='Pesquisar foguete'
          onSearchChange={handleSearchChange}
          className='max-w-[20rem]'
        />
        <PriceOrderSelect onPriceOrderChange={handlePriceOrderChange} />
      </div>

      {user && (
        <ul className='mt-6 grid min-h-[36rem] grid-cols-1 items-start justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {rocketsDto.map(
            (dto) =>
              dto.id && (
                <li key={dto.id}>
                  <RocketItem
                    id={dto.id}
                    image={dto.image}
                    name={dto.name}
                    price={dto.price}
                    isAcquired={user.hasAcquiredRocket(dto.id)}
                    isBuyable={user.canBuy(dto.price).isTrue}
                    isSelected={user.isSelectRocket(dto.id)}
                  />
                </li>
              ),
          )}
        </ul>
      )}

      {totalRocketsCount && (
        <div className='mt-3'>
          <Pagination
            totalItemsCount={totalRocketsCount}
            page={page}
            itemsPerPage={rocketsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </section>
  )
}
