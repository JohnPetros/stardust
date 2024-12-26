import { signUp } from './authActionts'
import { countCompletedChallengesByDifficultyLevel } from './challengingActions'
import { setCookie, getCookie, deleteCookie, hasCookie } from './cookieActions'
import { obsverNewUnlockedAchievements } from './profileActions'
import { getLastWeekRankingWinners } from './rankingActions'

export const authActions = { signUp }
export const cookieActions = { setCookie, getCookie, deleteCookie, hasCookie }
export const challengingActions = { countCompletedChallengesByDifficultyLevel }
export const profileActions = { obsverNewUnlockedAchievements }
export const rankingActions = { getLastWeekRankingWinners }
