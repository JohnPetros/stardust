import type { AudioFile } from '@/modules/app/contexts/AudioContext/types'
import type { AnimationName } from '../Animation/types'
import type { AlertDialogType } from './types/AlertDialogType'

type AlertDialogEffect = {
  id: AlertDialogType
  animation: AnimationName | null
  audioFile: AudioFile | null
}

export const ALERT_DIALOG_EFFECTS: AlertDialogEffect[] = [
  {
    id: 'earning',
    animation: 'apollo-earning',
    audioFile: 'earning.wav',
  },
  {
    id: 'crying',
    animation: 'apollo-crying',
    audioFile: 'crying.wav',
  },
  {
    id: 'denying',
    animation: 'apollo-denying',
    audioFile: 'denying.wav',
  },
  {
    id: 'asking',
    animation: 'apollo-asking',
    audioFile: 'asking.wav',
  },
  {
    id: 'generic',
    animation: null,
    audioFile: null,
  },
]
