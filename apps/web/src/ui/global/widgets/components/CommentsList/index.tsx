'use client'

import type { TopicDto } from '@stardust/core/forum/dtos'
import { Topic } from '@stardust/core/forum/entities'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useBreakpoint } from '@/ui/global/hooks'
import { AnimatedArrow } from '../AnimatedArrow'
import { PopoverMenu } from '../PopoverMenu'
import { Separator } from '../Separator'
import { useCommentsList } from './useCommentsList'
import { Loading } from '../Loading'
import { Comment } from './Comment'
import { CommentInput } from './CommentInput'

type CommentsListProps = {
  topicDto: TopicDto
}

export function CommentsList({ topicDto }: CommentsListProps) {
  const topic = Topic.create(topicDto)
  const {
    isLoading,
    comments,
    sorter,
    order,
    isPopoverMenuOpen,
    popoverMenuButtons,
    commentContent,
    handlePopoverMenuOpenChange,
    handleSendComment,
    handleCommentChange,
    handleDeleteComment,
  } = useCommentsList(topic)
  const { user } = useAuthContext()
  const { md: isMobile } = useBreakpoint()

  if (isLoading)
    return (
      <div className='grid h-full place-content-center'>
        <Loading />
      </div>
    )

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
          {comments?.length} Comentário{comments?.length === 1 ? '' : 's'}
        </strong>
        {comments && (
          <div className='flex justify-end rounded-md bg-gray-700 px-6 py-2 md:rounded-none md:bg-gray-800'>
            <PopoverMenu
              label='Abrir menu para ordernar lista de conquistas'
              buttons={popoverMenuButtons}
              onOpenChange={handlePopoverMenuOpenChange}
            >
              <button
                type='button'
                className='flex items-center gap-3 text-sm text-gray-200'
              >
                Mais {sorterButtonTitle}
                <AnimatedArrow isUp={isPopoverMenuOpen} />
              </button>
            </PopoverMenu>
          </div>
        )}
      </header>
      <div className='mt-6 px-6'>
        <CommentInput
          id={isMobile ? 'user-comment-mobile' : 'user-comment'}
          title='Comentar'
          placeholder='Deixe um comentário sobre esse desafio...'
          content={commentContent}
          onChange={handleCommentChange}
          onSend={handleSendComment}
        />
      </div>
      {comments && comments.length === 0 ? (
        <p className='mt-6 text-center text-base font-medium text-gray-100'>
          Esse desafio ainda não tem comentários. Seja a primeira pessoa a comentar 😉.
        </p>
      ) : (
        <ul className='mt-6 space-y-6 px-6'>
          {comments?.map((comment, index, commentsList) => {
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
                      createdAt={comment.createdAt}
                      isAuthorUser={comment.author.slug.value === user?.slug.value}
                      topic={topic}
                      onDelete={handleDeleteComment}
                    />
                  </li>
                  {index < commentsList.length - 1 && <Separator isColumn={false} />}
                </>
              )
          })}
        </ul>
      )}
    </div>
  )
}
