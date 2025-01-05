import { signUp } from './authActionts'
import {
  handleChallengePage,
  voteChallenge,
  editSolution,
  postSolution,
  upvoteSolution,
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
  handleChallengePage,
  voteChallenge,
  editSolution,
  postSolution,
  upvoteSolution,
}
export const profileActions = { obsverNewUnlockedAchievements }
export const rankingActions = { getLastWeekRankingWinners }
export const forumActions = { upvoteComment }
export const rewardingActions = {
  rewardForStarChallengeCompletion,
  rewardForChallengeCompletion,
  rewardForStarCompletion,
}
