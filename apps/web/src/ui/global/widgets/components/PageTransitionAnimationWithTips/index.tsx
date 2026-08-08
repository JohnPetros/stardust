'use client'

import { PageTransitionAnimation } from '../PageTransitionAnimation'
import { PageTransitionAnimationWithTipsView } from './PageTransitionAnimationWithTipsView'
import { usePageTransitionAnimationWithTips } from './usePageTransitionAnimationWithTips'

type Props = {
  isVisible: boolean
}

export const PageTransitionAnimationWithTips = ({ isVisible }: Props) => {
  const { codeTip } = usePageTransitionAnimationWithTips()

  return (
    <PageTransitionAnimation isVisible={isVisible}>
      {codeTip ? <PageTransitionAnimationWithTipsView codeTip={codeTip} /> : null}
    </PageTransitionAnimation>
  )
}
