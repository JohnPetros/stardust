import { useEffect } from 'react'
import { useChallengeContext } from '@/hooks/useChallengeContext'

import { Description } from './Description'
import { Result } from '../Result'
import * as Tabs from '@radix-ui/react-tabs'

export function Problem() {
  const {
    state: { challenge },
  } = useChallengeContext()

  useEffect(() => {

  }, [])

  if (challenge)
    return (
      <div className="w-full max-h-screen border-4 border-gray-700 rounded-md">
        <Tabs.Root defaultValue="description">
          <Tabs.List className="flex items-center gap-3 bg-gray-700 px-2">
            <Tabs.Trigger className="text-green-500 p-2" value="description">
              Descrição
            </Tabs.Trigger>
            <Tabs.Trigger className="text-green-500 p-2" value="result">
              Resultado
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content
            value="description"
            className="h-[calc(100vh-8rem)] overflow-y-scroll overflow-hidden "
          >
            <Description />
          </Tabs.Content>
          <Tabs.Content value="result">
            <Result />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    )
}
