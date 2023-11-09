'use client'

import { useState } from 'react'

import { Avatar } from './Avatar'
import { Sorters } from './Sorters'

import type { Order } from '@/@types/order'
import { Pagination } from '@/app/components/Pagination'
import { Search } from '@/app/components/Search'
import { useAvatarsList } from '@/hooks/useAvatarsList'

const ITEMS_PER_PAGE = 8

export function AvatarsSection() {
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('s')
  const [priceOrder, setPriceOrder] = useState<Order>('ascending')

  const { avatars, count, addUserAcquiredAvatar } = useAvatarsList({
    offset,
    limit: ITEMS_PER_PAGE,
    search,
    priceOrder,
  })

  function handleSearchChange(value: string) {
    if (value.length) setSearch(value)
  }

  function handlePriceOrderChange(value: Order) {
    setPriceOrder(value)
  }

  return (
    <section id="avatars">
      <h2 className=" text-lg font-semibold text-white">Avatares</h2>
      <div className=" mt-3 flex items-center gap-3">
        <Search
          placeholder="Pesquisar avatar"
          onSearchChange={handleSearchChange}
          className="max-w-[20rem]"
        />
        <Sorters onPriceOrderChange={handlePriceOrderChange} />
      </div>

      <div className="mt-6 grid h-[72rem] grid-cols-1 items-start justify-center gap-8 pb-12 sm:grid-cols-2 lg:grid-cols-2">
        {avatars.map((avatar) => (
          <Avatar
            key={avatar.id}
            data={avatar}
            addUserAcquiredAvatar={addUserAcquiredAvatar}
          />
        ))}
      </div>

      {count && (
        <div>
          <Pagination
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={count}
            offset={offset}
            setOffset={setOffset}
          />
        </div>
      )}
    </section>
  )
}
