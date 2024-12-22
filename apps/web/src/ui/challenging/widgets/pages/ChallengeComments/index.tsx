'use client'

import { useBreakpoint } from ''@/ui/global/hooks''
import { ContentDialog } from '../../layouts/Challenge/ContentDialog'

export default function ChallengeCommentsPage() {
  const { md: isMobile } = useBreakpoint()

  if (isMobile)
    return (
      <div className='md:hidden'>
        <ContentDialog contentType='comments'>{/* <CommentsList /> */}</ContentDialog>
      </div>
    )
  //   else return <CommentsList />
}
