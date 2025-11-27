import { BlurTextView } from './BlurTextView'
import { useBlurText } from './useBlurText'

type Props = {
  text?: string
  delay?: number
  className?: string
  animateBy?: 'words' | 'characters'
  direction?: 'top' | 'bottom'
  threshold?: number
  rootMargin?: string
  animationFrom?: Record<string, any>
  animationTo?: Record<string, any>[]
  easing?: (t: number) => number
  onAnimationComplete?: () => void
  stepDuration?: number
}

export const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  stepDuration = 0.35,
  easing = (t: number) => t,
  onAnimationComplete,
}: Props) => {
  const {
    ref,
    elements,
    inView,
    fromSnapshot,
    toSnapshots,
    totalDuration,
    times,
    delay: hookDelay,
    easing: hookEasing,
    animateBy: hookAnimateBy,
    onAnimationComplete: hookOnAnimationComplete,
  } = useBlurText({
    text,
    delay,
    animateBy,
    direction,
    threshold,
    rootMargin,
    animationFrom,
    animationTo,
    easing,
    onAnimationComplete,
    stepDuration,
  })

  return (
    <BlurTextView
      ref={ref}
      className={className}
      elements={elements}
      inView={inView}
      fromSnapshot={fromSnapshot}
      toSnapshots={toSnapshots}
      totalDuration={totalDuration}
      times={times}
      delay={hookDelay}
      easing={hookEasing}
      animateBy={hookAnimateBy}
      onAnimationComplete={hookOnAnimationComplete}
    />
  )
}
