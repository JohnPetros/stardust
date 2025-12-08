import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

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
import { Avatar, AvatarImage } from '@/ui/shadcn/components/avatar'
import { Datetime } from '@stardust/core/global/libs'
import { StorageImage } from '@/ui/global/widgets/components/StorageImage'

type Props = {
  challenges: ChallengeDto[]
  isLoading: boolean
}

export const RecentChallengesTableView = ({ challenges, isLoading }: Props) => {
  function getDifficultyLabel(difficultyLevel: string) {
    const labels: Record<string, string> = {
      easy: 'Fácil',
      medium: 'Médio',
      hard: 'Difícil',
    }
    return labels[difficultyLevel] || difficultyLevel
  }

  function getDifficultyVariant(difficultyLevel: string) {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      easy: 'default',
      medium: 'secondary',
      hard: 'destructive',
    }
    return variants[difficultyLevel] || 'default'
  }

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
          <TableHead>Título</TableHead>
          <TableHead>Autor</TableHead>
          <TableHead>Dificuldade</TableHead>
          <TableHead>Data de Postagem</TableHead>
          <TableHead>Visibilidade</TableHead>
          <TableHead>Downvotes</TableHead>
          <TableHead>Upvotes</TableHead>
          <TableHead>Qtd. de usuários que completaram</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {challenges.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className='text-center text-muted-foreground'>
              Nenhum desafio encontrado
            </TableCell>
          </TableRow>
        ) : (
          challenges.map((challenge) => (
            <TableRow key={challenge.id}>
              <TableCell className='font-medium'>{challenge.title}</TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  {challenge.author.entity?.avatar ? (
                    <StorageImage
                      folder='avatars'
                      src={challenge.author.entity.avatar.image}
                      alt={challenge.author.entity.name}
                      className='w-8 h-8 rounded-full object-cover border-2 border-zinc-700 shadow'
                    />
                  ) : null}
                  <span>{challenge.author.entity?.name ?? '-'}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getDifficultyVariant(challenge.difficultyLevel)}>
                  {getDifficultyLabel(challenge.difficultyLevel)}
                </Badge>
              </TableCell>
              <TableCell>
                {challenge.postedAt
                  ? new Datetime(challenge.postedAt).format('DD/MM/YYYY HH:mm:ss')
                  : '-'}
              </TableCell>
              <TableCell>
                <Badge variant={challenge.isPublic ? 'default' : 'secondary'}>
                  {challenge.isPublic ? 'Público' : 'Privado'}
                </Badge>
              </TableCell>
              <TableCell>{challenge.downvotesCount ?? 0}</TableCell>
              <TableCell>{challenge.upvotesCount ?? 0}</TableCell>
              <TableCell>{challenge.completionsCount ?? 0}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
