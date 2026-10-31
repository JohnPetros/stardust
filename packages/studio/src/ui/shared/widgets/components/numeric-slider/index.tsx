import {
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { cn } from '@/ui/shadcn/utils'

export type NumericSliderProps = {
  value: number
  onChange?(value: number): void
  onDragStart?(value: number): void
  onDragEnd?(value: number): void
  minValue?: number
  maxValue?: number
  step?: number
  format?(value: number): string
  className?: string
  disabled?: boolean
}

const TRACK_INSET_PX = 8
const DRAG_THRESHOLD = 4

export const NumericSlider = (props: NumericSliderProps) => {
  const min = props.minValue ?? 0
  const max = props.maxValue ?? 100
  const rawStep = props.step ?? 1
  const step = Number.isFinite(rawStep) && rawStep > 0 ? rawStep : 1
  const range = max - min
  const safeRange = range === 0 ? 1 : range
  const clamp = (value: number) => Math.max(min, Math.min(max, value))
  const formatValue = (value: number) =>
    props.format?.(value) ?? String(Math.round(value))
  const currentValue = clamp(props.value)

  const [internal, setInternal] = useState(() => formatValue(currentValue))
  const [displayValue, setDisplayValue] = useState(currentValue)
  const [isEditing, setIsEditing] = useState(false)
  const fillRatio = (clamp(displayValue) - min) / safeRange

  // Pointer handlers outlive a render (they sit on window), so they read the
  // latest props and drag state through refs.
  const latest = useRef({ props, clamp, formatValue, currentValue, min, range, step })
  latest.current = { props, clamp, formatValue, currentValue, min, range, step }
  const isEditingRef = useRef(isEditing)
  isEditingRef.current = isEditing
  const displayRef = useRef(displayValue)
  displayRef.current = displayValue

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const drag = useRef({
    rect: undefined as DOMRect | undefined,
    start: null as { x: number; y: number } | null,
    startTarget: null as HTMLElement | null,
    pointerId: null as number | null,
    started: false,
    lastEmitted: currentValue,
    skipBlurCommit: false,
  })

  useEffect(() => {
    setDisplayValue(currentValue)
    if (!isEditingRef.current) setInternal(latest.current.formatValue(currentValue))
    drag.current.lastEmitted = currentValue
  }, [currentValue])

  function emitChange(nextValue: number) {
    const {
      props: currentProps,
      clamp: clampLatest,
      formatValue: format,
    } = latest.current
    const clamped = clampLatest(nextValue)
    drag.current.lastEmitted = clamped
    setDisplayValue(clamped)
    currentProps.onChange?.(clamped)
    if (!isEditingRef.current) setInternal(format(clamped))
  }

  function valueFromClientX(clientX: number) {
    const {
      clamp: clampLatest,
      min: minLatest,
      range: rangeLatest,
      step: stepLatest,
    } = latest.current
    const rect = drag.current.rect ?? containerRef.current?.getBoundingClientRect()
    if (!rect) return displayRef.current

    const left = rect.left + TRACK_INSET_PX
    const width = rect.width - TRACK_INSET_PX
    if (width <= 0) return minLatest

    const ratio = Math.max(0, Math.min(1, (clientX - left) / width))
    const snapped =
      Math.round((minLatest + ratio * rangeLatest) / stepLatest) * stepLatest
    const stepDecimals = (stepLatest.toString().split('.')[1] || '').length
    return clampLatest(
      stepDecimals === 0 ? snapped : Number(snapped.toFixed(stepDecimals)),
    )
  }

  function resetPointerState() {
    drag.current.start = null
    drag.current.pointerId = null
    drag.current.rect = undefined
    drag.current.started = false
  }

  function handleWindowPointerMove(event: PointerEvent) {
    const state = drag.current
    if (state.pointerId === null || event.pointerId !== state.pointerId) return
    if (!state.start) return

    const dx = event.clientX - state.start.x
    const dy = event.clientY - state.start.y

    if (!state.started && Math.hypot(dx, dy) >= DRAG_THRESHOLD) {
      state.started = true
      if (inputRef.current && document.activeElement === inputRef.current) {
        inputRef.current.blur()
      }
      const startValue = valueFromClientX(event.clientX)
      emitChange(startValue)
      latest.current.props.onDragStart?.(startValue)
      return
    }

    if (state.started) emitChange(valueFromClientX(event.clientX))
  }

  function handleWindowPointerUp(event: PointerEvent) {
    const state = drag.current
    if (state.pointerId === null || event.pointerId !== state.pointerId) return

    const wasDragging = state.started
    const startTarget = state.startTarget
    const container = containerRef.current

    window.removeEventListener('pointermove', handleWindowPointerMove)
    window.removeEventListener('pointerup', handleWindowPointerUp)
    window.removeEventListener('pointercancel', handleWindowPointerUp)

    if (wasDragging) {
      const finalValue = valueFromClientX(event.clientX)
      if (finalValue !== state.lastEmitted) emitChange(finalValue)
      resetPointerState()
      state.startTarget = null
      latest.current.props.onDragEnd?.(finalValue)
      return
    }

    resetPointerState()
    state.startTarget = null

    if (startTarget && container?.contains(startTarget)) {
      if (startTarget instanceof HTMLInputElement) {
        startTarget.focus()
        return
      }

      const interactive = startTarget.closest(
        "button, [role='button'], a, input, select, textarea",
      )
      if (
        interactive instanceof HTMLElement &&
        interactive !== container &&
        container.contains(interactive)
      ) {
        interactive.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            clientX: event.clientX,
            clientY: event.clientY,
            view: window,
          }),
        )
      }
    }
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (props.disabled ?? false) return
    event.preventDefault()

    const state = drag.current
    state.rect = containerRef.current?.getBoundingClientRect()
    state.start = { x: event.clientX, y: event.clientY }
    state.startTarget = event.target instanceof HTMLElement ? event.target : null
    state.pointerId = event.pointerId
    state.started = false
    containerRef.current?.setPointerCapture?.(event.pointerId)

    window.addEventListener('pointermove', handleWindowPointerMove)
    window.addEventListener('pointerup', handleWindowPointerUp)
    window.addEventListener('pointercancel', handleWindowPointerUp)
  }

  function handleInputFocus(event: FocusEvent<HTMLInputElement>) {
    setIsEditing(true)
    event.currentTarget.select()
  }

  function restoreDisplay() {
    setInternal(formatValue(currentValue))
    setDisplayValue(currentValue)
  }

  function handleInputBlur(event: FocusEvent<HTMLInputElement>) {
    setIsEditing(false)
    isEditingRef.current = false

    if (drag.current.skipBlurCommit) {
      drag.current.skipBlurCommit = false
      restoreDisplay()
      return
    }

    const parsed = Number.parseFloat(event.currentTarget.value.replace(/[^0-9.-]/g, ''))
    if (Number.isFinite(parsed)) {
      const clamped = clamp(parsed)
      emitChange(clamped)
      props.onDragEnd?.(clamped)
      return
    }

    restoreDisplay()
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.currentTarget.blur()
      return
    }

    if (event.key === 'Escape') {
      drag.current.skipBlurCommit = true
      setIsEditing(false)
      restoreDisplay()
      event.currentTarget.blur()
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'group/slider-input relative flex-1 min-w-0 h-7 bg-input rounded-md overflow-hidden border-none outline-none touch-none after:pointer-events-none after:absolute after:inset-0 after:rounded-md after:opacity-0 after:ring-1 after:ring-inset after:ring-ring after:z-20',
        props.disabled && 'opacity-50 cursor-not-allowed',
        isEditing && 'after:opacity-100',
        props.className,
      )}
      onPointerDown={handlePointerDown}
    >
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 bg-muted rounded-l-md pointer-events-none',
          fillRatio >= 1 ? 'rounded-r-md' : 'rounded-r-sm',
        )}
        style={{
          width: `calc(${TRACK_INSET_PX}px + ${fillRatio} * (100% - ${TRACK_INSET_PX}px))`,
        }}
      >
        {!props.disabled && (
          <div className='absolute right-1 top-1/2 -translate-y-1/2 w-0.5 rounded-xs bg-input transition-all duration-75 opacity-0 h-3 group-hover/slider-input:opacity-70 group-focus-within/slider-input:opacity-70 group-data-[dragging=true]/slider-input:opacity-100 group-data-[dragging=true]/slider-input:h-4' />
        )}
      </div>
      <div className='relative z-0 flex items-center h-full justify-between pl-2'>
        <div className='relative inline-block'>
          <span className='invisible pointer-events-none whitespace-pre text-xxs text-foreground'>
            {internal.length === 0 ? '0' : internal}
          </span>
          <input
            ref={inputRef}
            className='absolute inset-0 w-full h-full cursor-default bg-transparent text-xxs text-foreground focus:outline-none disabled:cursor-not-allowed outline-none p-0 border-none! shadow-none!'
            type='text'
            value={internal}
            onChange={(event) => setInternal(event.currentTarget.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            disabled={props.disabled}
          />
        </div>
      </div>
    </div>
  )
}
