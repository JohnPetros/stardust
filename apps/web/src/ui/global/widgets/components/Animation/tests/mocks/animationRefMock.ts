import { useRefMock } from '@/ui/global/hooks/tests/mocks/useRefMock'
import type { AnimationRef } from '../../types'

const restartMock = jest.fn()

const animationRefMock = useRefMock<AnimationRef>({
  restart: restartMock,
})

export { animationRefMock }
