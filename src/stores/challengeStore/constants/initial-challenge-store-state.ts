import type { ChallengeStoreState } from '../types/ChallengeStoreState'

export const INITIAL_CHALLENGE_STORE_STATE: ChallengeStoreState = {
  challenge: null,
  userOutput: [],
  userVote: null,
  results: [],
  mdx: '',
  isEnd: false,
  incorrectAnswersAmount: 0,
  tabHandler: null,
  panelsLayout: 'tabs-left;code_editor-right',
  canShowComments: false,
  canShowSolutions: false,
}
