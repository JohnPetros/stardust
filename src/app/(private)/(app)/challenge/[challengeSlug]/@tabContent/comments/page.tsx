'use client'

import { ContentDialog } from '../../components/Layout/ContentDialog'
import { CommentsList } from '../components/CommentsList'

import { useBreakpoint } from '@/global/hooks/useBreakpoint'

export default function CommentsSlot() {
  const { md: isMobile } = useBreakpoint()

  if (isMobile)
    return (
      <div className="md:hidden">
        <ContentDialog contentType="comments">
          <CommentsList />
        </ContentDialog>
      </div>
    )
  else return <CommentsList />
}
