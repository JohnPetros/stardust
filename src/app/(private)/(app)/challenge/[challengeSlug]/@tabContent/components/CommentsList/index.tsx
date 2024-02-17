'use client'

import { Comment } from './Comment'
import { useCommentsList } from './useCommentsList'
import { UserCommentInput } from './UserCommentInput'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { AnimatedArrow } from '@/global/components/AnimatedArrow'
import { Loading } from '@/global/components/Loading'
import { PopoverMenu } from '@/global/components/PopoverMenu'
import { Separator } from '@/global/components/Separator'
import { useBreakpoint } from '@/global/hooks/useBreakpoint'
import { useChallengeStore } from '@/stores/challengeStore'

export function CommentsList() {
  const canShowComments = useChallengeStore(
    (store) => store.state.canShowComments
  )

  const {
    isLoading,
    comments,
    sorter,
    order,
    isPopoverMenuOpen,
    popoverMenuButtons,
    userComment,
    handlePopoverMenuOpenChange,
    handlePostComment,
    handleUserCommentChange,
    handleDeleteComment,
  } = useCommentsList(canShowComments)

  const { user: authUser } = useAuthContext()

  const { md: isMobile } = useBreakpoint()

  if (!canShowComments || isLoading)
    return (
      <div className="grid h-full place-content-center">
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
    <div className="pb-6 pt-4">
      <header className="flex flex-col gap-3">
        <strong className="text-center text-sm font-semibold text-gray-100">
          {comments?.length} Comentário{comments?.length === 1 ? '' : 's'}
        </strong>
        {comments && (
          <div className="flex justify-end rounded-md bg-gray-700 px-6 py-2 md:rounded-none md:bg-gray-800">
            <PopoverMenu
              label="Abrir menu para ordernar lista de conquistas"
              buttons={popoverMenuButtons}
              onOpenChange={handlePopoverMenuOpenChange}
            >
              <button className="flex items-center gap-3 text-sm text-gray-200">
                Mais {sorterButtonTitle}
                <AnimatedArrow isUp={isPopoverMenuOpen} />
              </button>
            </PopoverMenu>
          </div>
        )}
      </header>
      <div className="mt-6 px-6">
        <UserCommentInput
          id={isMobile ? 'user-comment-mobile' : 'user-comment'}
          title="Comentar"
          placeholder="Deixe um comentário sobre esse desafio..."
          comment={userComment}
          onCommentChange={handleUserCommentChange}
          onPost={handlePostComment}
        />
      </div>
      {comments && comments.length === 0 ? (
        <p className="mt-6 text-center text-base font-medium text-gray-100">
          Esse desafio ainda não tem comentários. Seja a primeira pessoa a
          comentar 😉.
        </p>
      ) : (
        <ul className="mt-6 space-y-6 px-6">
          {comments?.map((comment, index, commentsList) => (
            <>
              <li key={comment.id}>
                <Comment
                  id={comment.id}
                  content={comment.content}
                  upvotesCount={comment.upvotesCount ?? 0}
                  isUpvoted={comment.isVoted ?? false}
                  userSlug={comment.user.slug}
                  avatarId={comment.user.avatarId}
                  createdAt={comment.createdAt}
                  isAuthUser={comment.user.slug === authUser?.slug}
                  repliesCount={comment.repliesCount ?? 0}
                  onDelete={handleDeleteComment}
                />
              </li>
              {index < commentsList.length - 1 && (
                <Separator isColumn={false} />
              )}
            </>
          ))}
        </ul>
      )}
    </div>
  )
}

// 62fef857-42fa-4602-8483-4dc4a446927d
// 56b1f86c-7e54-44fd-967a-58abc49e68a2
