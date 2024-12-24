'use client'

import { useEffect, useRef } from 'react'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { ROUTES } from '@/constants'
import type { DialogRef } from '@/ui/global/widgets/components/Dialog/types'
import type { ContentType } from '../ContentType'
import { useRouter } from '@/ui/global/hooks'

export function useContentDialog(contentType: ContentType) {
  const { getChallengeSlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()

  const dialogRef = useRef<DialogRef>(null)

  const router = useRouter()
  const route = router.getCurrentRoute()
  const routeLastParam = route.split('/').pop()

  function handleDialogOpenChange(isOpen: boolean) {
    if (!isOpen && routeLastParam !== challenge?.slug.value) {
      router.goTo(`${ROUTES.app.challenge}/${challenge?.slug.value}`)
    }
  }

  useEffect(() => {
    dialogRef.current?.open()
  }, [])

  useEffect(() => {
    if (routeLastParam !== `/${contentType}`) {
      dialogRef.current?.close()
    } else {
      dialogRef.current?.open()
    }
  }, [routeLastParam, contentType])

  return {
    dialogRef,
    handleDialogOpenChange,
  }
}
