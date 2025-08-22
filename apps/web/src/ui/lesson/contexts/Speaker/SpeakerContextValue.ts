export type SpeakerContextValue = {
  isEnabled: boolean
  volume: number
  rate: number
  pitch: number
  handleEnableToggle: () => void
  handleVolumeChange: (volume: number) => void
  handleRateChange: (rate: number) => void
  handlePitchChange: (pitch: number) => void
}
