import type { UserDto } from '@stardust/core/profile/entities/dtos'
import type { Sorter } from '@stardust/core/global/structures'
import type { SpaceCompletionStatus } from '@stardust/core/profile/structures'

import { Input } from '@/ui/shadcn/components/input'
import { UsersTable } from '@/ui/global/widgets/components/UsersTable'
import { Pagination } from '@/ui/global/widgets/components/Pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/shadcn/components/select'
import { PeriodPicker } from '@/ui/global/widgets/components/PeriodPicker'
import { InsigniaRolesSelect } from './InsigniaRolesSelect'

type Props = {
  users: UserDto[]
  isLoading: boolean
  totalItemsCount: number
  totalPages: number
  page: number
  itemsPerPage: number
  sorters: {
    level: Sorter
    weeklyXp: Sorter
    unlockedStarCount: Sorter
    unlockedAchievementCount: Sorter
    completedChallengeCount: Sorter
  }
  spaceCompletionStatus: SpaceCompletionStatus
  insigniaRoles: string[]
  creationPeriod: {
    startDate?: Date
    endDate?: Date
  }
  handleNextPage: () => void
  handlePrevPage: () => void
  handleSearchChange: (value: string) => void
  handleSort: (column: string, sorter: Sorter) => void
  handleSpaceCompletionStatusChange: (status: string) => void
  handleInsigniaRolesChange: (roles: string[]) => void
  handleCreationPeriodChange: (period: { startDate?: Date; endDate?: Date }) => void
  handlePageChange: (newPage: number) => void
  handleItemsPerPageChange: (count: number) => void
}

export const UsersPageView = ({
  users,
  isLoading,
  totalItemsCount,
  totalPages,
  page,
  itemsPerPage,
  sorters,
  spaceCompletionStatus,
  insigniaRoles,
  creationPeriod,
  handleNextPage,
  handlePrevPage,
  handleSearchChange,
  handleSort,
  handleSpaceCompletionStatusChange,
  handleInsigniaRolesChange,
  handleCreationPeriodChange,
  handlePageChange,
  handleItemsPerPageChange,
}: Props) => {
  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Usuários</h1>
        <p className='text-muted-foreground'>Gerencie os usuários da plataforma.</p>
      </div>

      <div className='flex flex-wrap items-center gap-4'>
        <Input
          placeholder='Buscar usuário por nome...'
          className='max-w-xs'
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>Status de completude do espaço:</span>
          <Select
            value={spaceCompletionStatus.value}
            onValueChange={handleSpaceCompletionStatusChange}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Status do Espaço' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Todos</SelectItem>
              <SelectItem value='completed'>Completo</SelectItem>
              <SelectItem value='not-completed'>Em progresso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <InsigniaRolesSelect
          selectedRoles={insigniaRoles}
          onChange={handleInsigniaRolesChange}
        />

        <PeriodPicker
          startDate={creationPeriod.startDate}
          endDate={creationPeriod.endDate}
          label='Período de Criação'
          onChange={handleCreationPeriodChange}
        />
      </div>

      <UsersTable
        users={users}
        isLoading={isLoading}
        sorters={sorters}
        onSort={handleSort}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItemsCount={totalItemsCount}
        itemsPerPage={itemsPerPage}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  )
}
