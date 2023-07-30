'use client'
import { useState } from 'react'
import { CheckCircle, Circle } from '@phosphor-icons/react'
import { Select } from '../Select'

export function Filters() {
  const [status, setStatus] = useState('')

  return (
    <div className="flex items-center">
      <Select.Container onValueChange={setStatus}>
        <Select.Trigger value="Status" />
        <Select.Content>
          <Select.Item
            value="completed"
            icon={
              <CheckCircle className="text-green-500 text-lg" weight="bold" />
            }
            text="Resolvido"
          />
          <Select.Separator />
          <Select.Item
            value="not-completed"
            icon={<Circle className="text-gray-400 text-lg" weight="bold" />}
            text="Não Resolvido"
          />
        </Select.Content>
      </Select.Container>
    </div>
  )
}
