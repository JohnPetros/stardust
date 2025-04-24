'use client'

import Link from 'next/link'

import { useComment } from './useComment'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { AlertDialog } from '../../AlertDialog'
import { Button } from '../../Button'
import { UserAvatar } from '../../UserAvatar'
import { ROUTES } from '@/constants'
import { Loading } from '../../Loading'
import { Separator } from '../../Separator'
import { UpvoteButton } from './UpvoteCommentButton'
import { CommentHeader } from './CommentHeader'
import { CommentContent } from './CommentContent'
import { CommentRepliesButton } from './CommentRepliesButton/CommentRepliesButton'
import { ReplyInput } from './ReplyInput'

type CommentProps = {
  id: string
  content: string
  postedAt: Date
  upvotesCount: number
  repliesCount: number
  isUpvoted: boolean
  authorName: string
  authorSlug: string
  authorAvatar: {
    name: string
    image: string
  }
  isAuthorUser: boolean
  onDelete: (commentId: string) => void
}

export function Comment({
  id,
  content,
  postedAt,
  isUpvoted,
  repliesCount,
  upvotesCount,
  authorAvatar,
  authorName,
  authorSlug,
  isAuthorUser,
  onDelete,
}: CommentProps) {
  const {
    replies,
    isUserReplyInputVisible,
    isRepliesVisible,
    isLoadingReplies,
    popoverMenuButtons,
    canEditComment,
    alertDialogRef,
    handleToggleIsUserReplyInputVisible,
    handleToggleIsRepliesVisible,
    handleReplySend,
    handleDeleteUserReply,
    handleCancelUserReply,
    handleEditComment,
    handleCancelCommentEdition,
  } = useComment(id)
  const { user } = useAuthContext()
  const hasReplies = (replies && replies.length > 0) || repliesCount > 0 || false

  return (
    <>
      <AlertDialog
        ref={alertDialogRef}
        type='asking'
        title='Você tem certeza?'
        body={
          <p className='text-center text-base leading-6 text-gray-300'>
            Você tem certeza que deseja deletar esse comentário?
          </p>
        }
        action={
          <Button onClick={() => onDelete(id)} className='bg-red-700 text-gray-50'>
            Deletar
          </Button>
        }
        cancel={
          <Button autoFocus className='bg-green-400 text-gray-800'>
            Cancelar
          </Button>
        }
        shouldPlayAudio={false}
      />
      <div className='w-full'>
        <div className='flex w-full gap-2'>
          <Link href={`${ROUTES.profile.user(authorSlug)}`}>
            <UserAvatar
              avatarName={authorAvatar.name}
              avatarImage={authorAvatar.image}
              size={32}
            />
          </Link>
          <div className='w-full'>
            <CommentHeader
              authorName={authorName}
              authorSlug={authorSlug}
              commentPostedAt={postedAt}
              isAuthorUser={isAuthorUser}
              popoverMenuButtons={popoverMenuButtons}
            />
            <div className='mt-1'>
              <CommentContent
                initialContent={content}
                commentId={id}
                canEditComment={canEditComment}
                onEdit={handleEditComment}
                onCancel={handleCancelCommentEdition}
              />
              <div className='mt-2 flex w-full justify-between'>
                <UpvoteButton
                  commentId={id}
                  initialUpvotesCount={upvotesCount}
                  isCommentUpvoted={isUpvoted}
                />
                <div className='flex items-center gap-2'>
                  <CommentRepliesButton
                    hasReplies={hasReplies}
                    isRepliesVisible={isRepliesVisible}
                    repliesCount={replies?.length > 0 ? replies?.length : repliesCount}
                    onToggleRepliesVisible={handleToggleIsRepliesVisible}
                  />
                  <Separator />
                  <button
                    type='button'
                    onClick={handleToggleIsUserReplyInputVisible}
                    className='flex items-center gap-2 text-sm text-gray-300'
                  >
                    Responder
                  </button>
                </div>
              </div>
            </div>
            <div className='mt-3'>
              {isUserReplyInputVisible && (
                <ReplyInput
                  commentId={id}
                  onSend={handleReplySend}
                  onCancel={handleCancelUserReply}
                />
              )}
            </div>
            {isRepliesVisible && user && (
              <>
                {isLoadingReplies ? (
                  <div className='grid w-full place-content-center'>
                    <Loading />
                  </div>
                ) : (
                  <ul className='mt-3'>
                    {replies.map((reply) => (
                      <li key={reply.id.value}>
                        <Comment
                          id={reply.id.value}
                          content={reply.content.value}
                          upvotesCount={reply.upvotesCount.value}
                          repliesCount={reply.repliesCount.value}
                          isUpvoted={user.hasUpvotedComment(reply.id).isTrue}
                          authorSlug={reply.author.slug.value}
                          authorName={reply.author.name.value}
                          authorAvatar={{
                            name: reply.author.avatar.name.value,
                            image: reply.author.avatar.image.value,
                          }}
                          postedAt={reply.postedAt}
                          isAuthorUser={reply.author.slug.value === user?.slug.value}
                          onDelete={handleDeleteUserReply}
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
