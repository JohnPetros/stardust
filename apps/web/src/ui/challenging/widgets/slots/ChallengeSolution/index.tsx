import { Solution } from '@stardust/core/challenging/entities'

import { UserAvatar } from '@/ui/global/widgets/components/UserAvatar'
import type { SolutionDto } from '@stardust/core/challenging/dtos'
import { Mdx } from '@/ui/global/widgets/components/Mdx'
import { SolutionInfo } from '../../components/SolutionInfo'
import { SolutionCommentsList } from './SolutionCommentsList'
import { Button } from '@/ui/global/widgets/components/Button'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import { UpvoteSolutionButton } from './UpvoteSolutionButton'

type ChallengeSolutionSlotProps = {
  challengeSlug: string
  solutionDto: SolutionDto
}

export function ChallengeSolutionSlot({
  challengeSlug,
  solutionDto,
}: ChallengeSolutionSlotProps) {
  const solution = Solution.create(solutionDto)
  return (
    <div>
      <header>
        <Button asChild className='h-12 text-sm'>
          <Link
            href={ROUTES.challenging.challenges.challengeSolutions.list(challengeSlug)}
          >
            Ver todas as soluções
          </Link>
        </Button>
        <div>
          <UserAvatar
            avatarName={solution.author.avatar.name.value}
            avatarImage={solution.author.avatar.image.value}
            size={40}
          />
          <div>
            <span>{solution.author.name.value}</span>
            <SolutionInfo
              commentsCount={solution.commentsCount.value}
              viewsCount={solution.upvotesCount.value}
              createdAt={solution.createdAt}
            />
          </div>
        </div>
        <div>
          <UpvoteSolutionButton
            solutionId={solution.id}
            initialUpvotesCount={solution.upvotesCount.value}
          />
          <Button asChild className='h-12 text-sm'>
            <Link
              href={ROUTES.challenging.challenges.challengeSolutions.list(challengeSlug)}
            >
              Criar sua solução
            </Link>
          </Button>
        </div>
      </header>

      <Mdx>{solution.content.value}</Mdx>

      <div className='mt-6'>
        <SolutionCommentsList solutionId={solution.id} />
      </div>
    </div>
  )
}
