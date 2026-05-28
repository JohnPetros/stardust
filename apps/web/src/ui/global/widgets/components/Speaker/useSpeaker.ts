import { useCallback, useEffect, useRef, useState } from 'react'

type Params = {
  url: string | null
  volume: number
  rate: number
  shouldAutoPlay: boolean
  isActive: boolean
}

export function useSpeaker({ url, volume, rate, shouldAutoPlay, isActive }: Params) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handlePause = useCallback(() => {
    if (!audioRef.current) return

    audioRef.current.pause()
    setIsPlaying(false)
  }, [])

  const handleTogglePlay = useCallback(async () => {
    if (!audioRef.current) return

    if (isPlaying) {
      handlePause()
      return
    }

    try {
      await audioRef.current.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }, [handlePause, isPlaying])

  useEffect(() => {
    const audioElement = audioRef.current
    if (!audioElement || !url) {
      handlePause()
      return
    }

    function handleEnded() {
      setIsPlaying(false)
    }

    audioElement.addEventListener('ended', handleEnded)

    return () => {
      audioElement.removeEventListener('ended', handleEnded)
      audioElement.pause()
      setIsPlaying(false)
    }
  }, [handlePause, url])

  useEffect(() => {
    if (!audioRef.current) return

    audioRef.current.volume = volume
    audioRef.current.playbackRate = rate
  }, [rate, volume])

  useEffect(() => {
    if (isActive) return

    handlePause()
  }, [handlePause, isActive])

  useEffect(() => {
    if (!url || !shouldAutoPlay || !isActive || !audioRef.current) return

    async function tryPlay() {
      try {
        await audioRef.current?.play()
        setIsPlaying(true)
      } catch {
        setIsPlaying(false)
      }
    }

    tryPlay()
  }, [isActive, shouldAutoPlay, url])

  return {
    audioRef,
    isPlaying,
    handleTogglePlay,
    handlePause,
  }
}
