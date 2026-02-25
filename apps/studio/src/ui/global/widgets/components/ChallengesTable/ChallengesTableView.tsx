import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'
import { ListingOrder } from '@stardust/core/global/structures'

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
import { ExternalLink } from 'lucide-react'
import { ENV } from '@/constants/env'
import { SortableColumn } from '@/ui/global/widgets/components/SortableColumn'
import { ChallengesTableSkeleton } from './ChallengesTableSkeleton'

type Props = {
  challenges: ChallengeDto[]
  isLoading: boolean
  onSelectChallenge?: (challengeId: string) => void
  orders?: {
    upvotesCount: ListingOrder
    downvoteCount: ListingOrder
    completionCount: ListingOrder
    posting: ListingOrder
  }
  onOrderChange?: (column: string, order: ListingOrder) => void
}

export const ChallengesTableView = ({
  challenges,
  isLoading,
  onSelectChallenge,
  orders,
  onOrderChange,
}: Props) => {
  const defaultOrder = ListingOrder.create('any')

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
    return <ChallengesTableSkeleton />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Autor</TableHead>
          <TableHead>Dificuldade</TableHead>
          <SortableColumn
            label='Data de Postagem'
            order={orders?.posting ?? defaultOrder}
            onOrderChange={(order) => onOrderChange?.('posting', order)}
          />
          <TableHead>Visibilidade</TableHead>
          <SortableColumn
            label='Downvotes'
            order={orders?.downvoteCount ?? defaultOrder}
            onOrderChange={(order) => onOrderChange?.('downvoteCount', order)}
          />
          <SortableColumn
            label='Upvotes'
            order={orders?.upvotesCount ?? defaultOrder}
            onOrderChange={(order) => onOrderChange?.('upvotesCount', order)}
          />
          <SortableColumn
            label='Qtd. de usuários que completaram'
            order={orders?.completionCount ?? defaultOrder}
            onOrderChange={(order) => onOrderChange?.('completionCount', order)}
          />
          <TableHead>Link</TableHead>
          {onSelectChallenge ? <TableHead>Ação</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {challenges.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={onSelectChallenge ? 10 : 9}
              className='text-center text-muted-foreground'
            >
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
              <TableCell>{challenge.completionCount ?? 0}</TableCell>
              <TableCell>
                {challenge.slug ? (
                  <Button variant='ghost' size='icon' asChild>
                    <a
                      href={`${ENV.webAppUrl}/challenging/challenges/${challenge.slug}`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <ExternalLink className='w-4 h-4' />
                    </a>
                  </Button>
                ) : null}
              </TableCell>
              {onSelectChallenge ? (
                <TableCell>
                  {challenge.id ? (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => onSelectChallenge?.(challenge.id!)}
                    >
                      Selecionar
                    </Button>
                  ) : null}
                </TableCell>
              ) : null}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
