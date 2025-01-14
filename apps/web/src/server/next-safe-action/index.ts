import { signUp } from './authActionts'
import {
  fetchChallengesList,
  handleChallengePage,
  voteChallenge,
  editSolution,
  postSolution,
  upvoteSolution,
  viewSolution,
  postChallenge,
  editChallenge,
} from './challengingActions'
import { setCookie, getCookie, deleteCookie, hasCookie } from './cookieActions'
import { upvoteComment } from './forumActions'
import { obsverNewUnlockedAchievements } from './profileActions'
import { getLastWeekRankingWinners } from './rankingActions'
import {
  rewardForStarChallengeCompletion,
  rewardForChallengeCompletion,
  rewardForStarCompletion,
} from './rewardingActions'

export const authActions = { signUp }
export const cookieActions = { setCookie, getCookie, deleteCookie, hasCookie }
export const challengingActions = {
  fetchChallengesList,
  handleChallengePage,
  voteChallenge,
  editSolution,
  postSolution,
  postChallenge,
  editChallenge,
  upvoteSolution,
  viewSolution,
}
export const profileActions = { obsverNewUnlockedAchievements }
export const rankingActions = { getLastWeekRankingWinners }
export const forumActions = { upvoteComment }
export const rewardingActions = {
  rewardForStarChallengeCompletion,
  rewardForChallengeCompletion,
  rewardForStarCompletion,
}
