'use client'

import Link from 'next/link'

import { SolutionCard } from './SolutionCard'
import { useSolutionsList } from './useSolutionsList'

import { AnimatedArrow } from '@/global/components/AnimatedArrow'
import { Loading } from '@/global/components/Loading'
import { PopoverMenu } from '@/global/components/PopoverMenu'
import { Search } from '@/global/components/Search'
import { Separator } from '@/global/components/Separator'

import { Button } from '@/global/components/Button'
import { ROUTES } from '@/global/constants'
import { useChallengeStore } from '@/stores/challengeStore'
import { BoundingBox } from '@phosphor-icons/react'

export function SolutionsList() {
  const canShowSolutions = useChallengeStore((store) => store.state.canShowComments)

  const {
    isLoading,
    solutions,
    sorter,
    popoverMenuButtons,
    isPopoverMenuOpen,
    handlePopoverMenuOpenChange,
    handleSearchSoulutionTitleChange,
  } = useSolutionsList(canShowSolutions)

  if (!canShowSolutions || isLoading)
    return (
      <div className='grid h-full place-content-center'>
        <Loading />
      </div>
    )

  const sorterButtonTitle = sorter === 'date' ? 'recentes' : 'votados'

  return (
    <div className='pb-6 pt-4'>
      <header className='flex flex-col gap-3'>
        <strong className='text-center text-sm font-semibold text-gray-100'>
          {solutions?.length} Solu{solutions?.length === 1 ? 'ção' : 'ções'}
        </strong>
        {solutions && (
          <div className='flex items-center gap-6 rounded-md bg-gray-700 px-6 py-2 md:rounded-none md:bg-gray-800'>
            <Search
              placeholder='Pesquisar solução pelo título...'
              onSearchChange={handleSearchSoulutionTitleChange}
            />
            <PopoverMenu
              label='Abrir menu para ordernar lista de soluções'
              buttons={popoverMenuButtons}
              onOpenChange={handlePopoverMenuOpenChange}
            >
              <button
                type='button'
                className='flex items-center gap-3 text-sm text-gray-200 w-max'
              >
                Mais {sorterButtonTitle}
                <AnimatedArrow isUp={isPopoverMenuOpen} />
              </button>
            </PopoverMenu>
          </div>
        )}
      </header>

      <Button asChild className='w-max mx-auto mt-6'>
        <Link
          href={`${ROUTES.private.solution}/new`}
          target='_blank'
          className='flex w-max items-center gap-2 px-3 text-sm'
        >
          <BoundingBox className='text-lg text-gray-900' weight='bold' />
          Compartilhar minha solução
        </Link>
      </Button>

      {solutions && solutions.length === 0 ? (
        <p className='mt-6 text-center text-base font-medium text-gray-100'>
          Ainda ninguém enviou uma solução para esse desafio. <br /> Seja a primeira
          pessoa compartilhar sua solução 😉.
        </p>
      ) : (
        <ul className='mt-6 space-y-6 px-6'>
          {solutions?.map((solution, index, solutionsList) => (
            <>
              <li key={solution.id}>
                <SolutionCard
                  slug={solution.slug}
                  title={solution.title}
                  content={solution.content}
                  upvotesCount={solution.upvotesCount}
                  commentsCount={solution.commentsCount}
                  user={solution.user}
                  createdAt={solution.createdAt}
                />
              </li>
              {index < solutionsList.length - 1 && <Separator isColumn={false} />}
            </>
          ))}
        </ul>
      )}
    </div>
  )
}
