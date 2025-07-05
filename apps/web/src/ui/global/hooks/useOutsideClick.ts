import { type RefObject, useEffect } from 'react'

export function useOutsideClick<Element extends HTMLElement = HTMLElement>(
  ref: RefObject<Element>,
  handler: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const element = event.target as Node

      const isOutsideClick = ref.current && !ref.current.contains(element)

      if (isOutsideClick) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, handler])
}
