import { useMemo } from 'react'

import type { Comment as CommentEntity } from '@stardust/core/forum/entities'
import type { CommentsListSorter } from '@stardust/core/forum/structures'
import type { IdsList, ListingOrder } from '@stardust/core/global/structures'

import { AnimatedArrow } from '../AnimatedArrow'
import { PopoverMenu } from '../PopoverMenu'
import { Separator } from '../Separator'
import { Comment } from './Comment'
import { CommentInput } from './CommentInput'
import type { CommentsListProps } from './CommentsListProps'
import { CommentSkeleton } from './CommentSkeleton'
import { ShowMoreButton } from '../ShowMoreButton'
import type { PopoverMenuButton } from '../PopoverMenu/types'
import { Button } from '../Button'
import { AccountRequirementAlertDialog } from '../AccountRequirementAlertDialog'

type Props = {
  isLoading: boolean
  isAccountAuthenticated: boolean
  inputPlaceholder: string
  emptyListMessage: string
  userUpvotedCommentIds: IdsList
  userSlug: string
  comments: CommentEntity[]
  sorter: CommentsListSorter
  order: ListingOrder
  isRecheadedEnd: boolean
  isPopoverMenuOpen: boolean
  popoverMenuButtons: PopoverMenuButton[]
  onPopoverMenuOpenChange: (isOpen: boolean) => void
  onShowMore: () => void
  onSendComment: (comment: string) => void
  onDeleteComment: (commentId: string) => void
} & CommentsListProps

export const CommentsListView = ({
  isLoading,
  isAccountAuthenticated,
  inputPlaceholder,
  emptyListMessage,
  userUpvotedCommentIds,
  userSlug,
  comments,
  sorter,
  order,
  isRecheadedEnd,
  isPopoverMenuOpen,
  popoverMenuButtons,
  onPopoverMenuOpenChange,
  onShowMore,
  onSendComment,
  onDeleteComment,
}: Props) => {
  const sorterButtonTitle = useMemo(() => {
    if (sorter.isByDate.and(order.isAscending).isTrue) {
      return 'antigos'
    }
    if (sorter.isByDate.and(order.isDescending).isTrue) {
      return 'recentes'
    }
    return 'votados'
  }, [sorter, order])

  return (
    <div className='pb-6 pt-4'>
      <header className='flex flex-col gap-3'>
        <strong className='text-center text-sm font-semibold text-gray-100'>
          {comments?.length} Comentário{comments?.length !== 1 && 's'}
        </strong>
        <div className='flex justify-end rounded-md bg-gray-700 px-6 py-2 md:rounded-none md:bg-gray-800'>
          <PopoverMenu
            label='Abrir menu para ordernar lista de conquistas'
            buttons={popoverMenuButtons}
            onOpenChange={onPopoverMenuOpenChange}
          >
            <div className='flex items-center gap-3 text-sm text-gray-200'>
              Mais {sorterButtonTitle}
              <AnimatedArrow isUp={isPopoverMenuOpen} />
            </div>
          </PopoverMenu>
        </div>
      </header>
      <div className='mt-6 px-6'>
        <CommentInput
          id='user-comment'
          title='Comentar'
          placeholder={inputPlaceholder}
          onSend={onSendComment}
        />
      </div>

      {!isAccountAuthenticated && (
        <AccountRequirementAlertDialog description='Acesse a sua conta para ver deixar seu comentário para este desafio'>
          <Button className='w-96 mx-auto mt-12'>Comentar</Button>
        </AccountRequirementAlertDialog>
      )}

      {!isLoading && comments.length === 0 ? (
        <p className='mt-12 text-center text-sm font-medium text-gray-100'>
          {emptyListMessage}
        </p>
      ) : (
        <div className='px-6 mt-16'>
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
                return (
                  <li key={comment.id.value}>
                    <Comment
                      id={comment.id.value}
                      content={comment.content.value}
                      upvotesCount={comment.upvotesCount.value}
                      repliesCount={comment.repliesCount.value}
                      isUpvoted={userUpvotedCommentIds.includes(comment.id).isTrue}
                      authorSlug={comment.author.slug.value}
                      authorName={comment.author.name.value}
                      authorAvatar={{
                        name: comment.author.avatar.name.value,
                        image: comment.author.avatar.image.value,
                      }}
                      postedAt={comment.postedAt}
                      isAuthorUser={comment.author.slug.value === userSlug}
                      isAccountAuthenticated={isAccountAuthenticated}
                      onDelete={onDeleteComment}
                    />
                    {index < commentsList.length - 1 && <Separator isColumn={false} />}
                  </li>
                )
              })}
          </ul>
          {!isRecheadedEnd && (
            <ShowMoreButton
              isLoading={isLoading}
              onClick={onShowMore}
              className='mt-24'
            />
          )}
        </div>
      )}
    </div>
  )
}
