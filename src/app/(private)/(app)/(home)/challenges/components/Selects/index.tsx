'use client'
import { Select } from '@/app/components/Select'
import { CheckCircle, Circle } from '@phosphor-icons/react'

export function Selects() {
  return (
    <div className="flex items-center">
      <Select.Container>
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
            value="completed"
            icon={<Circle className="text-gray-400 text-lg" weight="bold" />}
            text="Não Resolvido"
          />
        </Select.Content>
      </Select.Container>
    </div>
  )
}
