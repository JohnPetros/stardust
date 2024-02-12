import Asking from '../../../../public/animations/apollo-asking.json'
import Crying from '../../../../public/animations/apollo-crying.json'
import Denying from '../../../../public/animations/apollo-denying.json'
import Earning from '../../../../public/animations/apollo-earning.json'

import { AlertDialogType } from './types/AlertDialogType'

import type { AudioFile } from '@/@types/AudioFile'

type AlertDialogEffect = {
  id: AlertDialogType
  animation: unknown | null
  audioFile: AudioFile | null
}

export const ALERT_DIALOG_EFFECTS: AlertDialogEffect[] = [
  {
    id: 'earning',
    animation: Earning,
    audioFile: 'earning.wav',
  },
  {
    id: 'crying',
    animation: Crying,
    audioFile: 'crying.wav',
  },
  {
    id: 'denying',
    animation: Denying,
    audioFile: 'denying.wav',
  },
  {
    id: 'asking',
    animation: Asking,
    audioFile: 'asking.wav',
  },
  {
    id: 'generic',
    animation: null,
    audioFile: null,
  },
]
