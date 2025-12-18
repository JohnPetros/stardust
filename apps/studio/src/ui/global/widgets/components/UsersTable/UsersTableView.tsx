import type { UserDto } from '@stardust/core/profile/entities/dtos'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/shadcn/components/table'
import { Badge } from '@/ui/shadcn/components/badge'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { Datetime } from '@stardust/core/global/libs'
import { StorageImage } from '@/ui/global/widgets/components/StorageImage'
import { Button } from '@/ui/shadcn/components/button'
import { ExternalLinkIcon } from 'lucide-react'
import { ENV } from '@/constants'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'

type Props = {
  users: UserDto[]
  isLoading: boolean
}

export const UsersTableView = ({ users, isLoading }: Props) => {
  const { openExternal } = useNavigationProvider()

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-[400px]'>
        <Loading size={48} />
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Nível</TableHead>
          <TableHead>XP Semanal</TableHead>
          <TableHead>Estrelas Desbloqueadas</TableHead>
          <TableHead>Conquistas Desbloqueadas</TableHead>
          <TableHead>Desafios Completados</TableHead>
          <TableHead>Status do Espaço</TableHead>
          <TableHead>Insígnias</TableHead>
          <TableHead>Data de Criação</TableHead>
          <TableHead className='text-right'>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={10} className='text-center text-muted-foreground'>
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
