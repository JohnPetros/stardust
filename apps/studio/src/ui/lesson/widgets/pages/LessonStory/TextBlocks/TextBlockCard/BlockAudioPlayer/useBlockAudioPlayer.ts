import { useEffect, useMemo, useRef, useState } from 'react'

type Params = {
  url: string
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '00:00'
  const rounded = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(rounded / 60)
  const rest = rounded % 60
  return `${minutes.toString().padStart(2, '0')}:${rest.toString().padStart(2, '0')}`
}

export function useBlockAudioPlayer({ url }: Params) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audioElement = audioRef.current
    if (!audioElement) return

    const onTimeUpdate = () => setCurrentTime(audioElement.currentTime)
    const onLoadedMetadata = () => setDuration(audioElement.duration || 0)
    const onEnded = () => setIsPlaying(false)

    audioElement.addEventListener('timeupdate', onTimeUpdate)
    audioElement.addEventListener('loadedmetadata', onLoadedMetadata)
    audioElement.addEventListener('ended', onEnded)

    return () => {
      audioElement.removeEventListener('timeupdate', onTimeUpdate)
      audioElement.removeEventListener('loadedmetadata', onLoadedMetadata)
      audioElement.removeEventListener('ended', onEnded)
    }
  }, [url])

  function togglePlay() {
    const audioElement = audioRef.current
    if (!audioElement) return

    if (isPlaying) {
      audioElement.pause()
      setIsPlaying(false)
      return
    }

    void audioElement.play()
    setIsPlaying(true)
  }

  function handleSeek(progress: number) {
    const audioElement = audioRef.current
    if (!audioElement || duration <= 0) return

    const boundedProgress = Math.max(0, Math.min(100, progress))
    audioElement.currentTime = (boundedProgress / 100) * duration
  }

  const safeDuration = duration > 0 ? duration : 0
  const progress = useMemo(() => {
    if (safeDuration === 0) return 0
    return Math.min(100, (currentTime / safeDuration) * 100)
  }, [currentTime, safeDuration])

  return {
    audioRef,
    isPlaying,
    progress,
    currentTimeLabel: formatTime(currentTime),
    durationLabel: formatTime(duration),
    togglePlay,
    handleSeek,
  }
}
