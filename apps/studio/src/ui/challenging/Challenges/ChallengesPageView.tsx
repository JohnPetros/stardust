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
import { Pagination } from '@/ui/global/widgets/components/Pagination'

import type { useChallengesPage } from './useChallengesPage'

type ChallengesPageViewProps = ReturnType<typeof useChallengesPage>

export const ChallengesPageView = ({
  challenges,
  isLoading,
  categories,
  orders,
  filters,
  pagination,
  handleOrderChange,
}: ChallengesPageViewProps) => {
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

        <Select value={filters.visibility} onValueChange={filters.setVisibility}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Visibilidade' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos</SelectItem>
            <SelectItem value='public'>Público</SelectItem>
            <SelectItem value='private'>Privado</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='h-10 gap-2 border-dashed'>
              <Filter className='h-4 w-4' />
              Categorias
              {filters.selectedCategories.length > 0 && (
                <Badge variant='secondary' className='ml-1 h-5 rounded-sm px-1 text-xs'>
                  {filters.selectedCategories.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[200px]'>
            <DropdownMenuLabel>Filtrar por categorias</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.length === 0 ? (
              <div className='p-2 text-sm text-center text-muted-foreground'>
                Nenhuma categoria encontrada
              </div>
            ) : (
              categories.map((category) => {
                if (!category.id) return null
                return (
                  <DropdownMenuCheckboxItem
                    key={category.id}
                    checked={filters.selectedCategories.includes(category.id)}
                    onCheckedChange={() => filters.toggleCategory(category.id as string)}
                  >
                    {category.name}
                  </DropdownMenuCheckboxItem>
                )
              })
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ChallengesTableView
        challenges={challenges}
        isLoading={isLoading}
        orders={orders}
        onOrderChange={handleOrderChange}
      />

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalItemsCount={pagination.totalItemsCount}
        itemsPerPage={pagination.itemsPerPage}
        onNextPage={pagination.handleNextPage}
        onPrevPage={pagination.handlePrevPage}
        onPageChange={pagination.handlePageChange}
        onItemsPerPageChange={pagination.handleItemsPerPageChange}
      />
    </div>
  )
}
