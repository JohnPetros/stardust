'use client'

import Link from 'next/link'

import { ROUTES } from '@/constants'
import { Search } from '@/ui/global/widgets/components/Search'
import { PopoverMenu } from '@/ui/global/widgets/components/PopoverMenu'
import { AnimatedArrow } from '@/ui/global/widgets/components/AnimatedArrow'
import { SolutionCardSkeleton } from './SolutionCardSkeleton'
import { ShowMoreButton } from '@/ui/global/widgets/components/ShowMoreButton'
import { Button } from '@/ui/global/widgets/components/Button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { useChallengeSolutionsSlot } from './useChallengeSolutionsSlot'
import { SolutionCard } from './SolutionCard'
import { twMerge } from 'tailwind-merge'

export function ChallengeSolutionsSlot() {
  const {
    solutions,
    sorter,
    isRecheadedEnd,
    isLoading,
    isFromUser,
    solutionTitle,
    popoverMenuButtons,
    challengeSlug,
    handleIsFromUserChange,
    nextPage,
    handleSolutionTitleChange,
  } = useChallengeSolutionsSlot()
  const sorterButtonTitle = sorter === 'date' ? 'recentes' : 'votados'

  return (
    <div className='px-6 py-3'>
      <Button asChild className='ml-auto w-max px-3 h-10 text-xs'>
        <Link href={`${ROUTES.challenging.challenges.solution(challengeSlug)}`}>
          <Icon name='share' size={14} className='mr-1' />
          Compartilhar sua solução
        </Link>
      </Button>

      <div className='flex items-center gap-6 mt-3'>
        <Search
          value={solutionTitle}
          placeholder='procurar solução por título'
          onSearchChange={handleSolutionTitleChange}
          className='flex-1'
        />

        {/* <PopoverMenu
          label='Abrir menu para ordernar lista de conquistas'
          buttons={popoverMenuButtons}
        >
          {(isPopoverMenuOpen) => (
            <div className='flex items-center gap-3 text-sm text-gray-200'>
              Mais {sorterButtonTitle}
              <AnimatedArrow isUp={isPopoverMenuOpen} />
            </div>
          )}
        </PopoverMenu> */}
      </div>

      <div className='flex w-64 gap-3 mt-3'>
        <Button
          onClick={() => handleIsFromUserChange(false)}
          className={twMerge(
            'h-8 text-xs',
            !isFromUser ? 'bg-green-400 text-green-900' : 'bg-gray-400 text-gray-700',
          )}
        >
          Todas soluções
        </Button>
        <Button
          onClick={() => handleIsFromUserChange(true)}
          className={twMerge(
            'h-8 text-xs',
            isFromUser ? 'bg-green-400 text-green-900' : 'bg-gray-400 text-gray-700',
          )}
        >
          Suas soluções
        </Button>
      </div>

      {!isLoading && solutions.length === 0 && (
        <p className='text-center text-gray-50 mt-12'>Nenhuma solução encontrada.</p>
      )}

      <ul className='space-y-6 mt-6 w-full'>
        {isLoading && (
          <>
            <SolutionCardSkeleton />
            <SolutionCardSkeleton />
            <SolutionCardSkeleton />
            <SolutionCardSkeleton />
          </>
        )}

        {!isLoading &&
          solutions.length > 0 &&
          solutions.map((solution) => (
            <li key={solution.id} className='w-full'>
              <SolutionCard
                title={solution.title.value}
                slug={solution.slug.value}
                upvotesCount={solution.upvotesCount.value}
                viewsCount={solution.viewsCount.value}
                commentsCount={solution.commentsCount.value}
                createdAt={solution.createdAt}
                challengeSlug={challengeSlug}
                author={{
                  name: solution.author.name.value,
                  slug: solution.author.slug.value,
                  avatar: {
                    name: solution.author.avatar.name.value,
                    image: solution.author.avatar.image.value,
                  },
                }}
              />
            </li>
          ))}
      </ul>

      {!isRecheadedEnd && <ShowMoreButton isLoading={isLoading} onClick={nextPage} />}
    </div>
  )
}
