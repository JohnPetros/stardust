'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { ContentType } from '@/@types/ContentType'
import { DialogRef } from '@/global/components/Dialog/Dialog'
import { useChallengeStore } from '@/stores/challengeStore'
import { ROUTES } from '@/global/constants'

export function useContentDialog(contentType: ContentType) {
  const challengeSlug = useChallengeStore(
    (store) => store.state.challenge?.slug
  )

  const dialogRef = useRef<DialogRef>(null)

  const router = useRouter()
  const pathname = usePathname()
  const lastParam = pathname.split('/').pop()

  function handleDialogOpenChange(isOpen: boolean) {
    if (!isOpen && lastParam !== challengeSlug) {
      router.push(`${ROUTES.private.challenge}/${challengeSlug}`)
    }
  }

  useEffect(() => {
    dialogRef.current?.open()
  }, [])

  // useEffect(() => {
  //   if (lastParam !== `/${contentType}`) {
  //     dialogRef.current?.close()
  //   } else {
  //     dialogRef.current?.open()
  //   }
  // }, [lastParam, contentType])

  return {
    dialogRef,
    handleDialogOpenChange,
  }
}
