import { Input } from '@/ui/shadcn/components/input'
import { UsersTable } from '@/ui/global/widgets/components/UsersTable'
import { Pagination } from '@/ui/global/widgets/components/Pagination'
import { useUsersPage } from './useUsersPage'

export const UsersPageView = () => {
  const {
    users,
    isLoading,
    totalItemsCount,
    totalPages,
    page,
    itemsPerPage,
    handleNextPage,
    handlePrevPage,
    handleSearchChange,
  } = useUsersPage()

  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Usuários</h1>
        <p className='text-muted-foreground'>Gerencie os usuários da plataforma.</p>
      </div>

      <div className='flex items-center gap-4'>
        <Input
          placeholder='Buscar usuário por nome...'
          className='max-w-sm'
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <UsersTable users={users} isLoading={isLoading} />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItemsCount={totalItemsCount}
        itemsPerPage={itemsPerPage}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />
    </div>
  )
}
