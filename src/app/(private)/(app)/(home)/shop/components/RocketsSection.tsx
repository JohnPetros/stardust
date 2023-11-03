'use client'

import React, { useState } from 'react'

import { Rocket } from './Rocket'

import { Pagination } from '@/app/components/Pagination'
import { Search } from '@/app/components/Search'
import { useRocketsList } from '@/hooks/useRocketsList'

const LIMIT = 6

export function RocketsSection() {
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('')

  const { rockets, addUserAcquiredRocket } = useRocketsList({
    offset,
    limit: LIMIT,
    search,
    priceOrder: 'ascending',
  })

  return (
    <section id="rockets">
      <h2 className=" text-lg font-semibold text-white">Foguetes</h2>
      <Search
        value={search}
        onChange={({ target }) => setSearch(target.value)}
        placeholder="Pesquisar foguete"
        className="mt-6"
      />
      <div className="mt-6 grid h-[38rem] grid-cols-1 items-start justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rockets.map((rocket) => (
          <Rocket
            key={rocket.id}
            data={rocket}
            addUserAcquiredRocket={addUserAcquiredRocket}
          />
        ))}
      </div>

      <div className="mt-3">
        <Pagination
          itemsPerPage={LIMIT}
          totalItems={12}
          offset={offset}
          setOffset={setOffset}
        />
      </div>
    </section>
  )
}
