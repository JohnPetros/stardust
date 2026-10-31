import { Button } from '@/ui/shadcn/button'
import { Slider } from '@/ui/shadcn/slider'
import { useCanvas, useCanvasFrame } from '@/ui/shared/hooks/use-canvas'
import { Icon } from '@/ui/shared/widgets/components/icon'

export const PlaybackControls = () => {
  const { playing, totalFrames, fps, togglePlayback, seek } = useCanvas()
  const currentFrame = useCanvasFrame()

  const max = Math.max(0, totalFrames - 1)
  const frame = Math.min(Math.round(currentFrame), max)
  const pad = String(max).length

  return (
    <div className='flex justify-center p-1.5 rounded-2xl w-full max-w-xl gap-3 bg-background border border-border items-center'>
      <Button size='icon' variant='secondary' onClick={togglePlayback}>
        <Icon
          name={playing ? 'controls-pause' : 'controls-play'}
          className='text-foreground'
        />
      </Button>

      <Slider
        className='flex-1'
        min={0}
        max={max || 1}
        step={1}
        value={[frame]}
        onValueChange={([value]) => seek(value)}
      />

      <span className='shrink-0 text-right font-mono text-xxs tabular-nums text-muted-foreground font-normal'>
        <span className='text-foreground'>{String(frame).padStart(pad, '0')}</span>
        {' / '}
        {max}
      </span>
      <div className='h-5 w-px bg-border' />
      <span className='text-muted-foreground text-xxs font-mono font-normal pr-2'>
        {fps}FPS
      </span>
    </div>
  )
}
