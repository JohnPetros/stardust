'use client'

import type { AvatarDto } from '@stardust/core/shop/dtos'
import type { PaginationResponse } from '@stardust/core/global/responses'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Search } from '@/ui/global/widgets/components/Search'
import { Pagination } from '@/ui/global/widgets/components/Pagination'
import { AvatarItem } from './AvatarItem'
import { useAvatarsList } from './useAvatarsList'
import { PriceOrderSelect } from '../PriceOrderSelect'

type AvatarsListProps = {
  initialItems: PaginationResponse<AvatarDto>
}

export function AvatarsList({ initialItems }: AvatarsListProps) {
  const {
    page,
    AvatarsDto,
    totalAvatarsCount,
    avatarsPerPage,
    handlePageChange,
    handleSearchChange,
    handlePriceOrderChange,
  } = useAvatarsList(initialItems)

  const { user } = useAuthContext()

  return (
    <section id='avatars'>
      <h2 className='text-lg font-semibold text-white'>Avatares</h2>
      <div className='mt-3 flex flex-col gap-3 sm:flex-row sm:items-center'>
        <Search
          id='Avatar-search'
          placeholder='Pesquisar foguete'
          onSearchChange={handleSearchChange}
          className='max-w-[20rem]'
        />
        <PriceOrderSelect onPriceOrderChange={handlePriceOrderChange} />
      </div>

      {user && (
        <ul className='mt-6 grid grid-cols-1 content-start justify-center gap-8 pb-12 sm:grid-cols-2 md:h-[90rem] lg:grid-cols-2'>
          {AvatarsDto.map(
            (dto) =>
              dto.id && (
                <li key={dto.id}>
                  <AvatarItem
                    id={dto.id}
                    image={dto.image}
                    name={dto.name}
                    price={dto.price}
                    isAcquired={user.hasAcquiredAvatar(dto.id)}
                    isBuyable={user.canBuy(dto.price).isTrue}
                    isSelected={user.isSelectAvatar(dto.id)}
                  />
                </li>
              ),
          )}
        </ul>
      )}

      {totalAvatarsCount && (
        <div className='mt-3'>
          <Pagination
            totalItemsCount={totalAvatarsCount}
            page={page}
            itemsPerPage={avatarsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </section>
  )
}
