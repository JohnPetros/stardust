import Link from 'next/link'

import { ROUTES } from '@/constants'
import { Search } from '@/ui/global/widgets/components/Search'
import { useChallengeSolutionsSlot } from './useChallengeSolutionsSlot'
import { PopoverMenu } from '@/ui/global/widgets/components/PopoverMenu'
import { AnimatedArrow } from '@/ui/global/widgets/components/AnimatedArrow'
import { SolutionCardSkeleton } from './SolutionCardSkeleton'
import { ShowMoreButton } from '@/ui/global/widgets/components/ShowMoreButton'
import { Button } from '@/ui/global/widgets/components/Button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { SolutionCard } from './SolutionCard'

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
    <>
      <div className='flex items-center'>
        <Search
          value={solutionTitle}
          onSearchChange={handleSolutionTitleChange}
          className='flex-1'
        />

        <PopoverMenu
          label='Abrir menu para ordernar lista de conquistas'
          buttons={popoverMenuButtons}
        >
          {(isPopoverMenuOpen) => (
            <div className='flex items-center gap-3 text-sm text-gray-200'>
              Mais {sorterButtonTitle}
              <AnimatedArrow isUp={isPopoverMenuOpen} />
            </div>
          )}
        </PopoverMenu>
      </div>

      <div className='flex justify-between'>
        <div className='space-x-3'>
          <Button
            onClick={() => handleIsFromUserChange(false)}
            className={
              !isFromUser ? 'bg-green-400 text-green-900' : 'bg-gray-700 text-gray-50'
            }
          >
            Todas as soluções
          </Button>
          <Button
            onClick={() => handleIsFromUserChange(true)}
            className={
              isFromUser ? 'bg-green-400 text-green-900' : 'bg-gray-700 text-gray-50'
            }
          >
            Suas soluções
          </Button>
        </div>

        <Button asChild>
          <Link href={`${ROUTES.challenging.challenges.solution(challengeSlug)}`}>
            <Icon name='share' size={20} />
            Compartilhar sua solução
          </Link>
        </Button>
      </div>

      {!isLoading && solutions.length === 0 && (
        <p>Nenhuma solução encontrada para esse desafio</p>
      )}

      <ul className='space-y-6'>
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
            <li key={solution.id}>
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
                    image: solution.author.avatar.name.value,
                  },
                }}
              />
            </li>
          ))}
      </ul>

      {!isRecheadedEnd && <ShowMoreButton isLoading={isLoading} onClick={nextPage} />}
    </>
  )
}
