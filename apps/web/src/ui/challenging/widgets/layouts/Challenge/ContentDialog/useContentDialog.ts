'use client'

import { useEffect, useRef } from 'react'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { ROUTES } from '@/constants'
import type { DialogRef } from '@/ui/global/widgets/components/Dialog/types'
import type { ContentType } from '../types/ContentType'
import { useRouter } from '@/ui/global/hooks'

export function useContentDialog(contentType: ContentType) {
  const { getChallengeSlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()
  const dialogRef = useRef<DialogRef>(null)
  const router = useRouter()
  const routeLastParam = router.currentRoute.split('/').pop()

  function handleDialogOpenChange(isOpen: boolean) {
    if (!isOpen && routeLastParam !== challenge?.slug.value) {
      router.goTo(`${ROUTES.challenging.challenge}/${challenge?.slug.value}`)
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
