'use client'

import { ContentDialog } from '../../layouts/Challenge/ContentDialog'
import { useChallengeCommentsSlot } from './useChallengeCommentsSlot'

export default function ChallengeCommentsSlot() {
  const { isMobile } = useChallengeCommentsSlot()

  if (isMobile)
    return (
      <div className='md:hidden'>
        <ContentDialog contentType='comments'>{/* <CommentsList /> */}</ContentDialog>
      </div>
    )
  //   else return <CommentsList />
}
