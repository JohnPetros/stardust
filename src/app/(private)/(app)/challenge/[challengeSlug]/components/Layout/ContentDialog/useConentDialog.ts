'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { DialogRef } from '@/app/components/Dialog/Dialog'
import { useChallengeStore } from '@/stores/challengeStore'
import { ROUTES } from '@/utils/constants'

export function useContentDialog() {
  const challengeSlug = useChallengeStore(
    (store) => store.state.challenge?.slug
  )

  const dialogRef = useRef<DialogRef>(null)

  const router = useRouter()
  const pathname = usePathname()

  function handleDialogOpenChange(isOpen: boolean) {
    const lastParam = pathname.split('/').pop()

    // if (!isOpen && lastParam !== challengeSlug) {
    //   router.push(`${ROUTES.private.challenge}/${challengeSlug}`)
    // }
  }

  useEffect(() => {
    dialogRef.current?.open()
  }, [])

  return {
    dialogRef,
    handleDialogOpenChange,
  }
}
