import type { CodePlaybackDto } from '@stardust/core/global/structures/dtos'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

import { ROUTES } from '@/constants'
import { Search } from '@/ui/global/widgets/components/Search'
import { PopoverMenu } from '@/ui/global/widgets/components/PopoverMenu'
import type { PopoverMenuButton } from '@/ui/global/widgets/components/PopoverMenu/types'
import { AnimatedArrow } from '@/ui/global/widgets/components/AnimatedArrow'
import { SolutionCardSkeleton } from './SolutionCardSkeleton'
import { ShowMoreButton } from '@/ui/global/widgets/components/ShowMoreButton'
import { Button } from '@/ui/global/widgets/components/Button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { SolutionCard } from './SolutionCard'
import { ChallengeContentNav } from '../../components/ChallengeContentNav'
import { OfficialSolutionCard } from './OfficialSolutionCard'

const SORTER_BUTTON_TITLES: Record<string, string> = {
  date: 'recentes',
  upvotesCount: 'votadas',
  commentsCount: 'comentadas',
  viewsCount: 'visualizadas',
} as const

export type Props = {
  solutions: Array<{
    id: string
    title: string
    slug: string
    upvotesCount: number
    viewsCount: number
    commentsCount: number
    postedAt: Date
    author: {
      name: string
      slug: string
      avatar: { name: string; image: string }
    }
  }>
  officialSolution: CodePlaybackDto | null
  sorter: { value: string }
  isReachedEnd: boolean
  isLoading: boolean
  isFromUser: boolean
  solutionTitle: string
  popoverMenuButtons: PopoverMenuButton[]
  challengeSlug: string
  isChallengeCompleted: boolean
  handleIsFromUserChange: (isFromUser: boolean) => void
  nextPage: () => void
  handleSolutionTitleChange: (title: string) => void
}

export function ChallengeSolutionsSlotView({
  solutions,
  officialSolution,
  sorter,
  isReachedEnd,
  isLoading,
  isFromUser,
  solutionTitle,
  popoverMenuButtons,
  challengeSlug,
  isChallengeCompleted,
  handleIsFromUserChange,
  nextPage,
  handleSolutionTitleChange,
}: Props) {
  return (
    <div className='px-6 py-3'>
      <div className='flex flex-wrap justify-between'>
        <div className='md:hidden'>
          <ChallengeContentNav contents={['description', 'comments']} />
        </div>

        {isChallengeCompleted && (
          <Button
            asChild
            className='md:ml-auto w-full md:w-max mt-2 md:m-0 px-3 h-10 text-xs'
          >
            <Link href={ROUTES.challenging.challenges.solution(challengeSlug)}>
              <Icon name='share' size={14} className='mr-1' />
              Compartilhar sua solução
            </Link>
          </Button>
        )}
      </div>

      {officialSolution && (
        <div className='mt-6'>
          <OfficialSolutionCard challengeSlug={challengeSlug} />
        </div>
      )}

      <div className='flex items-center gap-6 mt-6'>
        <Search
          value={solutionTitle}
          placeholder='procurar solução por título'
          onSearchChange={handleSolutionTitleChange}
          className='flex-1'
        />

        <PopoverMenu
          label='Abrir menu para ordernar lista de conquistas'
          buttons={popoverMenuButtons}
        >
          {(isPopoverMenuOpen) => (
            <div className='flex items-center gap-3 text-sm text-gray-200 cursor-pointer'>
              Mais {SORTER_BUTTON_TITLES[sorter.value]}
              <AnimatedArrow isUp={isPopoverMenuOpen} />
            </div>
          )}
        </PopoverMenu>
      </div>

      <div className='flex w-64 gap-2 mt-6'>
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
                title={solution.title}
                slug={solution.slug}
                upvotesCount={solution.upvotesCount}
                viewsCount={solution.viewsCount}
                commentsCount={solution.commentsCount}
                postedAt={solution.postedAt}
                challengeSlug={challengeSlug}
                author={solution.author}
              />
            </li>
          ))}
      </ul>

      {!isReachedEnd && <ShowMoreButton isLoading={isLoading} onClick={nextPage} />}
    </div>
  )
}
