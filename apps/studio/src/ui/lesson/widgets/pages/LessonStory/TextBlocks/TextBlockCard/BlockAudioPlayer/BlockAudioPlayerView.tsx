import { Pause, Play } from 'lucide-react'
import type { RefObject } from 'react'

import { Button } from '@/ui/shadcn/components/button'

type Props = {
  url: string
  audioRef: RefObject<HTMLAudioElement | null>
  isPlaying: boolean
  progress: number
  currentTimeLabel: string
  durationLabel: string
  onTogglePlay: () => void
  onSeek: (progress: number) => void
}

export const BlockAudioPlayerView = ({
  url,
  audioRef,
  isPlaying,
  progress,
  currentTimeLabel,
  durationLabel,
  onTogglePlay,
  onSeek,
}: Props) => {
  return (
    <div className='rounded-lg border border-zinc-800 bg-zinc-900 p-3'>
      <audio ref={audioRef} src={url} preload='metadata'>
        <track kind='captions' />
      </audio>
      <div className='flex items-center gap-3'>
        <Button type='button' size='icon' variant='outline' onClick={onTogglePlay}>
          {isPlaying ? <Pause className='h-4 w-4' /> : <Play className='h-4 w-4' />}
        </Button>
        <div className='flex w-full flex-col gap-1'>
          <input
            type='range'
            min={0}
            max={100}
            value={progress}
            onChange={(event) => onSeek(Number(event.target.value))}
            className='w-full accent-zinc-200'
          />
          <div className='flex justify-between text-xs text-zinc-400'>
            <span>{currentTimeLabel}</span>
            <span>{durationLabel}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
