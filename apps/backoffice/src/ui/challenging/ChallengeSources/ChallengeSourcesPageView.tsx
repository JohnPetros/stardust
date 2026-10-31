import { ChevronDown, ChevronUp, Pencil, Search, Trash2 } from 'lucide-react'

import { ENV } from '@/constants/env'
import { Button } from '@/ui/shadcn/components/button'
import { Skeleton } from '@/ui/shadcn/components/skeleton'
import { Input } from '@/ui/shadcn/components/input'
import { Badge } from '@/ui/shadcn/components/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/shadcn/components/table'
import { Pagination } from '@/ui/global/widgets/components/Pagination'

import type { useChallengeSourcesPage } from './useChallengeSourcesPage'
import { ChallengeSourceForm } from './ChallengeSourceForm'
import { DeleteChallengeSourceDialog } from './DeleteChallengeSourceDialog'

type Props = ReturnType<typeof useChallengeSourcesPage>

const LOADING_ROWS_COUNT = 5

export const ChallengeSourcesPageView = ({
  search,
  page,
  totalPages,
  totalItemsCount,
  itemsPerPage,
  sortableChallengeSources,
  isLoading,
  onSearchChange,
  onPageChange,
  onNextPage,
  onPrevPage,
  onItemsPerPageChange,
  onCreateChallengeSource,
  onUpdateChallengeSource,
  onDeleteChallengeSource,
  onReorderChallengeSources,
}: Props) => {
  async function handleMove(fromIndex: number, toIndex: number): Promise<void> {
    if (toIndex < 0 || toIndex >= sortableChallengeSources.length) return

    const reorderedItems = [...sortableChallengeSources]
    const [movedItem] = reorderedItems.splice(fromIndex, 1)
    reorderedItems.splice(toIndex, 0, movedItem)
    const reorderedChallengeSources = reorderedItems.map((item) => item.data)

    await onReorderChallengeSources(reorderedChallengeSources)
  }

  return (
    <div className='p-8 space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-tight'>Fontes de desafios</h1>
        <ChallengeSourceForm
          onCreate={onCreateChallengeSource}
          onUpdate={onUpdateChallengeSource}
        />
      </div>

      <div className='relative max-w-sm'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Buscar por título do desafio...'
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className='pl-8'
        />
      </div>

      <div className='rounded-md overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[96px]'>Posição</TableHead>
              <TableHead className='min-w-[360px]'>URL de origem</TableHead>
              <TableHead className='min-w-[360px]'>URL do desafio</TableHead>
              <TableHead className='min-w-[240px]'>Desafio vinculado</TableHead>
              <TableHead className='min-w-[280px]'>Instruções adicionais</TableHead>
              <TableHead className='w-[120px]'>Em uso</TableHead>
              <TableHead className='w-[90px]'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: LOADING_ROWS_COUNT }).map((_, index) => (
                <TableRow key={`loading-row-${String(index)}`}>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Skeleton className='h-8 w-8 rounded-md' />
                      <Skeleton className='h-8 w-8 rounded-md' />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-full max-w-[320px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-full max-w-[320px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-full max-w-[220px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-full max-w-[260px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-6 w-16 rounded-full' />
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Skeleton className='h-8 w-8 rounded-md' />
                      <Skeleton className='h-8 w-8 rounded-md' />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : sortableChallengeSources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='text-center text-muted-foreground py-8'>
                  Nenhuma fonte encontrada para os filtros atuais
                </TableCell>
              </TableRow>
            ) : (
              sortableChallengeSources.map((item, index) => {
                const source = item.data
                const challengeSlug = source.challenge?.slug
                const challengeUrl = challengeSlug
                  ? `${ENV.stardustWebAppUrl}/challenging/challenges/${challengeSlug}`
                  : '-'
                const challengeTitle = source.challenge?.title ?? 'Sem desafio vinculado'
                const additionalInstructions =
                  source.additionalInstructions?.trim() || '-'
                const isUsed = Boolean(source.challenge)

                return (
                  <TableRow key={source.id}>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <Button
                          variant='ghost'
                          size='icon'
                          aria-label='Mover para cima'
                          onClick={() => handleMove(index, index - 1)}
                          disabled={index === 0}
                        >
                          <ChevronUp className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          aria-label='Mover para baixo'
                          onClick={() => handleMove(index, index + 1)}
                          disabled={index === sortableChallengeSources.length - 1}
                        >
                          <ChevronDown className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={source.url}
                        target='_blank'
                        rel='noreferrer'
                        className='block truncate text-blue-500 hover:underline'
                      >
                        {source.url}
                      </a>
                    </TableCell>
                    <TableCell>
                      {challengeUrl === '-' ? (
                        <span>-</span>
                      ) : (
                        <a
                          href={challengeUrl}
                          target='_blank'
                          rel='noreferrer'
                          className='block truncate text-blue-500 hover:underline'
                        >
                          {challengeUrl}
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className='block truncate'>{challengeTitle}</span>
                    </TableCell>
                    <TableCell>
                      <span className='block max-w-[260px] truncate'>
                        {additionalInstructions}
                      </span>
                    </TableCell>
                    <TableCell>
                      {isUsed ? (
                        <Badge variant='default'>Sim</Badge>
                      ) : (
                        <Badge variant='outline'>Não</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <ChallengeSourceForm
                          challengeSourceId={source.id}
                          initialValues={{
                            url: source.url,
                            challengeId: source.challenge?.id,
                            challengeTitle: source.challenge?.title,
                            additionalInstructions: source.additionalInstructions,
                          }}
                          onCreate={onCreateChallengeSource}
                          onUpdate={onUpdateChallengeSource}
                        >
                          <Button variant='outline' size='icon'>
                            <Pencil className='h-4 w-4' />
                          </Button>
                        </ChallengeSourceForm>

                        <DeleteChallengeSourceDialog
                          onConfirm={() => onDeleteChallengeSource(source.id)}
                        >
                          <Button
                            variant='destructive'
                            size='icon'
                            aria-label='Excluir fonte'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </DeleteChallengeSourceDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItemsCount={totalItemsCount}
        itemsPerPage={itemsPerPage}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  )
}
