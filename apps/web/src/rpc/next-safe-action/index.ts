import {
  accessChallengePage,
  accessChallengeCommentsSlot,
  accessSolutionPage,
  postChallenge,
  accessChallengeEditorPage,
} from './challengingActions'
import { setCookie, getCookie, deleteCookie, hasCookie } from './cookieActions'
import { accessEndingPage, fetchLessonStoryAndQuestions } from './lessonActions'
import { accessStarPage } from './spaceActions'
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
  accessChallengePage,
  accessChallengeCommentsSlot,
  accessChallengeEditorPage,
  accessSolutionPage,
  postChallenge,
}

export const playgroundActions = { createSnippet, editSnippet }

export const profileActions = { accessProfilePage }

export const spaceActions = { accessStarPage }

export const lessonActions = { accessEndingPage, fetchLessonStoryAndQuestions }

export const rankingActions = { getLastWeekRankingWinners }

export const rewardingActions = {
  accessRewardForStarCompletionPage,
  accessRewardForChallengeCompletionPage,
  accessRewardForStarChallengeCompletionPage,
}
