'use client'

import type { RocketDto } from '#dtos'
import type { PaginationResponse } from '@/@core/responses'

import { useAuthContext } from '@/ui/global/contexts/AuthContext'
import { Search } from '@/ui/global/components/shared/Search'
import { Pagination } from '@/ui/global/components/shared/Pagination'
import { RocketItem } from './RocketItem'
import { PriceOrderSelect } from '../PriceOrderSelect'
import { useRocketsList } from './useRocketsList'

type RocketsListProps = {
  initialItems: PaginationResponse<RocketDto>
}

export function RocketsList({ initialItems }: RocketsListProps) {
  const {
    handlePriceOrderChange,
    handleSearchChange,
    setOffset,
    offset,
    totalRockets,
    rocketsPerPage,
    rocketsDto,
  } = useRocketsList(initialItems)

  const { user } = useAuthContext()

  return (
    <section id='rockets'>
      <h2 className=' text-lg font-semibold text-white'>Foguetes</h2>
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
                    isBuyable={user.canBuy(dto.price)}
                    isSelected={user.isSelectRocket(dto.id)}
                  />
                </li>
              ),
          )}
        </ul>
      )}

      {totalRockets && (
        <div className='mt-3'>
          <Pagination
            totalItems={totalRockets}
            itemsPerPage={rocketsPerPage}
            offset={offset}
            setOffset={setOffset}
          />
        </div>
      )}
    </section>
  )
}
