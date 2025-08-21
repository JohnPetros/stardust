import { useAudioContext } from '@/ui/global/hooks/useAudioContext'

export function usePreferences() {
  const { isAudioDisabled, toggleAudioDisability } = useAudioContext()

  async function handleCanPlayAudioChange() {
    await toggleAudioDisability()
  }

  return {
    isAudioDisabled,
    handleCanPlayAudioChange,
  }
}
