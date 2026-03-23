import type { ChallengeContent } from '@/ui/challenging/stores/ChallengeStore/types'
import type { ChallengeCraftsVisibility } from '@stardust/core/challenging/structures'

import { BlockedCommentsAlertDialog } from '../BlockedCommentsAlertDialog'
import { BlockedSolutionsAlertDialog } from '../BlockedSolutionsAlertDialog'
import { ChallengeContentLink } from '../ChallengeContentLink'

type Props = {
  contents: ChallengeContent[]
  craftsVislibility: ChallengeCraftsVisibility | null
  onShowSolutions: () => void
}

export const ChallengeContentNavView = ({
  contents,
  craftsVislibility,
  onShowSolutions,
}: Props) => {
  return (
    <nav className='flex items-center gap-2 md:hidden'>
      {contents.includes('description') && (
        <ChallengeContentLink
          title='Descrição'
          contentType='description'
          isActive={false}
          isBlocked={false}
        />
      )}
      {contents.includes('comments') && (
        <div>
          {craftsVislibility?.canShowSolutions.isFalse ? (
            <BlockedCommentsAlertDialog>
              <ChallengeContentLink
                title='Comentários'
                contentType='comments'
                isActive={false}
                isBlocked={true}
              />
            </BlockedCommentsAlertDialog>
          ) : (
            <ChallengeContentLink
              title='Comentários'
              contentType='comments'
              isActive={false}
              isBlocked={false}
            />
          )}
        </div>
      )}
      {contents.includes('solutions') && (
        <div>
          {craftsVislibility?.canShowSolutions.isTrue ? (
            <BlockedSolutionsAlertDialog onShowSolutions={onShowSolutions}>
              <ChallengeContentLink
                title='Soluções'
                contentType='solutions'
                isActive={false}
                isBlocked={true}
              />
            </BlockedSolutionsAlertDialog>
          ) : (
            <ChallengeContentLink
              title='Soluções'
              contentType='solutions'
              isActive={false}
            />
          )}
        </div>
      )}
    </nav>
  )
}
