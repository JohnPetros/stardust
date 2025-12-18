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
import { Button } from '@/ui/shadcn/components/button'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { Datetime } from '@stardust/core/global/libs'
import { StorageImage } from '@/ui/global/widgets/components/StorageImage'
import { Pagination } from '@/ui/global/widgets/components/Pagination'
import { ExternalLink } from 'lucide-react'
import { ENV } from '@/constants/env'

type Props = {
  challenges: ChallengeDto[]
  isLoading: boolean
  page?: number
  totalPages?: number
  totalItemsCount?: number
  itemsPerPage?: number
  onPrevPage?: () => void
  onNextPage?: () => void
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
}

const DIFFICULTY_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive'> = {
  easy: 'default',
  medium: 'secondary',
  hard: 'destructive',
}

export const ChallengesTableView = ({
  challenges,
  isLoading,
  page,
  totalPages,
  totalItemsCount,
  itemsPerPage,
  onPrevPage,
  onNextPage,
}: Props) => {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-[400px]'>
        <Loading size={48} />
      </div>
    )
  }

  return (
    <>
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
            <TableHead>Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {challenges.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className='text-center text-muted-foreground'>
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
                  <Badge
                    variant={DIFFICULTY_VARIANTS[challenge.difficultyLevel] || 'default'}
                  >
                    {DIFFICULTY_LABELS[challenge.difficultyLevel] ||
                      challenge.difficultyLevel}
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
                <TableCell>
                  {challenge.slug ? (
                    <Button variant='ghost' size='sm' asChild>
                      <a
                        href={`${ENV.webAppUrl}/challenging/challenges/${challenge.slug}/challenge`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2'
                      >
                        <ExternalLink className='h-4 w-4' />
                        Ver
                      </a>
                    </Button>
                  ) : (
                    <span className='text-muted-foreground text-sm'>-</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages &&
        totalPages > 1 &&
        page &&
        totalItemsCount &&
        itemsPerPage &&
        onPrevPage &&
        onNextPage && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItemsCount={totalItemsCount}
            itemsPerPage={itemsPerPage}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
          />
        )}
    </>
  )
}
