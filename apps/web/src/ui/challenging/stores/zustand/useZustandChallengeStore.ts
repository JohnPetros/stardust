import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengeCraftsVisibility } from '@stardust/core/challenging/structures'
import type { TextSelection, CodeSelection } from '@stardust/core/global/structures'

import { INITIAL_CHALLENGE_STORE_STATE } from '../ChallengeStore/constants'
import type {
  ChallengeStore,
  ChallengeContent,
  DockablePanelId,
  PanelsLayout,
  PanelsOffset,
  TabHandler,
} from '../ChallengeStore/types'
import {
  DEFAULT_PANEL_ORDER,
  DEFAULT_PANELS_OFFSET,
} from '../../widgets/layouts/Challenge/constants/panel-layout'

export const useZustandChallengeStore = create<ChallengeStore>()(
  immer((set) => {
    return {
      state: INITIAL_CHALLENGE_STORE_STATE,
      actions: {
        setChallenge(challenge: Challenge | null) {
          return set(({ state }) => {
            state.challenge = challenge
          })
        },

        setActiveContent(activeContent: ChallengeContent) {
          return set(({ state }) => {
            state.activeContent = activeContent
          })
        },

        setPanelsLayout(panelsLayout: PanelsLayout) {
          return set(({ state }) => {
            state.panelsLayout = panelsLayout
          })
        },

        setPanelOrder(panelOrder: DockablePanelId[]) {
          return set(({ state }) => {
            state.panelOrder = panelOrder
          })
        },

        setPanelsOffset(panelsOffset: PanelsOffset) {
          return set(({ state }) => {
            state.panelsOffset = panelsOffset
          })
        },

        resetPanelsLayout() {
          return set(({ state }) => {
            state.panelOrder = DEFAULT_PANEL_ORDER
            state.panelsOffset = DEFAULT_PANELS_OFFSET
          })
        },

        setResults(results: boolean[]) {
          return set(({ state }) => {
            state.results = results
          })
        },

        setCraftsVisibility(craftsVislibility: ChallengeCraftsVisibility) {
          return set(({ state }) => {
            state.craftsVislibility = craftsVislibility
          })
        },

        setIsAssistantEnabled(isAssistantEnabled: boolean) {
          return set(({ state }) => {
            state.isAssistantEnabled = isAssistantEnabled
          })
        },

        setTabHandler(tabHandler: TabHandler) {
          return set(({ state }) => {
            state.tabHandler = tabHandler
          })
        },

        setMdx(mdx: string) {
          return set(({ state }) => {
            state.mdx = mdx
          })
        },

        setTextSelection(textSelection: TextSelection | null) {
          return set(({ state }) => {
            state.assistantSelections.textSelection = textSelection
          })
        },

        setCodeSelection(codeSelection: CodeSelection | null) {
          return set(({ state }) => {
            state.assistantSelections.codeSelection = codeSelection
          })
        },

        clearTextSelection() {
          return set(({ state }) => {
            state.assistantSelections.textSelection = null
          })
        },

        clearCodeSelection() {
          return set(({ state }) => {
            state.assistantSelections.codeSelection = null
          })
        },

        clearAssistantSelections() {
          return set(({ state }) => {
            state.assistantSelections = {
              textSelection: null,
              codeSelection: null,
            }
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
