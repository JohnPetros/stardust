import {
  fetchChallengesList,
  accessChallengePage,
  accessChallengeCommentsSlot,
  voteChallenge,
  editSolution,
  postSolution,
  upvoteSolution,
  viewSolution,
  postChallenge,
  editChallenge,
} from './challengingActions'
import { setCookie, getCookie, deleteCookie, hasCookie } from './cookieActions'
import { accessEndingPage, fetchLessonStoryAndQuestions } from './lessonActions'
import { accessStarPage } from './spaceActions'
import { upvoteComment } from './forumActions'
import { accessProfilePage } from './profileActions'
import { getLastWeekRankingWinners } from './rankingActions'
import { createSnippet, editSnippet } from './playgroundActions'
import {
  accessRewardForStarCompletionPage,
  accessRewardForStarChallengeCompletionPage,
  accessRewardForChallengeCompletionPage,
} from './rewardingActions'
import { signIn, signOut } from './authActions'

export const authActions = { signIn, signOut }

export const cookieActions = { setCookie, getCookie, deleteCookie, hasCookie }

export const challengingActions = {
  fetchChallengesList,
  accessChallengePage,
  accessChallengeCommentsSlot,
  voteChallenge,
  editSolution,
  postSolution,
  postChallenge,
  editChallenge,
  upvoteSolution,
  viewSolution,
}

export const playgroundActions = { createSnippet, editSnippet }

export const profileActions = { accessProfilePage }

export const spaceActions = { accessStarPage }

export const lessonActions = { accessEndingPage, fetchLessonStoryAndQuestions }

export const rankingActions = { getLastWeekRankingWinners }

export const forumActions = { upvoteComment }

export const rewardingActions = {
  accessRewardForStarCompletionPage,
  accessRewardForChallengeCompletionPage,
  accessRewardForStarChallengeCompletionPage,
}
