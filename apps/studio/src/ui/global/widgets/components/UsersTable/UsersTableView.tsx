import type { UserDto } from '@stardust/core/profile/entities/dtos'
import type { ListingOrder } from '@stardust/core/global/structures'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/shadcn/components/table'
import { Badge } from '@/ui/shadcn/components/badge'

import { Datetime } from '@stardust/core/global/libs'
import { StorageImage } from '@/ui/global/widgets/components/StorageImage'
import { Button } from '@/ui/shadcn/components/button'
import { ExternalLinkIcon } from 'lucide-react'
import { ENV } from '@/constants'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { SortableColumn } from '@/ui/global/widgets/components/SortableColumn'
import { UsersTableSkeleton } from './UsersTableSkeleton'

type Props = {
  users: UserDto[]
  isLoading: boolean
  orders: {
    level: ListingOrder
    weeklyXp: ListingOrder
    unlockedStarCount: ListingOrder
    unlockedAchievementCount: ListingOrder
    completedChallengeCount: ListingOrder
  }
  onOrderChange: (column: string, order: ListingOrder) => void
}

export const UsersTableView = ({ users, isLoading, orders, onOrderChange }: Props) => {
  const { openExternal } = useNavigationProvider()

  if (isLoading) {
    return <UsersTableSkeleton />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <SortableColumn
            label='Nível'
            order={orders.level}
            onOrderChange={(order) => onOrderChange('level', order)}
          />
          <SortableColumn
            label='XP Semanal'
            order={orders.weeklyXp}
            onOrderChange={(order) => onOrderChange('weeklyXp', order)}
          />
          <SortableColumn
            label='Estrelas Desbloqueadas'
            order={orders.unlockedStarCount}
            onOrderChange={(order) => onOrderChange('unlockedStarCount', order)}
          />
          <SortableColumn
            label='Conquistas Desbloqueadas'
            order={orders.unlockedAchievementCount}
            onOrderChange={(order) => onOrderChange('unlockedAchievementCount', order)}
          />
          <SortableColumn
            label='Desafios Completados'
            order={orders.completedChallengeCount}
            onOrderChange={(order) => onOrderChange('completedChallengeCount', order)}
          />
          <TableHead>Status do Espaço</TableHead>
          <TableHead>Insígnias</TableHead>
          <TableHead>Data de Criação</TableHead>
          <TableHead className='text-right'>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={10} className='text-center text-zinc-500'>
              Nenhum usuário encontrado
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className='font-medium'>
                <div className='flex items-center gap-2'>
                  {user.avatar.entity && (
                    <StorageImage
                      folder='avatars'
                      src={user.avatar.entity.image}
                      alt={user.avatar.entity.name}
                      className='w-8 h-8 rounded-full object-cover border-2 border-zinc-700 shadow'
                    />
                  )}
                  {user.name}
                </div>
              </TableCell>
              <TableCell>{user.level ?? '-'}</TableCell>
              <TableCell>{user.weeklyXp ?? 0}</TableCell>
              <TableCell>{user.unlockedStarsIds?.length ?? 0}</TableCell>
              <TableCell>{user.unlockedAchievementsIds?.length ?? 0}</TableCell>
              <TableCell>{user.completedChallengesIds?.length ?? 0}</TableCell>
              <TableCell>
                <Badge variant={user.hasCompletedSpace ? 'default' : 'secondary'}>
                  {user.hasCompletedSpace ? 'Completo' : 'Em progresso'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className='flex flex-wrap gap-1'>
                  {user.insigniaRoles && user.insigniaRoles.length > 0 ? (
                    user.insigniaRoles.map((role: string) => (
                      <Badge key={role} variant='outline'>
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <span className='text-muted-foreground'>-</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {new Datetime(user.createdAt ?? new Date()).format('DD/MM/YYYY HH:mm:ss')}
              </TableCell>
              <TableCell className='text-right'>
                {user.slug && (
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => openExternal(`${ENV.webAppUrl}/profile/${user.slug}`)}
                    title='Ver perfil no app'
                  >
                    <ExternalLinkIcon className='w-4 h-4' />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
