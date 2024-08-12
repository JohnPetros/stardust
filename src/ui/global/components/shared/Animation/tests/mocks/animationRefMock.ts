import { useRefMock } from '@/__tests__/mocks/hooks/useRefMock'
import type { AnimationRef } from '../../types'

const restartMock = jest.fn()

const animationRefMock = useRefMock<AnimationRef>({
  restart: restartMock,
})

export { animationRefMock }
