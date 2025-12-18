import { Check } from 'lucide-react'
import type { ChallengeCategoryDto } from '@stardust/core/challenging/entities/dtos'

import { Button } from '@/ui/shadcn/components/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/shadcn/components/popover'
import { Badge } from '@/ui/shadcn/components/badge'

type Props = {
  categories: ChallengeCategoryDto[]
  selectedCategoryIds: string[]
  onCategoriesChange: (categoryIds: string[]) => void
}

export const CategoriesFilterView = ({
  categories,
  selectedCategoryIds,
  onCategoriesChange,
}: Props) => {
  function toggleCategory(categoryId: string) {
    if (selectedCategoryIds.includes(categoryId)) {
      onCategoriesChange(selectedCategoryIds.filter((id) => id !== categoryId))
    } else {
      onCategoriesChange([...selectedCategoryIds, categoryId])
    }
  }

  function clearCategories() {
    onCategoriesChange([])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='w-[200px] justify-between'>
          <span>Categorias</span>
          {selectedCategoryIds.length > 0 && (
            <Badge variant='secondary' className='ml-2'>
              {selectedCategoryIds.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[250px] p-0' align='start'>
        <div className='flex flex-col'>
          <div className='flex items-center justify-between p-3 border-b'>
            <span className='text-sm font-medium'>Filtrar por categorias</span>
            {selectedCategoryIds.length > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={clearCategories}
                className='h-auto p-0 text-xs'
              >
                Limpar
              </Button>
            )}
          </div>
          <div className='max-h-[300px] overflow-y-auto p-2'>
            {categories.length === 0 ? (
              <div className='p-4 text-center text-sm text-muted-foreground'>
                Nenhuma categoria encontrada
              </div>
            ) : (
              categories.map((category) => {
                if (!category.id) return null
                const categoryId = category.id
                return (
                  <button
                    key={categoryId}
                    type='button'
                    onClick={() => toggleCategory(categoryId)}
                    className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground'
                  >
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                        selectedCategoryIds.includes(categoryId)
                          ? 'bg-primary border-primary'
                          : 'border-input'
                      }`}
                    >
                      {selectedCategoryIds.includes(categoryId) && (
                        <Check className='h-3 w-3 text-primary-foreground' />
                      )}
                    </div>
                    <span>{category.name}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
