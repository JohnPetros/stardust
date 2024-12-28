import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengeCraftsVisibility } from '@stardust/core/challenging/structs'
import type { ChallengeVote } from '@stardust/core/challenging/types'

import { INITIAL_CHALLENGE_STORE_STATE } from '../ChallengeStore/constants'
import type { ChallengeStore, PanelsLayout, TabHandler } from '../ChallengeStore/types'

export const useZustandChallengeStore = create<ChallengeStore>()(
  immer((set) => {
    return {
      state: INITIAL_CHALLENGE_STORE_STATE,
      actions: {
        setChallenge(challenge: Challenge) {
          return set(({ state }) => {
            state.challenge = challenge
          })
        },

        setPanelsLayout(panelsLayout: PanelsLayout) {
          return set(({ state }) => {
            state.panelsLayout = panelsLayout
          })
        },

        setCraftsVisibility(craftsVislibility: ChallengeCraftsVisibility) {
          return set(({ state }) => {
            state.craftsVislibility = craftsVislibility
          })
        },

        setTabHandler(tabHandler: TabHandler) {
          return set(({ state }) => {
            state.tabHandler = tabHandler
          })
        },

        setUserOutputs(userOutputs: unknown[]) {
          return set(({ state }) => {
            state.userOutputs = userOutputs
          })
        },

        setVote(vote: ChallengeVote) {
          return set(({ state }) => {
            state.vote = vote
          })
        },

        setIncorrectAnswersAmount(incorrectAnswersAmount: number) {
          return set(({ state }) => {
            state.incorrectAnswersAmount = incorrectAnswersAmount
          })
        },

        setMdx(mdx: string) {
          return set(({ state }) => {
            state.mdx = mdx
          })
        },

        resetStore() {
          return set(({ actions }) => ({
            state: INITIAL_CHALLENGE_STORE_STATE,
            actions,
          }))
        },
      },
    }
  }),
)
