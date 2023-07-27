import Earning from '../../../public/animations/apollo-earning.json'
import Crying from '../../../public/animations/apollo-crying.json'
import Denying from '../../../public/animations/apollo-denying.json'
import Asking from '../../../public/animations/apollo-asking.json'
import { Type as ModalType } from '@/app/components/Modal'

type ModalEffect = {
  id: ModalType
  animation: unknown
}

export const MODAL_EFFECTS: ModalEffect[] = [
  {
    id: 'earning',
    animation: Earning,
  },
  {
    id: 'crying',
    animation: Crying,
  },
  {
    id: 'denying',
    animation: Denying,
  },
  {
    id: 'asking',
    animation: Asking,
  },
  {
    id: 'generic',
    animation: null,
  },
]
