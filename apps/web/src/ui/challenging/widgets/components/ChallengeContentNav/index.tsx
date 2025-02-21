'use client'

import type { ChallengeContent } from '@/ui/challenging/stores/ChallengeStore/types'
import { BlockedCommentsAlertDialog } from '../BlockedCommentsAlertDialog'
import { BlockedSolutionsAlertDialog } from '../BlockedSolutionsAlertDialog'
import { ChallengeContentLink } from '../ChallengeContentLink'
import { useChallengeContentNav } from './useChallengeContentNav'

type ChallengeContentNavProps = {
  contents: ChallengeContent[]
}

export function ChallengeContentNav({ contents }: ChallengeContentNavProps) {
  const { craftsVislibility, handleShowSolutions } = useChallengeContentNav()

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
        <>
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
        </>
      )}
      {contents.includes('solutions') && (
        <>
          {craftsVislibility?.canShowSolutions.isTrue ? (
            <BlockedSolutionsAlertDialog onShowSolutions={handleShowSolutions}>
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
        </>
      )}
    </nav>
  )
}
