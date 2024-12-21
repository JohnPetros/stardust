import type { RefObject } from 'react'
import { useEffect, useLayoutEffect, useRef } from 'react'

declare global {
  interface DocumentEventMap {
    userChange: CustomEvent<{ media: any[] }>
  }
}

function useEventListener<EventName extends keyof MediaQueryListEventMap>(
  eventName: EventName,
  handler: (event: MediaQueryListEventMap[EventName]) => void,
  element: RefObject<MediaQueryList>,
  options?: boolean | AddEventListenerOptions
): void

function useEventListener<EventName extends keyof WindowEventMap>(
  eventName: EventName,
  handler: (event: WindowEventMap[EventName]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions
): void

function useEventListener<
  EventName extends keyof HTMLElementEventMap,
  Element extends HTMLElement = HTMLDivElement,
>(
  eventName: EventName,
  handler: (event: HTMLElementEventMap[EventName]) => void,
  element: RefObject<Element>,
  options?: boolean | AddEventListenerOptions
): void

function useEventListener<EventName extends keyof DocumentEventMap>(
  eventName: EventName,
  handler: (event: DocumentEventMap[EventName]) => void,
  element: RefObject<Document>,
  options?: boolean | AddEventListenerOptions
): void

function useEventListener<
  WindowEventName extends keyof WindowEventMap,
  HTMLEventName extends keyof HTMLElementEventMap,
  MediaQueryEventName extends keyof MediaQueryListEventMap,
  Element extends HTMLElement | MediaQueryList = HTMLElement,
>(
  eventName: WindowEventName | HTMLEventName | MediaQueryEventName,
  handler: (
    event:
      | WindowEventMap[WindowEventName]
      | HTMLElementEventMap[HTMLEventName]
      | MediaQueryListEventMap[MediaQueryEventName]
      | Event
  ) => void,
  element?: RefObject<Element>,
  options?: boolean | AddEventListenerOptions
) {
  const savedHandler = useRef(handler)

  useLayoutEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const targetElement: Element | Window = element?.current ?? window

    if (!(targetElement && targetElement.addEventListener)) return

    const listener: typeof handler = (event) => {
      savedHandler.current(event)
    }

    targetElement.addEventListener(eventName, listener, options)

    return () => {
      targetElement.removeEventListener(eventName, listener, options)
    }
  }, [eventName, element, options])
}

export { useEventListener }
