'use client'

import { useRef } from 'react'

import { useStoryStage } from './useStoryStage'
import { StoryStageView } from './StoryStageView'

type Props = {
  title: string
  number: number
}

export const StoryStage = ({ title, number }: Props) => {
  const { story, handleContinueButtonClick, handleQuizStageButtonClick } = useStoryStage()
  const buttonHasFocus = useRef(false)

  if (story)
    return (
      <StoryStageView
        title={title}
        number={number}
        story={story}
        buttonHasFocus={buttonHasFocus.current}
        onQuizStageButtonClick={handleQuizStageButtonClick}
        onContinueButtonClick={handleContinueButtonClick}
      />
    )
}
