import type {
  ChallengeDto,
  ChallengeCategoryDto,
} from '@stardust/core/challenging/entities/dtos'
import type { ChallengeDifficulty } from '@stardust/core/challenging/structures'

import { ChallengesTableView } from '@/ui/global/widgets/components/ChallengesTable'
import { CategoriesFilter } from '@/ui/global/widgets/components/CategoriesFilter'
import { Input } from '@/ui/shadcn/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/shadcn/components/select'

type Props = {
  challenges: ChallengeDto[]
  isLoading: boolean
  page: number
  totalPages: number
  totalItemsCount: number
  itemsPerPage: number
  searchInput: string
  difficulty: ChallengeDifficulty
  selectedCategoryIds: string[]
  categories: ChallengeCategoryDto[]
  onSearchChange: (value: string) => void
  onDifficultyChange: (value: string) => void
  onCategoriesChange: (categoryIds: string[]) => void
  onPrevPage: () => void
  onNextPage: () => void
}

export const ChallengesPageView = ({
  challenges,
  isLoading,
  page,
  totalPages,
  totalItemsCount,
  itemsPerPage,
  searchInput,
  difficulty,
  selectedCategoryIds,
  categories,
  onSearchChange,
  onDifficultyChange,
  onCategoriesChange,
  onPrevPage,
  onNextPage,
}: Props) => {
  return (
    <div className='flex flex-col gap-6 p-8'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold'>Desafios</h1>
        <p className='text-muted-foreground'>
          Visualize todos os desafios cadastrados no sistema
        </p>
      </div>

      <div className='flex items-center gap-4'>
        <Input
          placeholder='Buscar desafios...'
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className='max-w-sm'
        />
        <Select value={difficulty.level} onValueChange={onDifficultyChange}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Dificuldade' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='any'>Todas</SelectItem>
            <SelectItem value='easy'>Fácil</SelectItem>
            <SelectItem value='medium'>Médio</SelectItem>
            <SelectItem value='hard'>Difícil</SelectItem>
          </SelectContent>
        </Select>
        <CategoriesFilter
          categories={categories}
          selectedCategoryIds={selectedCategoryIds}
          onCategoriesChange={onCategoriesChange}
        />
      </div>

      <ChallengesTableView
        challenges={challenges}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalItemsCount={totalItemsCount}
        itemsPerPage={itemsPerPage}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
      />
    </div>
  )
}
