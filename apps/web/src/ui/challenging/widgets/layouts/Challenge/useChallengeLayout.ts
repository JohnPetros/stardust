import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type {
  ImperativePanelGroupHandle,
  ImperativePanelHandle,
} from 'react-resizable-panels'

import { COOKIES } from '@/constants'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import type {
  DockablePanelId,
  PanelsOffset,
} from '@/ui/challenging/stores/ChallengeStore/types'
import { useSecondsCounter } from '@/ui/global/hooks/useSecondsCounter'
import { useCookieActions } from '@/ui/global/hooks/useCookieActions'
import { DEFAULT_PANEL_ORDER, MIN_PANEL_SIZES } from './constants/panel-layout'
import { getDirectionalDropPanelId } from './utils/getDirectionalDropPanelId'
import { getVisiblePanelOrder } from './utils/getVisiblePanelOrder'
import { reorderDockablePanels } from './utils/reorderDockablePanels'

type Params = {
  panelGroupRef: RefObject<ImperativePanelGroupHandle | null>
  tabsPanelRef: RefObject<ImperativePanelHandle | null>
  codeEditorPanelRef: RefObject<ImperativePanelHandle | null>
  assistantPanelRef: RefObject<ImperativePanelHandle | null>
  initialPanelOrder: DockablePanelId[]
  initialPanelsOffset: PanelsOffset
}

type PanelSizes = Record<DockablePanelId, number>

const PANEL_SIZE_CHANGE_TOLERANCE = 0.1

const PANEL_SIZE_KEYS = {
  tabs: 'tabsPanelSize',
  code_editor: 'codeEditorPanelSize',
  assistant: 'assistantPanelSize',
} as const satisfies Record<DockablePanelId, keyof PanelsOffset>

const PANEL_MIN_SIZES = {
  tabs: MIN_PANEL_SIZES.tabs,
  code_editor: MIN_PANEL_SIZES.codeEditor,
  assistant: MIN_PANEL_SIZES.assistant,
} as const satisfies Record<DockablePanelId, number>

function getPanelSize(panelId: DockablePanelId, panelsOffset: PanelsOffset) {
  return panelsOffset[PANEL_SIZE_KEYS[panelId]]
}

function normalizePanelSizes(panelOrder: DockablePanelId[], panelsOffset: PanelsOffset) {
  const rawSizes = panelOrder.map((panelId) => getPanelSize(panelId, panelsOffset))
  const rawTotal = rawSizes.reduce((total, size) => total + size, 0)
  const normalizedSizes =
    rawTotal > 0
      ? rawSizes.map((size) => (size / rawTotal) * 100)
      : panelOrder.map(() => 100 / panelOrder.length)
  const lockedPanelIndexes = new Set<number>()
  const finalSizes = [...normalizedSizes]

  while (lockedPanelIndexes.size < panelOrder.length) {
    const lockedTotal = [...lockedPanelIndexes].reduce(
      (total, index) => total + PANEL_MIN_SIZES[panelOrder[index]],
      0,
    )
    const unlockedIndexes = panelOrder
      .map((_, index) => index)
      .filter((index) => !lockedPanelIndexes.has(index))
    const unlockedRawTotal = unlockedIndexes.reduce(
      (total, index) => total + normalizedSizes[index],
      0,
    )
    const availableSize = Math.max(100 - lockedTotal, 0)
    let lockedNewPanel = false

    for (const index of unlockedIndexes) {
      const nextSize =
        unlockedRawTotal > 0
          ? (normalizedSizes[index] / unlockedRawTotal) * availableSize
          : availableSize / unlockedIndexes.length

      if (nextSize < PANEL_MIN_SIZES[panelOrder[index]]) {
        lockedPanelIndexes.add(index)
        finalSizes[index] = PANEL_MIN_SIZES[panelOrder[index]]
        lockedNewPanel = true
      } else {
        finalSizes[index] = nextSize
      }
    }

    if (!lockedNewPanel) break
  }

  return finalSizes
}

function getPanelSizes(panelOrder: DockablePanelId[], panelsOffset: PanelsOffset) {
  const normalizedSizes = normalizePanelSizes(panelOrder, panelsOffset)

  return DEFAULT_PANEL_ORDER.reduce((sizes, panelId) => {
    const panelIndex = panelOrder.indexOf(panelId)

    sizes[panelId] =
      panelIndex >= 0 ? normalizedSizes[panelIndex] : getPanelSize(panelId, panelsOffset)

    return sizes
  }, {} as PanelSizes)
}

function isDockablePanelId(value: unknown): value is DockablePanelId {
  return DEFAULT_PANEL_ORDER.includes(value as DockablePanelId)
}

function arePanelsOffsetEqual(firstOffset: PanelsOffset, secondOffset: PanelsOffset) {
  return DEFAULT_PANEL_ORDER.every((panelId) => {
    const panelSizeKey = PANEL_SIZE_KEYS[panelId]

    return (
      Math.abs(firstOffset[panelSizeKey] - secondOffset[panelSizeKey]) <
      PANEL_SIZE_CHANGE_TOLERANCE
    )
  })
}

function arePanelOrdersEqual(
  firstPanelOrder: DockablePanelId[],
  secondPanelOrder: DockablePanelId[],
) {
  return (
    firstPanelOrder.length === secondPanelOrder.length &&
    firstPanelOrder.every((panelId, index) => panelId === secondPanelOrder[index])
  )
}

function serializePanelsLayout(
  panelOrder: DockablePanelId[],
  panelsOffset: PanelsOffset,
) {
  return JSON.stringify({
    panelOrder,
    ...panelsOffset,
  })
}

export function useChallengeLayout({
  panelGroupRef,
  initialPanelOrder,
  initialPanelsOffset,
}: Params) {
  const {
    getChallengeSlice,
    getIsAssistantEnabledSlice,
    getPanelOrderSlice,
    getPanelsOffsetSlice,
  } = useChallengeStore()
  const { challenge } = getChallengeSlice()
  const { isAssistantEnabled } = getIsAssistantEnabledSlice()
  const { panelOrder, setPanelOrder } = getPanelOrderSlice()
  const { panelsOffset, setPanelsOffset } = getPanelsOffsetSlice()
  const { setCookie } = useCookieActions()
  const [isTransitionPageVisible, setIsTransitionPageVisible] = useState(true)
  const [activePanelId, setActivePanelId] = useState<DockablePanelId | null>(null)
  const persistTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const persistedPanelsLayoutRef = useRef<string | null>(null)
  const hasHydratedPanelsLayoutRef = useRef(false)
  const isChallengeCompleted = challenge?.isCompleted.isFalse ?? false
  useSecondsCounter(isChallengeCompleted)

  const visiblePanelOrder = useMemo(
    () => getVisiblePanelOrder(panelOrder, isAssistantEnabled),
    [panelOrder, isAssistantEnabled],
  )
  const panelSizes = useMemo(
    () => getPanelSizes(visiblePanelOrder, panelsOffset),
    [visiblePanelOrder, panelsOffset],
  )

  const persistPanelsLayout = useCallback(
    (nextPanelOrder: DockablePanelId[], nextPanelsOffset: PanelsOffset) => {
      const serializedPanelsLayout = serializePanelsLayout(
        nextPanelOrder,
        nextPanelsOffset,
      )

      if (persistedPanelsLayoutRef.current === serializedPanelsLayout) return

      persistedPanelsLayoutRef.current = serializedPanelsLayout

      if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current)

      persistTimeoutRef.current = setTimeout(() => {
        setCookie({
          key: COOKIES.keys.challengePanelsOffset,
          value: serializedPanelsLayout,
        })
      }, 300)
    },
    [setCookie],
  )

  const applyPanelGroupLayout = useCallback(
    (nextVisiblePanelOrder: DockablePanelId[], nextPanelsOffset: PanelsOffset) => {
      const nextPanelSizes = getPanelSizes(nextVisiblePanelOrder, nextPanelsOffset)

      panelGroupRef.current?.setLayout(
        nextVisiblePanelOrder.map((panelId) => nextPanelSizes[panelId]),
      )
    },
    [panelGroupRef],
  )

  function handlePanelLayoutChange(layout: number[]) {
    if (layout.length !== visiblePanelOrder.length) return

    const nextPanelsOffset = { ...panelsOffset }

    visiblePanelOrder.forEach((panelId, index) => {
      nextPanelsOffset[PANEL_SIZE_KEYS[panelId]] = layout[index]
    })

    if (arePanelsOffsetEqual(panelsOffset, nextPanelsOffset)) return

    setPanelsOffset(nextPanelsOffset)
    persistPanelsLayout(panelOrder, nextPanelsOffset)
  }

  function handleDragStart(event: DragStartEvent) {
    if (isDockablePanelId(event.active.id)) setActivePanelId(event.active.id)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActivePanelId(null)

    if (!isDockablePanelId(event.active.id)) return

    const overPanelId =
      isDockablePanelId(event.over?.id) && event.over.id !== event.active.id
        ? event.over.id
        : getDirectionalDropPanelId(visiblePanelOrder, event.active.id, event.delta.x)

    if (!overPanelId) return

    const nextPanelOrder = reorderDockablePanels(panelOrder, event.active.id, overPanelId)

    setPanelOrder(nextPanelOrder)
    persistPanelsLayout(nextPanelOrder, panelsOffset)
    applyPanelGroupLayout(
      getVisiblePanelOrder(nextPanelOrder, isAssistantEnabled),
      panelsOffset,
    )
  }

  useEffect(() => {
    const timeout = setTimeout(() => setIsTransitionPageVisible(false), 5000)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (hasHydratedPanelsLayoutRef.current) return

    hasHydratedPanelsLayoutRef.current = true

    if (!arePanelOrdersEqual(panelOrder, initialPanelOrder)) {
      setPanelOrder(initialPanelOrder)
    }

    if (!arePanelsOffsetEqual(panelsOffset, initialPanelsOffset)) {
      setPanelsOffset(initialPanelsOffset)
    }
  }, [
    initialPanelOrder,
    initialPanelsOffset,
    panelOrder,
    panelsOffset,
    setPanelOrder,
    setPanelsOffset,
  ])

  useEffect(() => {
    applyPanelGroupLayout(visiblePanelOrder, panelsOffset)
  }, [applyPanelGroupLayout, visiblePanelOrder, panelsOffset])

  useEffect(() => {
    persistPanelsLayout(panelOrder, panelsOffset)
  }, [panelOrder, panelsOffset, persistPanelsLayout])

  useEffect(() => {
    return () => {
      if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current)
    }
  }, [])

  return {
    activePanelId,
    isTransitionPageVisible,
    panelOrder,
    panelsOffset,
    panelSizes,
    visiblePanelOrder,
    handleDragEnd,
    handleDragStart,
    handlePanelLayoutChange,
  }
}
