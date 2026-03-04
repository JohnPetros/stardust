import type { ChallengingService } from '@stardust/core/challenging/interfaces'

import { Search } from 'lucide-react'

import { Button } from '@/ui/shadcn/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/shadcn/components/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/shadcn/components/form'
import { Input } from '@/ui/shadcn/components/input'
import { Pagination } from '@/ui/global/widgets/components/Pagination'
import { cn } from '@/ui/shadcn/utils'
import { useChallengeSourceForm } from './useChallengeSourceForm'

type Props = {
  challengingService: ChallengingService
  onSubmit: (url: string, challengeId: string) => Promise<string | null>
}

export const ChallengeSourceFormView = ({ challengingService, onSubmit }: Props) => {
  const {
    form,
    isOpen,
    search,
    challenges,
    totalPages,
    totalItemsCount,
    page,
    itemsPerPage,
    submitError,
    selectedChallenge,
    selectedChallengeId,
    isLoading,
    onDialogChange,
    onSearchChange,
    onSelectChallenge,
    onNextPage,
    onPrevPage,
    onPageChange,
    onItemsPerPageChange,
    onSubmit: handleSubmit,
  } = useChallengeSourceForm({
    challengingService,
    onSubmit,
  })

  return (
    <Dialog open={isOpen} onOpenChange={onDialogChange}>
      <DialogTrigger asChild>
        <Button>Adicionar fonte</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Adicionar fonte de desafio</DialogTitle>
          <DialogDescription>
            Informe a URL de origem e selecione o desafio vinculado.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='challenge-source-form' onSubmit={handleSubmit} className='space-y-4'>
            <FormField
              control={form.control}
              name='url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de origem</FormLabel>
                  <FormControl>
                    <Input placeholder='https://exemplo.com/artigo' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-2'>
              <FormLabel>Selecionar desafio</FormLabel>
              <div className='relative'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  value={search}
                  onChange={(event) => onSearchChange(event.target.value)}
                  className='pl-8'
                  placeholder='Buscar desafio por título...'
                />
              </div>

              <div className='max-h-52 overflow-y-auto rounded-md border p-2 space-y-2'>
                {isLoading ? (
                  <p className='text-sm text-muted-foreground'>Carregando desafios...</p>
                ) : challenges.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>
                    Nenhum desafio encontrado
                  </p>
                ) : (
                  challenges.map((challenge) => {
                    if (!challenge.id) return null
                    const challengeId = challenge.id

                    return (
                      <button
                        type='button'
                        key={challengeId}
                        onClick={() => onSelectChallenge(challengeId)}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-md border text-sm',
                          selectedChallengeId === challengeId
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'hover:bg-zinc-500',
                        )}
                      >
                        {challenge.title}
                      </button>
                    )
                  })
                )}
              </div>

              <FormField
                control={form.control}
                name='challengeId'
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedChallenge ? (
                <p className='text-xs text-muted-foreground'>
                  Desafio selecionado: <strong>{selectedChallenge.title}</strong>
                </p>
              ) : null}

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

            {submitError ? (
              <p className='text-sm text-destructive'>{submitError}</p>
            ) : null}
          </form>
        </Form>

        <DialogFooter>
          <Button type='button' variant='outline' onClick={() => onDialogChange(false)}>
            Cancelar
          </Button>
          <Button
            form='challenge-source-form'
            type='submit'
            isLoading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
