import Earning from '../../../public/animations/apollo-earning.json'
import Crying from '../../../public/animations/apollo-crying.json'
import Denying from '../../../public/animations/apollo-denying.json'
import Asking from '../../../public/animations/apollo-asking.json'

import { Type as ModalType } from '@/app/components/Modal'

type ModalEffect = {
  id: ModalType
  animation: unknown | null
  sound: string | null
}

export const MODAL_EFFECTS: ModalEffect[] = [
  {
    id: 'earning',
    animation: Earning,
    sound: 'earning.wav',
  },
  {
    id: 'crying',
    animation: Crying,
    sound: 'crying.wav',
  },
  {
    id: 'denying',
    animation: Denying,
    sound: 'denying.wav',
  },
  {
    id: 'asking',
    animation: Asking,
    sound: 'asking.wav',
  },
  {
    id: 'generic',
    animation: null,
    sound: null,
  },
]
