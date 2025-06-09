import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { twMerge } from 'tailwind-merge'

import type { ChallengeCategory } from '@stardust/core/challenging/entities'

import { Search } from '@/ui/global/widgets/components/Search'
import { useCategoriesFilter } from './useCategoriesFilter'

type CategoriesProps = {
  initialCategories: ChallengeCategory[]
}

export const CategoriesFilterView = ({ initialCategories }: CategoriesProps) => {
  const {
    searchRef,
    categories,
    categoriesIds,
    handleCategoryClick,
    handleSearchChange,
  } = useCategoriesFilter(initialCategories)

  return (
    <Dropdown.Root>
      <Dropdown.Trigger className='flex items-center gap-2 overflow-hidden rounded-md border border-gray-400 bg-gray-800 p-2 text-sm text-green-500'>
        Categorias
      </Dropdown.Trigger>

      <Dropdown.Portal>
        <Dropdown.Content className='flex w-64 flex-col items-center gap-2 overflow-hidden rounded-md bg-gray-700 px-3 py-3'>
          <Search
            ref={searchRef}
            id='categories-search'
            onSearchChange={handleSearchChange}
          />
          <Dropdown.Group className='flex flex-wrap justify-start gap-2 px-2 py-3'>
            {categories.length > 0 ? (
              categories.map((category) => {
                const isActive = categoriesIds.includes(category.id.value)
                return (
                  <Dropdown.Item
                    key={category.id.value}
                    className={twMerge(
                      ' cursor-pointer rounded-md p-1 text-xs font-semibold outline-none hover:brightness-110',
                      isActive
                        ? 'bg-green-800 text-gray-100'
                        : 'bg-gray-400 text-gray-900',
                    )}
                  >
                    <button
                      type='button'
                      onClick={() => handleCategoryClick(category.id.value, isActive)}
                    >
                      {category.name.value.toLowerCase()}
                    </button>
                  </Dropdown.Item>
                )
              })
            ) : (
              <p className='text-sm font-medium text-red-700'>
                Nenhuma categoria encontrada
              </p>
            )}
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  )
}
