'use client'

import { CaretUp } from '@phosphor-icons/react'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

import { CommentInput } from '../CommentInput'

import { useComment } from './useComment'

import { UserAvatar } from '@/app/(private)/(app)/(home)/components/UseAvatar'
import { Loading } from '@/app/components/Loading'
import { Separator } from '@/app/components/Separator'
import { useAuth } from '@/contexts/AuthContext'
import { useDate } from '@/services/date'
import { ROUTES } from '@/utils/constants'
import { deslugify } from '@/utils/helpers'

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
  isAuthUser,
}: CommentProps) {
  const {
    replies,
    userReply,
    isUserReplyInputVisible,
    isRepliesVisible,
    isLoadingReplies,
    handleToggleIsUserReplyInputVisible,
    handleToggleIsRepliesVisible,
    handlePostUserReply,
    handleUserReplyChange,
  } = useComment(id)
  const { user } = useAuth()

  const { format } = useDate()
  const userName = deslugify(userSlug)
  const date = format(createdAt, 'DD/MM/YYYY')
  const hasReplies = repliesAmount > 0 || (replies && replies.length > 0)
  console.log(repliesAmount)

  return (
    <div className="w-full">
      <div className="flex w-full gap-2">
        <Link href={`${ROUTES.private.home.profile}/${userSlug}`}>
          <UserAvatar avatarId={avatarId} size={32} />
        </Link>
        <div className="w-full">
          <header className="flex items-start justify-between">
            <Link
              href={`${ROUTES.private.home.profile}/${userSlug}`}
              className="text-base text-green-700"
            >
              {userName}
            </Link>
            <div className="flex items-center ">
              <time className="text-base text-green-700">{date}</time>
            </div>
          </header>
          <div className="mt-1 text-base text-gray-200">
            {content}
            <div className="mt-2 flex w-full justify-between">
              <button
                className={twMerge(
                  'flex items-center gap-1 text-sm text-gray-300',
                  isUpvoted ? 'text-green-700' : 'text-gray-300'
                )}
              >
                <CaretUp
                  className={isUpvoted ? 'text-green-700' : 'text-gray-300'}
                />
                +{upvotes}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleIsRepliesVisible}
                  // disabled={Boolean(repliesAmount)}
                  className={twMerge(
                    'flex items-center gap-2 text-sm',
                    hasReplies
                      ? ' cursor-pointer text-gray-300'
                      : 'pointer-events-none text-gray-500'
                  )}
                >
                  {hasReplies && (
                    <span>{isRepliesVisible ? 'Esconder' : 'Mostrar'}</span>
                  )}
                  respostas ({replies?.length ?? repliesAmount})
                </button>
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
              <CommentInput
                id={`user-reply-${id}`}
                placeholder="responda esse usuário..."
                comment={userReply}
                onCommentChange={handleUserReplyChange}
                onPost={handlePostUserReply}
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
  )
}

//  f146.secretaria@fatec.sp.gov.br
// 1239054699
