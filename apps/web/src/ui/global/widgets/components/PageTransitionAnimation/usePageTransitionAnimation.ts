import { useEffect, useState } from 'react'

import { CODE_TIPS } from './code-tips'

export function usePageTransitionAnimation(hasTips: boolean) {
  const [codeTip, setCodeTip] = useState('')

  useEffect(() => {
    if (hasTips) {
      const randomNumber = Math.floor(Math.random() * CODE_TIPS.length - 1) + 1
      const codeTip = CODE_TIPS[randomNumber]
      if (codeTip) setCodeTip(codeTip)
    }
  }, [hasTips])

  return {
    codeTip,
  }
}
