'use client'

import { useState } from "react"

export function useStudyTimeDialog() {
  const [time, setTime] = useState()

  function handleTimeChange() {
    
  }

  return {
    handleTimeChange
  }
}