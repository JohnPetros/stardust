import { Search } from '@/ui/global/widgets/components/Search'
import { Pagination } from '@/ui/global/widgets/components/Pagination'
import { AvatarItem } from './AvatarItem'
import { PriceOrderSelect } from '../PriceOrderSelect'
import type { Avatar } from '@stardust/core/shop/entities'
import type { ListingOrder } from '@stardust/core/global/structures'

type Props = {
  totalAvatarsCount: number
  avatarsPerPage: number
  page: number
  avatars: Avatar[]
  onSearchChange: (value: string) => void
  onPriceOrderChange: (ListingOrder: ListingOrder) => void
  onPageChange: (value: number) => void
}

export const AvatarsListView = ({
  totalAvatarsCount,
  avatarsPerPage,
  page,
  avatars,
  onSearchChange,
  onPriceOrderChange,
  onPageChange,
}: Props) => {
  return (
    <section id='avatars'>
      <h2 className='text-lg font-semibold text-white'>Avatares</h2>
      <div className='mt-3 flex flex-col gap-3 sm:flex-row sm:items-center'>
        <Search
          id='avatar-search'
          placeholder='Pesquisar avatar'
          onSearchChange={onSearchChange}
          className='max-w-[20rem]'
        />
        <PriceOrderSelect onPriceOrderChange={onPriceOrderChange} />
      </div>

      <ul className='mt-6 grid grid-cols-1 content-start justify-center gap-8 pb-12 sm:grid-cols-2 md:h-[90rem] lg:grid-cols-2'>
        {avatars.map((avatar) => {
          return (
            <li key={avatar.id.value}>
              <AvatarItem
                id={avatar.id.value}
                image={avatar.image.value}
                name={avatar.name.value}
                price={avatar.price.value}
              />
            </li>
          )
        })}
      </ul>

      {totalAvatarsCount && (
        <div className='mt-3'>
          <Pagination
            totalItemsCount={totalAvatarsCount}
            page={page}
            itemsPerPage={avatarsPerPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </section>
  )
}
