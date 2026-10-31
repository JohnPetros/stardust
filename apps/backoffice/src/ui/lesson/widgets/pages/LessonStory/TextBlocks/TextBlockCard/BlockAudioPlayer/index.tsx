import { BlockAudioPlayerView } from './BlockAudioPlayerView'
import { useBlockAudioPlayer } from './useBlockAudioPlayer'
import { useStorageAudio } from '@/ui/global/hooks/useStorageAudio'

type Props = {
  fileName: string
}

type ContentProps = {
  url: string
}

function BlockAudioPlayerContent({ url }: ContentProps) {
  const player = useBlockAudioPlayer({ url })

  return (
    <BlockAudioPlayerView
      url={url}
      audioRef={player.audioRef}
      isPlaying={player.isPlaying}
      progress={player.progress}
      currentTimeLabel={player.currentTimeLabel}
      durationLabel={player.durationLabel}
      onTogglePlay={player.togglePlay}
      onSeek={player.handleSeek}
    />
  )
}

export const BlockAudioPlayer = ({ fileName }: Props) => {
  const { url } = useStorageAudio(fileName)

  if (!fileName) return null

  if (!url) {
    return (
      <div className='rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-400'>
        Audio indisponivel.
      </div>
    )
  }

  return <BlockAudioPlayerContent url={url} />
}
