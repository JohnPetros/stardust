'use client'

import { Comment } from './Comment'
import { useCommentsList } from './useCommentsList'
import { UserCommentInput } from './UserCommentInput'

import { AnimatedArrow } from '@/app/components/AnimatedArrow'
import { PopoverMenu } from '@/app/components/PopoverMenu'
import { Separator } from '@/app/components/Separator'
import { useAuth } from '@/contexts/AuthContext'

export function CommentsList() {
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
  } = useCommentsList()
  const { user: authUser } = useAuth()

  const sorterButtonTitle =
    sorter === 'date' && order === 'ascending'
      ? 'antigos'
      : sorter === 'date' && order === 'descending'
      ? 'recentes'
      : 'votados'

  if (isLoading) return <div>{isLoading}</div>
  return (
    <div className="pb-6 pt-4">
      <header className="flex flex-col gap-3">
        <strong className="text-center text-sm font-semibold text-gray-100">
          {comments?.length} Comentário{comments?.length === 1 ? '' : 's'}
        </strong>
        {comments && (
          <div className="flex justify-end bg-gray-800 px-6 py-2">
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
          id="user-comment"
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
                  upvotes={comment.upvotes ?? 0}
                  isUpvoted={comment.isVoted ?? false}
                  userSlug={comment.user.slug}
                  avatarId={comment.user.avatar_id}
                  createdAt={comment.created_at}
                  isAuthUser={comment.user.slug === authUser?.slug}
                  repliesAmount={comment.repliesAmount ?? 0}
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
