import { useId, useMemo } from 'react'

import { OptionProps } from '.'

export function useOption({
  isAnswerCorrect,
  isAnswerIncorrect,
  isSelected,
}: Omit<OptionProps, 'label' | 'onClick'>) {
  const id = useId()

  const color: 'gray' | 'red' | 'blue' | 'green' = useMemo(() => {
    if (isAnswerIncorrect && isSelected) {
      return 'red'
    } else if (isAnswerCorrect) {
      return 'green'
    } else if (isSelected) {
      return 'blue'
    } else {
      return 'gray'
    }
  }, [isAnswerCorrect, isAnswerIncorrect, isSelected])

  return {
    id,
    color,
  }
}
