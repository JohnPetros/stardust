'use client'

import { Animation } from '@/modules/global/components/shared/Animation'

export function EmptyListMessage() {
  return (
    <div className='flex flex-col items-center justify-center'>
      <Animation name='apollo-missing' size={220} hasLoop />
      <p className='text-sm text-gray-300'>Nenhuma conquista adquirida ainda 😢.</p>
    </div>
  )
}
