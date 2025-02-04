'use client'

import type { ContentType } from '../../layouts/Challenge/types'
import { BlockedCommentsAlertDialog } from '../BlockedCommentsAlertDialog'
import { BlockedSolutionsAlertDialog } from '../BlockedSolutionsAlertDialog'
import { ContentLink } from '../ContentLink'
import { useChallengeContentNav } from './useChallengeContentNav'

type ChallengeContentNavProps = {
  contents: ContentType[]
}

export function ChallengeContentNav({ contents }: ChallengeContentNavProps) {
  const { craftsVislibility, handleShowSolutions } = useChallengeContentNav()

  return (
    <nav className='flex items-center gap-2 md:hidden'>
      {contents.includes('description') && (
        <ContentLink
          title='Descrição'
          contentType='description'
          isActive={false}
          isBlocked={true}
        />
      )}
      {contents.includes('comments') && (
        <>
          {craftsVislibility.canShowSolutions.isFalse ? (
            <BlockedCommentsAlertDialog>
              <ContentLink
                title='Comentários'
                contentType='comments'
                isActive={false}
                isBlocked={true}
              />
            </BlockedCommentsAlertDialog>
          ) : (
            <ContentLink
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
          {craftsVislibility.canShowSolutions.isTrue ? (
            <BlockedSolutionsAlertDialog onShowSolutions={handleShowSolutions}>
              <ContentLink
                title='Soluções'
                contentType='solutions'
                isActive={false}
                isBlocked={true}
              />
            </BlockedSolutionsAlertDialog>
          ) : (
            <ContentLink title='Soluções' contentType='solutions' isActive={false} />
          )}
        </>
      )}
    </nav>
  )
}
