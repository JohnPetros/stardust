import { useMediaQuery } from 'react-responsive'

export function useBreakpoint() {
  const xs = useMediaQuery({ minWidth: '440px' })
  const sm = useMediaQuery({ minWidth: '640px' })
  const md = useMediaQuery({ minWidth: '768px' })
  const lg = useMediaQuery({ minWidth: '1024px' })
  const xl = useMediaQuery({ minWidth: '1280px' })

  return {
    xs,
    sm,
    md,
    lg,
    xl,
  }
}
