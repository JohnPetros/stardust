'use client'
import { Terminal, FileCode, Barcode } from '@phosphor-icons/react'
import * as Tab from '@radix-ui/react-tabs'
import { TabButton } from './TabButton'

export function Tabs() {
  return (
    <Tab.Root className="bg-gray-800 rounded-md p-6">
      <Tab.List className="flex items-center gap-2">
        <TabButton title="Códigos escritos" icon={FileCode} isActive={true} />
        <TabButton title="Desafios criados" icon={Terminal} isActive={false} />
        <TabButton title="Soluções compartilhadas" icon={Barcode} isActive={false} />
      </Tab.List>
    </Tab.Root>
  )
}
