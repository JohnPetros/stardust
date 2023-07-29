'use client'
import { useState } from 'react'
import { TabButton } from './TabButton'
import {
  Terminal,
  FileCode,
  Barcode,
  Icon,
  Clock,
  CaretUp,
} from '@phosphor-icons/react'
import * as Tab from '@radix-ui/react-tabs'
import { twMerge } from 'tailwind-merge'
import { SorterButton } from './SorterButton'

type TabValue = 'tab-1' | 'tab-2' | 'tab-3'

type Sorter = 'created_at' | 'votes'

type Tab = {
  title: string
  icon: Icon
  value: TabValue
  hasSorters: boolean
}

const tabs: Tab[] = [
  {
    title: 'Códigos escritos',
    icon: FileCode,
    value: 'tab-1',
    hasSorters: false,
  },
  {
    title: 'Desafios criados',
    icon: Terminal,
    value: 'tab-2',
    hasSorters: true,
  },
  {
    title: 'Soluções compartilhadas',
    icon: Barcode,
    value: 'tab-3',
    hasSorters: true,
  },
]

export function Tabs() {
  const [activeTab, setActiveTab] = useState<TabValue>('tab-1')
  const [hasSorters, setHasSorters] = useState(false)
  const [activeSorter, setActiveSorter] = useState<Sorter>('created_at')

  function handleTabClick(tabValue: TabValue, hasSorters: boolean) {
    setActiveTab(tabValue)
    setHasSorters(hasSorters)
  }

  return (
    <Tab.Root className="bg-gray-800 rounded-md p-6">
      <Tab.List className="flex items-center justify-between gap-2">
        <div className="flex gap-1 items-center">
          {tabs.map(({ title, icon, value, hasSorters }) => (
            <TabButton
              key={value}
              title={title}
              icon={icon}
              value={value}
              isActive={value === activeTab}
              onClick={() => handleTabClick(value, hasSorters)}
            />
          ))}
        </div>

        {hasSorters && (
          <div className="flex items-center justify-end">
            <SorterButton title="Mais recentes" icon={Clock} isActive={false} />
            <SorterButton
              title="Mais votados"
              icon={CaretUp}
              isActive={false}
            />
          </div>
        )}
      </Tab.List>
    </Tab.Root>
  )
}
