import { useEffect } from 'react'

import { useLessonStore } from '@/stores/lessonStore'

export default function SecondsIncrementer() {
  const incrementSecondsAmount = useLessonStore(
    (store) => store.actions.incrementSecondsAmount
  )
  const secondsAmount = useLessonStore((store) => store.state.secondsAmount)

  useEffect(() => {
    setTimeout(() => {
      incrementSecondsAmount()
    }, 1000)
  }, [secondsAmount, incrementSecondsAmount])

  return <></>
}
