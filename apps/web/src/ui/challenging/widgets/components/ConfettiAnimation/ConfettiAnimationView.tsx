import ReactConfetti from 'react-confetti'
import { useConfettiAnimation } from './useConfettiAnimation'

type ConfettiAnimationProps = {
  delay?: number // seconds
}

export const ConfettiAnimationView = ({ delay = 0 }: ConfettiAnimationProps) => {
  const { width, height, isVisible } = useConfettiAnimation(delay)

  if (isVisible)
    return (
      <ReactConfetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={800}
        tweenDuration={5000}
        gravity={0.15}
      />
    )
}
