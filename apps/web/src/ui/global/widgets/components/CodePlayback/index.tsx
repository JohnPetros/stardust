'use client'

import type { CodePlaybackDto } from '@stardust/core/global/structures/dtos'

import { CodePlaybackView } from './CodePlaybackView'
import { useCodePlayback } from './useCodePlayback'

type Props = {
  playback: CodePlaybackDto
}

export function CodePlayback({ playback }: Props) {
  const {
    currentStepIndex,
    currentStep,
    isPlaying,
    speed,
    isExpanded,
    play,
    pause,
    goToPreviousStep,
    goToNextStep,
    seek,
    changeSpeed,
    toggleExpanded,
  } = useCodePlayback({ playback })

  return (
    <CodePlaybackView
      code={playback.code}
      input={playback.input}
      currentStep={currentStep}
      currentStepIndex={currentStepIndex}
      totalSteps={playback.steps.length}
      isPlaying={isPlaying}
      speed={speed}
      isExpanded={isExpanded}
      onPlay={play}
      onPause={pause}
      onPreviousStep={goToPreviousStep}
      onNextStep={goToNextStep}
      onSeek={seek}
      onChangeSpeed={changeSpeed}
      onToggleExpanded={toggleExpanded}
    />
  )
}
