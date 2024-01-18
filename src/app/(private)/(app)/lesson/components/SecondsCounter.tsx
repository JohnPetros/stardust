import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

export type SecondsCounterRef = {
  getSeconds: () => number
}

const SecondsCounterComponent = (
  _: unknown,
  ref: ForwardedRef<SecondsCounterRef>
) => {
  const [counter, setCounter] = useState(0)

  useImperativeHandle(ref, () => {
    return {
      getSeconds: () => counter,
    }
  })

  useEffect(() => {
    setTimeout(() => {
      setCounter(counter + 1)
    }, 1000)
  }, [counter])

  return null
}

export const SecondsCounter = forwardRef(SecondsCounterComponent)
