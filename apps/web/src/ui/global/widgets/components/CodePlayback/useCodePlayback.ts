'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CodePlaybackDto } from '@stardust/core/global/structures/dtos'

import type { CodePlaybackSpeed } from './types/CodePlaybackSpeed'

type Params = {
  playback: CodePlaybackDto
}

type UseCodePlaybackResult = {
  currentStepIndex: number
  currentStep: CodePlaybackDto['steps'][number]
  isPlaying: boolean
  speed: CodePlaybackSpeed
  isExpanded: boolean
  play: () => void
  pause: () => void
  goToPreviousStep: () => void
  goToNextStep: () => void
  seek: (stepIndex: number) => void
  changeSpeed: (speed: CodePlaybackSpeed) => void
  toggleExpanded: () => void
  collapse: () => void
}

const INTERVAL_BY_SPEED: Record<CodePlaybackSpeed, number> = {
  '0.5x': 2000,
  '1x': 1000,
  '2x': 500,
}

export function useCodePlayback({ playback }: Params): UseCodePlaybackResult {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState<CodePlaybackSpeed>('1x')
  const [isExpanded, setIsExpanded] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentStepIndexRef = useRef(0)
  const playbackRef = useRef(playback)
  const isPlaybackChanging = playbackRef.current !== playback
  const renderedStepIndex = isPlaybackChanging ? 0 : currentStepIndex
  const renderedIsPlaying = isPlaybackChanging ? false : isPlaying
  const renderedSpeed = isPlaybackChanging ? '1x' : speed
  const renderedIsExpanded = isPlaybackChanging ? false : isExpanded

  const clearPlaybackTimer = useCallback(() => {
    if (timerRef.current === null) return

    clearInterval(timerRef.current)
    timerRef.current = null
  }, [])

  const setCurrentStep = useCallback((stepIndex: number) => {
    currentStepIndexRef.current = stepIndex
    setCurrentStepIndex(stepIndex)
  }, [])

  const play = useCallback(() => {
    const lastStepIndex = playback.steps.length - 1

    if (currentStepIndexRef.current >= lastStepIndex) {
      clearPlaybackTimer()
      setIsPlaying(false)
      return
    }

    setIsPlaying(true)
  }, [clearPlaybackTimer, playback])

  const pause = useCallback(() => {
    clearPlaybackTimer()
    setIsPlaying(false)
  }, [clearPlaybackTimer])

  const goToPreviousStep = useCallback(() => {
    const previousStepIndex = Math.max(0, currentStepIndexRef.current - 1)
    setCurrentStep(previousStepIndex)
  }, [setCurrentStep])

  const goToNextStep = useCallback(() => {
    const lastStepIndex = playback.steps.length - 1
    const nextStepIndex = Math.min(lastStepIndex, currentStepIndexRef.current + 1)
    setCurrentStep(nextStepIndex)
  }, [playback, setCurrentStep])

  const seek = useCallback(
    (stepIndex: number) => {
      const lastStepIndex = playback.steps.length - 1

      if (!Number.isInteger(stepIndex) || stepIndex < 0 || stepIndex > lastStepIndex) {
        return
      }

      setCurrentStep(stepIndex)
    },
    [playback, setCurrentStep],
  )

  const changeSpeed = useCallback((nextSpeed: CodePlaybackSpeed) => {
    setSpeed(nextSpeed)
  }, [])

  const toggleExpanded = useCallback(() => {
    setIsExpanded((expanded) => !expanded)
  }, [])

  const collapse = useCallback(() => {
    setIsExpanded(false)
  }, [])

  useEffect(() => {
    playbackRef.current = playback
    clearPlaybackTimer()
    currentStepIndexRef.current = 0
    setCurrentStepIndex(0)
    setIsPlaying(false)
    setSpeed('1x')
    setIsExpanded(false)
  }, [playback, clearPlaybackTimer])

  useEffect(() => {
    if (!renderedIsPlaying) return

    const lastStepIndex = playback.steps.length - 1

    timerRef.current = setInterval(() => {
      const nextStepIndex = currentStepIndexRef.current + 1

      if (currentStepIndexRef.current >= lastStepIndex) {
        setIsPlaying(false)
        clearPlaybackTimer()
        return
      }

      if (nextStepIndex >= lastStepIndex) {
        setCurrentStep(lastStepIndex)
        setIsPlaying(false)
        clearPlaybackTimer()
        return
      }

      setCurrentStep(nextStepIndex)
    }, INTERVAL_BY_SPEED[renderedSpeed])

    return clearPlaybackTimer
  }, [clearPlaybackTimer, playback, renderedIsPlaying, renderedSpeed, setCurrentStep])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') collapse()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [collapse])

  useEffect(() => clearPlaybackTimer, [clearPlaybackTimer])

  return {
    currentStepIndex: renderedStepIndex,
    currentStep: playback.steps[renderedStepIndex],
    isPlaying: renderedIsPlaying,
    speed: renderedSpeed,
    isExpanded: renderedIsExpanded,
    play,
    pause,
    goToPreviousStep,
    goToNextStep,
    seek,
    changeSpeed,
    toggleExpanded,
    collapse,
  }
}
