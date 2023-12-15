'use client'

import { Avatar } from '../Avatar'
import { Sorters } from '../Sorters'

import { useAvatarsList } from './useAvatarsList'

import { Pagination } from '@/app/components/Pagination'
import { Search } from '@/app/components/Search'

export function AvatarsList() {
  const {
    avatars,
    itemsPerAge,
    offset,
    setOffset,
    addUserAcquiredAvatar,
    handlePriceOrderChange,
    handleSearchChange,
  } = useAvatarsList()

  return (
    <section id="avatars">
      <h2 className=" text-lg font-semibold text-white">Avatares</h2>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Search
          id="avatar-search"
          placeholder="Pesquisar avatar"
          onSearchChange={handleSearchChange}
          className="max-w-[20rem]"
        />
        <Sorters onPriceOrderChange={handlePriceOrderChange} />
      </div>

      <div className="mt-6 grid h-[72rem] grid-cols-1 content-start justify-center gap-8 pb-12 sm:grid-cols-2 lg:grid-cols-2">
        {avatars.map((avatar) => (
          <Avatar
            key={avatar.id}
            data={avatar}
            addUserAcquiredAvatar={addUserAcquiredAvatar}
          />
        ))}
      </div>

      {itemsPerAge && (
        <div>
          <Pagination
            itemsPerPage={itemsPerAge}
            totalItems={itemsPerAge}
            offset={offset}
            setOffset={setOffset}
          />
        </div>
      )}
    </section>
  )
}
