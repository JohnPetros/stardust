'use server'

import { APP_ERRORS } from "@/global/constants"
import { ICommentsController } from "@/services/api/interfaces/ICommentsController"

export async function _getUserUpvotedCommentsIds(userId: string, commentsController: ICommentsController) {
  // try {
  //   const upvotedCommentsIds = await commentsController.getUserUpvotedCommentsIds(userId)
  //   return upvotedCommentsIds
  // } catch (error) {
  //   console.error(error)
  //   throw new Error(APP_ERRORS.comments.failedUserCommentsIdsFetching)
  // }

  return []
} 
