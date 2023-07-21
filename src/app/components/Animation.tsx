import Lottie from "lottie-react";

interface AnimationProps {
  src: Object
  size: number
  hasLoop?: boolean
}

export function Animation({ src, size, hasLoop = true }: AnimationProps) {
  return (
    <Lottie animationData={src} width={size} height={size} loop={hasLoop} />
  )
}
