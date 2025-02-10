import { useRefMock } from '@/ui/global/hooks/tests/mocks/useRefMock'
import type { AnimationRef } from '../../types'

const restartMock = jest.fn()
const setSpeedMock = jest.fn()
const stopAtMock = jest.fn()

const animationRefMock = useRefMock<AnimationRef>({
  restart: restartMock,
  setSpeed: setSpeedMock,
  stopAt: stopAtMock,
})

export { animationRefMock }
