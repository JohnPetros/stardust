import { signUp } from './authActionts'
import {
  countCompletedChallengesByDifficultyLevel,
  handleChallengePage,
  voteChallenge,
} from './challengingActions'
import { setCookie, getCookie, deleteCookie, hasCookie } from './cookieActions'
import { obsverNewUnlockedAchievements } from './profileActions'
import { getLastWeekRankingWinners } from './rankingActions'

export const authActions = { signUp }
export const cookieActions = { setCookie, getCookie, deleteCookie, hasCookie }
export const challengingActions = {
  countCompletedChallengesByDifficultyLevel,
  handleChallengePage,
  voteChallenge,
}
export const profileActions = { obsverNewUnlockedAchievements }
export const rankingActions = { getLastWeekRankingWinners }
