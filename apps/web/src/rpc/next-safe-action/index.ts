import {
  accessChallengePage,
  accessChallengeCommentsSlot,
  accessSolutionPage,
  accessChallengeEditorPage,
  viewSolution,
} from './challengingActions'
import { setCookie, getCookie, deleteCookie, hasCookie } from './cookieActions'
import { accessEndingPage, fetchLessonStoryAndQuestions } from './lessonActions'
import { accessStarPage } from './spaceActions'
import { accessProfilePage } from './profileActions'
import { accessSnippetPage } from './playgroundActions'
import {
  accessRewardForStarCompletionPage,
  accessRewardForStarChallengeCompletionPage,
  accessRewardForChallengeCompletionPage,
} from './rewardingActions'
import {
  connectSocialAccount,
  disconnectSocialAccount,
  signIn,
  signOut,
  signUpWithSocialAccount,
} from './authActions'

export const authActions = {
  signIn,
  signOut,
  signUpWithSocialAccount,
  connectSocialAccount,
  disconnectSocialAccount,
}

export const cookieActions = { setCookie, getCookie, deleteCookie, hasCookie }

export const challengingActions = {
  accessChallengePage,
  accessChallengeCommentsSlot,
  accessChallengeEditorPage,
  accessSolutionPage,
  viewSolution,
}

export const playgroundActions = { accessSnippetPage }

export const profileActions = { accessProfilePage }

export const spaceActions = { accessStarPage }

export const lessonActions = { accessEndingPage, fetchLessonStoryAndQuestions }

export const rewardingActions = {
  accessRewardForStarCompletionPage,
  accessRewardForChallengeCompletionPage,
  accessRewardForStarChallengeCompletionPage,
}
