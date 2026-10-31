import { useParams } from '@tanstack/react-router'
import { useState } from 'react'
import type { AnimationSlot } from '@/types/animation-slot'
import { Button } from '@/ui/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/shadcn/dropdown-menu'
import { cn } from '@/ui/shadcn/utils'
import { useCanvas } from '@/ui/shared/hooks/use-canvas'
import { useScenes } from '@/ui/shared/hooks/use-scenes'
import { useUI } from '@/ui/shared/hooks/use-ui'
import { Icon } from '@/ui/shared/widgets/components/icon'
import { NumericSlider } from '@/ui/shared/widgets/components/numeric-slider'
import { ColorField } from './color-field'
import { PropertyGroup } from './property-group'
import { SlotRow } from './slot-row'

const FIELD_CLASS =
  'rounded-md bg-input font-sans text-foreground outline-none w-0 flex-1 text-xxs h-7 px-2 focus-ring'

export const SidebarRight = () => {
  const {
    slots,
    zoom,
    controls,
    setScalarSlot,
    setColorSlot,
    setVec2Slot,
    setTextSlot,
    commitSource,
    zoomByCentered,
    resetCamera,
  } = useCanvas()
  const params = useParams({ strict: false }) as { project?: string }
  const { findProject, exportProjectZip } = useScenes()
  const { controlsExpanded } = useUI()
  const [edits, setEdits] = useState<Record<string, AnimationSlot['value']>>({})

  function setEdit(id: string, value: AnimationSlot['value']) {
    setEdits((current) => ({ ...current, [id]: value }))
  }

  function slotValue(slot: AnimationSlot) {
    return edits[slot.id] ?? slot.value
  }

  async function handleExport() {
    const project = params.project ? findProject(params.project) : undefined
    if (project) await exportProjectZip(project)
  }

  function renderSlot(slot: AnimationSlot) {
    const meta = controls?.[slot.id]
    const label = meta?.label ?? slot.id

    if (slot.type === 'scalar') {
      const min = meta?.min ?? 0
      const max = meta?.max ?? 100
      return (
        <SlotRow key={slot.id} label={label}>
          <NumericSlider
            value={slotValue(slot) as number}
            minValue={min}
            maxValue={max}
            step={meta?.step ?? ((max - min) / 100 || 1)}
            onChange={(value) => {
              setEdit(slot.id, value)
              setScalarSlot(slot.id, value)
            }}
            onDragEnd={commitSource}
          />
        </SlotRow>
      )
    }

    if (slot.type === 'color') {
      return (
        <SlotRow key={slot.id} label={label}>
          <ColorField
            label={label}
            value={slotValue(slot) as [number, number, number, number]}
            onChange={(next) => {
              setEdit(slot.id, next)
              setColorSlot(slot.id, next)
            }}
            onCommit={commitSource}
          />
        </SlotRow>
      )
    }

    if (slot.type === 'vec2') {
      const value = slotValue(slot) as [number, number]
      const update = (i: 0 | 1, n: number) => {
        const next: [number, number] = i === 0 ? [n, value[1]] : [value[0], n]
        setEdit(slot.id, next)
        setVec2Slot(slot.id, next)
      }
      return (
        <SlotRow key={slot.id} label={label}>
          <div className='flex flex-1 gap-2'>
            {([0, 1] as const).map((i) => (
              // Uncontrolled: applied on Enter or blur, like a native change event.
              <input
                key={`${i}:${value[i]}`}
                type='number'
                step={meta?.step ?? 1}
                defaultValue={value[i]}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    update(i, Number(e.currentTarget.value))
                    commitSource()
                  }
                }}
                onBlur={(e) => {
                  const n = Number(e.currentTarget.value)
                  if (n !== value[i]) update(i, n)
                  commitSource()
                }}
                className={cn(
                  FIELD_CLASS,
                  '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none',
                )}
              />
            ))}
          </div>
        </SlotRow>
      )
    }

    // text
    const value = slotValue(slot) as string
    function applyText(text: string) {
      setEdit(slot.id, text)
      setTextSlot(slot.id, text)
      commitSource()
    }
    return (
      <SlotRow key={slot.id} label={label}>
        <input
          key={value}
          type='text'
          defaultValue={value}
          onKeyDown={(e) => {
            if (e.key === 'Enter') applyText(e.currentTarget.value)
          }}
          onBlur={(e) => {
            if (e.currentTarget.value !== value) applyText(e.currentTarget.value)
            else commitSource()
          }}
          className={FIELD_CLASS}
          aria-label={label}
        />
      </SlotRow>
    )
  }

  return (
    <div
      className={cn(
        'absolute right-4 top-4 flex flex-col max-h-full rounded-2xl gap-0 bg-background border border-border',
        controlsExpanded ? 'w-[236px]' : 'w-[188px]',
      )}
    >
      <div className='flex items-center justify-between h-12 px-3 pl-4'>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center text-muted-foreground hover:text-foreground'>
            <span className='text-xxs'>{Math.round(zoom * 100)}%</span>
            <Icon name='chevron-down' />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => zoomByCentered(1.2)}>
              Zoom in
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => zoomByCentered(1 / 1.2)}>
              Zoom out
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => zoomByCentered(1 / zoom)}>
              Zoom to 100%
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => resetCamera()}>
              Zoom to fit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={handleExport}>Export</Button>
      </div>

      {controlsExpanded && slots.length > 0 && (
        <>
          <PropertyGroup title='Properties'>{slots.map(renderSlot)}</PropertyGroup>
          <div className='h-1 w-full' />
        </>
      )}
    </div>
  )
}
