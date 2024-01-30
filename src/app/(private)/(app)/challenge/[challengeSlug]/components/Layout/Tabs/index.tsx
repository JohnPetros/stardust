'use client'

import { ReactNode } from 'react'
import { List, Root } from '@radix-ui/react-tabs'
import { AnimatePresence } from 'framer-motion'

import { TabButton } from './TabButton'
import { TabContent } from './TabContent'
import { useTabs } from './useTabs'

import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { useChallengeStore } from '@/stores/challengeStore'

type TabsProps = {
  children: ReactNode
}

export function Tabs({ children }: TabsProps) {
  const { activeTab, handleShowSolutions, handleTabButton } = useTabs()

  const canShowComments = useChallengeStore(
    (store) => store.state.canShowComments
  )
  const canShowSolutions = useChallengeStore(
    (store) => store.state.canShowSolutions
  )

  return (
    <div className="max-h-screen w-full rounded-md border-4 border-gray-700">
      <Root defaultValue="description" orientation="horizontal">
        <List className="flex items-center bg-gray-700 px-2">
          <TabButton
            title="Descrição"
            value="description"
            isActive={activeTab === 'description'}
            onClick={handleTabButton}
          />
          <span className="text-gray-600">|</span>
          <TabButton
            title="Resultado"
            value="result"
            isActive={activeTab === 'result'}
            onClick={handleTabButton}
          />
          <span className="text-gray-600">|</span>
          {!canShowComments ? (
            <Alert
              type="denying"
              title="Negado!"
              body={
                <p className="text-center leading-8 text-gray-100">
                  Você só pode ver os comentários de outros usuários apenas após
                  a conclusão do desafio.
                </p>
              }
              action={<Button>Entendido</Button>}
            >
              <TabButton
                title="Comentários"
                value="comments"
                isActive={activeTab === 'comments'}
                isBlocked={true}
                onClick={handleTabButton}
              />
            </Alert>
          ) : (
            <TabButton
              title="Comentários"
              value="comments"
              isActive={activeTab === 'comments'}
              isBlocked={false}
              onClick={handleTabButton}
            />
          )}
          <span className="text-gray-600">|</span>
          {!canShowSolutions ? (
            <Alert
              type="denying"
              title="Opa!"
              body={
                <div>
                  <p className="text-center leading-8 text-gray-100">
                    Para ver as soluções de outros usuários para esse desafio
                    você deve pagar{' '}
                    <span className="font-medium text-yellow-400">
                      10 de poeira estelar
                    </span>{' '}
                    em troca. Contudo, você não será mais apto a ganhar
                    recompensas ao terminar esse desafio.
                  </p>
                  <p className="my-4 text-center uppercase text-red-500">
                    Você tem certeza que deseja continuar?
                  </p>
                </div>
              }
              action={<Button onClick={handleShowSolutions}>Entendido</Button>}
              cancel={
                <Button className="bg-red-500 text-gray-100">Cancelar</Button>
              }
            >
              <TabButton
                title="Soluções"
                value="solutions"
                isActive={activeTab === 'solutions'}
                isBlocked={true}
              />
            </Alert>
          ) : (
            <TabButton
              title="Soluções"
              value="solutions"
              isActive={activeTab === 'solutions'}
              onClick={handleTabButton}
            />
          )}
        </List>
        <AnimatePresence>
          <TabContent value="description">{children}</TabContent>
          {/* {activeTab === 'description' && (
            <TabContent tabRef={addTabRef} value="description">
              <Description />
            </TabContent>
          )} */}
          {/* {activeTab === 'result' && (
            <TabContent tabRef={addTabRef} value="result">
              <Result />
            </TabContent>
          )} */}
        </AnimatePresence>
      </Root>
    </div>
  )
}
