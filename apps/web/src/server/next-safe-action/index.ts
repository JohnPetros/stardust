import { signUp } from './authActionts'
import {
  fetchChallengesList,
  accessChallengePage,
  accessChallengeCommentsSlot,
  accessChallengeSolutionsSlot,
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
import { obsverNewUnlockedAchievements } from './profileActions'
import { getLastWeekRankingWinners } from './rankingActions'
import { createSnippet, editSnippet } from './playgroundActions'
import {
  rewardForStarChallengeCompletion,
  rewardForChallengeCompletion,
  rewardForStarCompletion,
} from './rewardingActions'

export const authActions = { signUp }
export const cookieActions = { setCookie, getCookie, deleteCookie, hasCookie }
export const challengingActions = {
  fetchChallengesList,
  accessChallengePage,
  accessChallengeCommentsSlot,
  accessChallengeSolutionsSlot,
  voteChallenge,
  editSolution,
  postSolution,
  postChallenge,
  editChallenge,
  upvoteSolution,
  viewSolution,
}
export const playgroundActions = { createSnippet, editSnippet }
export const profileActions = { obsverNewUnlockedAchievements }
export const spaceActions = { accessStarPage }
export const lessonActions = { accessEndingPage, fetchLessonStoryAndQuestions }
export const rankingActions = { getLastWeekRankingWinners }
export const forumActions = { upvoteComment }
export const rewardingActions = {
  rewardForStarChallengeCompletion,
  rewardForChallengeCompletion,
  rewardForStarCompletion,
}
