import { Search } from 'lucide-react'

import { ChallengesTableView } from '@/ui/global/widgets/components/ChallengesTable'
import { Pagination } from '@/ui/global/widgets/components/Pagination'
import { Button } from '@/ui/shadcn/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/shadcn/components/dialog'
import { Input } from '@/ui/shadcn/components/input'
import type { useStarChallengeSelector } from './useStarChallengeSelector'

type Props = ReturnType<typeof useStarChallengeSelector>
type ViewProps = Props & {
  selectedChallengeId: string
  selectedChallengeTitle: string
  onChallengeUnlinked?: () => Promise<void> | void
}

export const StarChallengeSelectorView = ({
  isOpen,
  isLoading,
  hasError,
  search,
  challenges,
  page,
  totalPages,
  totalItemsCount,
  itemsPerPage,
  selectedChallengeId,
  selectedChallengeTitle,
  onChallengeUnlinked,
  handleOpenChange,
  handleSearchChange,
  handleSelectChallenge,
  handlePageChange,
  handleNextPage,
  handlePrevPage,
  handleItemsPerPageChange,
}: ViewProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='w-32 justify-start overflow-hidden'
          title={selectedChallengeTitle || 'Selecionar desafio'}
        >
          <span className='block w-full truncate text-left'>
            {selectedChallengeTitle || 'Selecionar desafio'}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-6xl'>
        <DialogHeader>
          <DialogTitle>Selecionar desafio da estrela</DialogTitle>
          <DialogDescription>
            Busque por título e selecione um desafio para vincular com esta estrela.
          </DialogDescription>
        </DialogHeader>

        {selectedChallengeTitle ? (
          <div className='flex items-center justify-between gap-3 rounded-md border border-zinc-800 bg-zinc-900/40 px-4 py-3'>
            <div className='min-w-0'>
              <p className='text-xs text-zinc-400'>Desafio vinculado</p>
              <p
                className='truncate text-sm text-zinc-100'
                title={selectedChallengeTitle}
              >
                {selectedChallengeTitle}
              </p>
            </div>

            <Button
              type='button'
              variant='destructive'
              size='sm'
              disabled={!selectedChallengeId}
              onClick={() => onChallengeUnlinked?.()}
            >
              Desvincular
            </Button>
          </div>
        ) : null}

        <div className='relative'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder='Buscar desafio por título...'
            className='pl-8'
          />
        </div>

        {hasError ? (
          <div className='rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300'>
            Não foi possível carregar os desafios. Tente novamente.
          </div>
        ) : null}

        {!isLoading && !hasError && challenges.length === 0 ? (
          <div className='rounded-md border border-zinc-800 px-4 py-8 text-center text-sm text-zinc-400'>
            Nenhum desafio elegível encontrado.
          </div>
        ) : null}

        {!isLoading && !hasError && challenges.length > 0 ? (
          <div className='space-y-4 w-full overflow-x-auto'>
            <ChallengesTableView
              challenges={challenges}
              isLoading={isLoading}
              onSelectChallenge={handleSelectChallenge}
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
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
