'use client'
import { useEffect, useState } from 'react'
import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { twMerge } from 'tailwind-merge'

import type { Category } from '@/@types/category'
import { Search } from '@/app/components/Search'
import { useChallengesList } from '@/hooks/useChallengesList'
import { removeAccentuation } from '@/utils/helpers'

interface CategoriesProps {
  data: Category[]
}

export function CategoriesFilter({ data }: CategoriesProps) {
  const { state, dispatch } = useChallengesList()
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')

  function filterCategories() {
    if (!search) {
      return data
    }

    return data.filter((category) =>
      removeAccentuation(category.name.toLowerCase()).includes(
        removeAccentuation(search.toLowerCase())
      )
    )
  }

  function handleCategoryClick(categoryId: string, isActive: boolean) {
    let categoriesIds = state.categoriesIds

    if (isActive) {
      categoriesIds = categoriesIds.filter((id) => id !== categoryId)
    } else {
      categoriesIds = [...categoriesIds, categoryId]
    }

    dispatch({ type: 'setCategoriesIds', payload: categoriesIds })
  }

  function handleSearchChange(search: string) {
    setSearch(search)
  }

  useEffect(() => {
    setCategories(data)
  }, [data])

  useEffect(() => {
    const filteredCategories = filterCategories()
    setCategories(filteredCategories)
  }, [search])

  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="flex items-center gap-2 overflow-hidden rounded-md border border-gray-400 bg-gray-800 p-2 text-sm text-green-500">
        Categorias
      </Dropdown.Trigger>

      <Dropdown.Portal>
        <Dropdown.Content className="flex w-64 flex-col items-center gap-2 overflow-hidden rounded-md bg-gray-700 px-3 py-3">
          <Search onChange={({ target }) => handleSearchChange(target.value)} />
          <Dropdown.Group className="flex flex-wrap justify-start gap-2 px-2 py-3">
            {categories.length > 0 ? (
              categories.map((category) => {
                const isActive = state.categoriesIds.includes(category.id)
                return (
                  <Dropdown.Item
                    key={category.id}
                    className={twMerge(
                      ' cursor-pointer rounded-md p-1 text-xs font-semibold outline-none hover:brightness-110',
                      isActive
                        ? 'bg-green-800 text-gray-100'
                        : 'bg-gray-400 text-gray-900'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(category.id, isActive)}
                    >
                      {category.name.toLowerCase()}
                    </button>
                  </Dropdown.Item>
                )
              })
            ) : (
              <p className="text-sm font-medium text-red-700">
                Nenhuma categoria encontrada
              </p>
            )}
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  )
}
