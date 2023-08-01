'use client'
import { useEffect, useState } from 'react'

import { Search } from '@/app/components/Search'
import * as Dropdown from '@radix-ui/react-dropdown-menu'

import type { Category } from '@/types/category'

interface CategoriesProps {
  data: Category[]
}

export function CategoriesFilter({ data }: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')

  function removeAccentuation(word: string) {
    return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

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
      <Dropdown.Trigger className="flex items-center gap-2 rounded-md overflow-hidden text-green-500 p-2 bg-gray-800 border border-gray-400">
        Categorias
      </Dropdown.Trigger>

      <Dropdown.Portal>
        <Dropdown.Content className="flex flex-col items-center gap-2 px-3 py-3 bg-gray-700 rounded-md overflow-hidden w-64">
          <Search onChange={({ target }) => handleSearchChange(target.value)} />
          <Dropdown.Group className="flex flex-wrap justify-start gap-2 px-2 py-3">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Dropdown.Item
                  key={category.id}
                  className="bg-gray-400 text-gray-900 font-semibold p-1 rounded-md text-xs cursor-pointer outline-none hover:brightness-110"
                >
                  {category.name.toLowerCase()}
                </Dropdown.Item>
              ))
            ) : (
              <p className="text-red-700 text-sm font-medium">
                Nenhuma categoria encontrada
              </p>
            )}
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  )
}
