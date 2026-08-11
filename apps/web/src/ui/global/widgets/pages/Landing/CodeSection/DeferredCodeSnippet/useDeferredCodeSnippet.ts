import { useEffect, useRef, useState } from 'react'

const EDITOR_PRELOAD_MARGIN = '600px 0px'

export function useDeferredCodeSnippet() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container || shouldLoad) return

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: EDITOR_PRELOAD_MARGIN },
    )

    observer.observe(container)

    return () => observer.disconnect()
  }, [shouldLoad])

  return { containerRef, shouldLoad }
}
