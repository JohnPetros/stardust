import { useMediaQuery } from 'react-responsive'

export function useBreakpoint() {
  const xs = useMediaQuery({ maxWidth: '440px' })
  const sm = useMediaQuery({ maxWidth: '640px' })
  const md = useMediaQuery({ maxWidth: '768px' })
  const lg = useMediaQuery({ maxWidth: '1024px' })
  const xl = useMediaQuery({ maxWidth: '1280px' })

  return {
    xs,
    sm,
    md,
    lg,
    xl,
  }
}
