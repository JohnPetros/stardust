import type { AudioVoiceDto } from '@stardust/core/lesson/structures/dtos'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/shadcn/components/select'

type Props = {
  voices: AudioVoiceDto[]
  value: AudioVoiceDto['value']
  isDisabled?: boolean
  onChange: (voice: AudioVoiceDto['value']) => void
}

export const BlockVoiceSelectorView = ({
  voices,
  value,
  isDisabled = false,
  onChange,
}: Props) => {
  const availableVoices =
    voices.length > 0 ? voices : [{ value: 'panda', label: 'Panda' }]

  return (
    <div className='space-y-2'>
      <p className='text-xs text-zinc-400'>Voz</p>
      <Select value={value} onValueChange={onChange} disabled={isDisabled}>
        <SelectTrigger className='w-[180px] border-zinc-800 bg-zinc-900'>
          <SelectValue placeholder='Selecione uma voz' />
        </SelectTrigger>
        <SelectContent>
          {availableVoices.map((voice) => (
            <SelectItem key={voice.value} value={voice.value}>
              {voice.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
