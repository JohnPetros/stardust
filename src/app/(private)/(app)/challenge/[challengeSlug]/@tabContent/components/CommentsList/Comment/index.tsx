'use client'

import Link from 'next/link'

import { Content } from './Content'
import { Header } from './Header'
import { RepliesButton } from './RepliesButton'
import { UpvotesButton } from './UpvotesButton'
import { useComment } from './useComment'
import { UserReplyInput } from './UserReplyInput'

import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { Loading } from '@/app/components/Loading'
import { Separator } from '@/app/components/Separator'
import { UserAvatar } from '@/app/components/UserAvatar'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { ROUTES } from '@/utils/constants'

type CommentProps = {
  id: string
  content: string
  createdAt: Date
  upvotes: number
  repliesAmount: number
  isUpvoted: boolean
  avatarId: string
  userSlug: string
  isAuthUser: boolean
  onDelete: (commentId: string) => void
}

export function Comment({
  id,
  content,
  createdAt,
  isUpvoted,
  repliesAmount,
  upvotes,
  avatarId,
  userSlug,
  onDelete,
}: CommentProps) {
  const {
    replies,
    isUserReplyInputVisible,
    isRepliesVisible,
    isLoadingReplies,
    popoverMenuButtons,
    canEditComment,
    alertRef,
    handleToggleIsUserReplyInputVisible,
    handleToggleIsRepliesVisible,
    handlePostUserReply,
    handleCancelUserReply,
    handleEditComment,
    handleCancelCommentEdition,
  } = useComment(id)

  const { user } = useAuthContext()

  const hasReplies =
    repliesAmount > 0 || (replies && replies.length > 0) || false

  return (
    <>
      <Alert
        ref={alertRef}
        type="asking"
        title="Você tem certeza?"
        body={
          <p className="text-center text-base leading-6 text-gray-300">
            Você tem certeza que deseja deletar esse comentário?
          </p>
        }
        action={
          <Button
            autoFocus
            onClick={() => onDelete(id)}
            className="bg-red-700 text-gray-50"
          >
            Deletar
          </Button>
        }
        cancel={<Button className="bg-gray-600 text-gray-50">Cancelar</Button>}
        canPlaySong={false}
      />
      <div className="w-full">
        <div className="flex w-full gap-2">
          <Link href={`${ROUTES.private.home.profile}/${userSlug}`}>
            <UserAvatar avatarId={avatarId} size={32} />
          </Link>
          <div className="w-full">
            <Header
              userSlug={userSlug}
              commentCreatedAt={createdAt}
              isAuthUser={userSlug === user?.slug}
              popoverMenuButtons={popoverMenuButtons}
            />
            <div className="mt-1">
              <Content
                initialContent={content}
                commentId={id}
                canEditComment={canEditComment}
                onEdit={handleEditComment}
                onCancel={handleCancelCommentEdition}
              />
              <div className="mt-2 flex w-full justify-between">
                <UpvotesButton
                  commentId={id}
                  initialUpvotes={upvotes}
                  isCommentUpvoted={isUpvoted}
                />
                <div className="flex items-center gap-2">
                  <RepliesButton
                    hasReplies={hasReplies}
                    isRepliesVisible={isRepliesVisible}
                    repliesAmount={replies?.length ?? repliesAmount}
                    onToggleRepliesVisible={handleToggleIsRepliesVisible}
                  />
                  <Separator />
                  <button
                    onClick={handleToggleIsUserReplyInputVisible}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    Responder
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-3">
              {isUserReplyInputVisible && (
                <UserReplyInput
                  commentId={id}
                  onPostReply={handlePostUserReply}
                  onCancel={handleCancelUserReply}
                />
              )}
            </div>
            {isRepliesVisible && (
              <>
                {isLoadingReplies ? (
                  <div className="grid w-full place-content-center">
                    <Loading />
                  </div>
                ) : (
                  <ul className="mt-3">
                    {replies?.map((reply) => (
                      <li key={reply.id}>
                        <Comment
                          id={reply.id}
                          content={reply.content}
                          upvotes={reply.upvotes ?? 0}
                          isUpvoted={reply.isVoted ?? false}
                          userSlug={reply.user.slug}
                          avatarId={reply.user.avatar_id}
                          createdAt={reply.created_at}
                          isAuthUser={reply.user.slug === user?.slug}
                          repliesAmount={reply.repliesAmount ?? 0}
                          onDelete={onDelete}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

//  f146.secretaria@fatec.sp.gov.br
// 1239054699
