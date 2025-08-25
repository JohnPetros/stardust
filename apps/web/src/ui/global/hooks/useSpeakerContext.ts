import { useContext } from 'react'

import { SpeakerContext } from '@/ui/lesson/contexts/Speaker'

export function useSpeakerContext() {
  return useContext(SpeakerContext)
}
