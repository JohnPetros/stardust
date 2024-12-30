import { signUp } from './authActionts'
import { handleChallengePage, voteChallenge } from './challengingActions'
import { setCookie, getCookie, deleteCookie, hasCookie } from './cookieActions'
import { upvoteComment } from './forumActions'
import { obsverNewUnlockedAchievements } from './profileActions'
import { getLastWeekRankingWinners } from './rankingActions'

export const authActions = { signUp }
export const cookieActions = { setCookie, getCookie, deleteCookie, hasCookie }
export const challengingActions = {
  handleChallengePage,
  voteChallenge,
}
export const profileActions = { obsverNewUnlockedAchievements }
export const rankingActions = { getLastWeekRankingWinners }
export const forumActions = { upvoteComment }
