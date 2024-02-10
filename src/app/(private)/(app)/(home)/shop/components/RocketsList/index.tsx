'use client'

import { Sorters } from '../Sorters'

import { RocketItem } from './RocketItem'
import { useRocketsList } from './useRocketsList'

import { Pagination } from '@/global/components/Pagination'
import { Search } from '@/global/components/Search'

const ITEMS_PER_PAGE = 6

export function RocketsList() {
  const {
    handlePriceOrderChange,
    handleSearchChange,
    addUserAcquiredRocket,
    setOffset,
    offset,
    count,
    rockets,
  } = useRocketsList()

  return (
    <section id="rockets">
      <h2 className=" text-lg font-semibold text-white">Foguetes</h2>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Search
          id="rocket-search"
          placeholder="Pesquisar foguete"
          onSearchChange={handleSearchChange}
          className="max-w-[20rem]"
        />
        <Sorters onPriceOrderChange={handlePriceOrderChange} />
      </div>

      <div className="mt-6 grid min-h-[36rem] grid-cols-1 items-start justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rockets.map((rocket) => (
          <RocketItem
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
