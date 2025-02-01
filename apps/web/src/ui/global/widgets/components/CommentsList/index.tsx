'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { AnimatedArrow } from '../AnimatedArrow'
import { PopoverMenu } from '../PopoverMenu'
import { Separator } from '../Separator'
import { useCommentsList } from './useCommentsList'
import { Comment } from './Comment'
import { CommentInput } from './CommentInput'
import type { CommentsListProps } from './CommentsListProps'
import { CommentSkeleton } from './CommentSkeleton'
import { ShowMoreButton } from '../ShowMoreButton'

type Props = {
  inputPlaceholder: string
  emptyListMessage: string
} & CommentsListProps

export function CommentsList({
  inputPlaceholder,
  emptyListMessage,
  onSaveComment,
  onFetchComments,
}: Props) {
  const {
    isLoading,
    comments,
    sorter,
    order,
    isRecheadedEnd,
    isPopoverMenuOpen,
    popoverMenuButtons,
    nextPage,
    handlePopoverMenuOpenChange,
    handleSendComment,
    handleDeleteComment,
  } = useCommentsList({ onSaveComment, onFetchComments })
  const { user } = useAuthContext()
  const { md: isMobile } = useBreakpoint()

  const sorterButtonTitle =
    sorter === 'date' && order === 'ascending'
      ? 'antigos'
      : sorter === 'date' && order === 'descending'
        ? 'recentes'
        : 'votados'

  return (
    <div className='pb-6 pt-4'>
      <header className='flex flex-col gap-3'>
        <strong className='text-center text-sm font-semibold text-gray-100'>
          {comments?.length} Comentário{comments?.length !== 1 && 's'}
        </strong>
        {comments && (
          <div className='flex justify-end rounded-md bg-gray-700 px-6 py-2 md:rounded-none md:bg-gray-800'>
            <PopoverMenu
              label='Abrir menu para ordernar lista de conquistas'
              buttons={popoverMenuButtons}
              onOpenChange={handlePopoverMenuOpenChange}
            >
              <div className='flex items-center gap-3 text-sm text-gray-200'>
                Mais {sorterButtonTitle}
                <AnimatedArrow isUp={isPopoverMenuOpen} />
              </div>
            </PopoverMenu>
          </div>
        )}
      </header>
      <div className='mt-6 px-6'>
        <CommentInput
          id={isMobile ? 'user-comment-mobile' : 'user-comment'}
          title='Comentar'
          placeholder={inputPlaceholder}
          onSend={handleSendComment}
        />
      </div>

      {!isLoading && comments.length === 0 ? (
        <p className='mt-12 text-center text-sm font-medium text-gray-100'>
          {emptyListMessage}
        </p>
      ) : (
        <div className='px-6'>
          <ul className='mt-6 space-y-6'>
            {isLoading && (
              <>
                <CommentSkeleton />
                <Separator isColumn={false} />
                <CommentSkeleton />
                <Separator isColumn={false} />
                <CommentSkeleton />
                <Separator isColumn={false} />
                <CommentSkeleton />
              </>
            )}

            {!isLoading &&
              comments &&
              comments.map((comment, index, commentsList) => {
                if (user)
                  return (
                    <>
                      <li key={comment.id}>
                        <Comment
                          id={comment.id}
                          content={comment.content.value}
                          upvotesCount={comment.upvotesCount.value}
                          repliesCount={comment.repliesCount.value}
                          isUpvoted={user.hasUpvotedComment(comment.id).isTrue}
                          authorSlug={comment.author.slug.value}
                          authorName={comment.author.name.value}
                          authorAvatar={{
                            name: comment.author.avatar.name.value,
                            image: comment.author.avatar.image.value,
                          }}
                          postedAt={comment.postedAt}
                          isAuthorUser={comment.author.slug.value === user?.slug.value}
                          onDelete={handleDeleteComment}
                        />
                      </li>
                      {index < commentsList.length - 1 && <Separator isColumn={false} />}
                    </>
                  )
              })}
          </ul>
          {!isRecheadedEnd && (
            <ShowMoreButton isLoading={isLoading} onClick={nextPage} className='mt-24' />
          )}
        </div>
      )}
    </div>
  )
}
