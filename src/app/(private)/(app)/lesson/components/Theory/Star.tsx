import Lottie from 'lottie-react'
import UnlockedStar from '../../../../../../../public/animations/unlocked-star.json'

interface StarProps {
  number: number
}

export function Star({ number }: StarProps) {
  return (
    <div className="relative">
      <Lottie
        animationData={UnlockedStar}
        style={{ width: 120 }}
        loop={false}
      />
      <span className="absolute block text-lg font-semibold top-[52%] -translate-x-1/2 -translate-y-1/2 text-yellow-700">
        {number}
      </span>
    </div>
  )
}
