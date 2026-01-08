import { Filter, Search } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/shadcn/components/select'
import { Input } from '@/ui/shadcn/components/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/shadcn/components/dropdown-menu'
import { Button } from '@/ui/shadcn/components/button'
import { Badge } from '@/ui/shadcn/components/badge'
import { ChallengesTableView } from '@/ui/global/widgets/components/ChallengesTable'

import { useChallengesPage } from './useChallengesPage'

export const ChallengesPageView = () => {
  const { challenges, isLoading, categories, filters } = useChallengesPage()

  const toggleCategory = (categoryId: string) => {
    if (filters.selectedCategories.includes(categoryId)) {
      filters.setSelectedCategories(
        filters.selectedCategories.filter((c) => c !== categoryId),
      )
    } else {
      filters.setSelectedCategories([...filters.selectedCategories, categoryId])
    }
  }

  return (
    <div className='p-8 space-y-8 h-full flex flex-col'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold tracking-tight'>Desafios</h1>
      </div>

      <div className='flex items-center gap-4'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Buscar desafios...'
            value={filters.search}
            onChange={(e) => filters.setSearch(e.target.value)}
            className='pl-8'
          />
        </div>

        <Select value={filters.difficulty} onValueChange={filters.setDifficulty}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Dificuldade' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='any'>Qualquer dificuldade</SelectItem>
            <SelectItem value='easy'>Fácil</SelectItem>
            <SelectItem value='medium'>Médio</SelectItem>
            <SelectItem value='hard'>Difícil</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='h-10 gap-2 border-dashed'>
              <Filter className='h-4 w-4' />
              Tags
              {filters.selectedCategories.length > 0 && (
                <Badge variant='secondary' className='ml-1 h-5 rounded-sm px-1 text-xs'>
                  {filters.selectedCategories.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[200px]'>
            <DropdownMenuLabel>Filtrar por tags</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.length === 0 ? (
              <div className='p-2 text-sm text-center text-muted-foreground'>
                Nenhuma tag encontrada
              </div>
            ) : (
              categories.map((category) => {
                if (!category.id) return null
                return (
                  <DropdownMenuCheckboxItem
                    key={category.id}
                    checked={filters.selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id as string)}
                  >
                    {category.name}
                  </DropdownMenuCheckboxItem>
                )
              })
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='flex-1'>
        <ChallengesTableView challenges={challenges} isLoading={isLoading} />
      </div>
    </div>
  )
}
