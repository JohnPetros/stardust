import { useEffect, useState } from 'react'

import { CODE_TIPS } from '@/utils/constants'

export function usePageTransitionAnimation(hasTips: boolean) {
  const [codeTip, setCodeTip] = useState('')

  useEffect(() => {
    if (hasTips) {
      const randomNumber = Math.floor(Math.random() * CODE_TIPS.length - 1) + 1
      const codeTip = CODE_TIPS[randomNumber]
      setCodeTip(codeTip)
    }
  }, [hasTips])

  return {
    codeTip,
  }
}
