'use client'

import { useState } from 'react'

import { Rocket } from './Rocket'
import { Sorters } from './Sorters'

import type { Order } from '@/@types/order'
import { Pagination } from '@/app/components/Pagination'
import { Search } from '@/app/components/Search'
import { useRocketsList } from '@/hooks/useRocketsList'

const ITEMS_PER_PAGE = 6

export function RocketsSection() {
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('s')
  const [priceOrder, setPriceOrder] = useState<Order>('ascending')

  const { rockets, addUserAcquiredRocket, count } = useRocketsList({
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
    <section id="rockets">
      <h2 className=" text-lg font-semibold text-white">Foguetes</h2>
      <div className="mt-3 flex items-center gap-3">
        <Search
          placeholder="Pesquisar foguete"
          onSearchChange={handleSearchChange}
          className="max-w-[20rem]"
        />
        <Sorters onPriceOrderChange={handlePriceOrderChange} />
      </div>

      <div className="mt-6 grid h-[38rem] grid-cols-1 items-start justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rockets.map((rocket) => (
          <Rocket
            key={rocket.id}
            data={rocket}
            addUserAcquiredRocket={addUserAcquiredRocket}
          />
        ))}
      </div>

      {count && (
        <div className="mt-3">
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
