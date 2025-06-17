import { twMerge } from 'tailwind-merge'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { AnimatedArrow } from '@/ui/global/widgets/components/AnimatedArrow'
import { AnimatedFieldsContainer } from './AnimatedFieldsContainer'
import { Field } from './Field'

type Props = {
  position: number
  isLocked: boolean
  isCorrect: boolean
  isOpen: boolean
  translatedInputs: string
  translatedExpectedOutput: string
  userOutput: unknown | null
  handleButtonClick: () => void
}

export const TestCaseView = ({
  position,
  isLocked,
  isCorrect,
  isOpen,
  translatedInputs,
  translatedExpectedOutput,
  userOutput,
  handleButtonClick,
}: Props) => {
  return (
    <div
      className={twMerge(
        'w-full rounded-md bg-gray-900 p-6',
        isLocked && !isCorrect ? 'opacity-[0.7]' : 'opacity-1',
      )}
    >
      <header className='flex items-center justify-between'>
        <div className='flex items-center'>
          <span className='grid h-6 w-6 place-content-center rounded-full bg-green-900'>
            {isCorrect ? (
              <Icon name='check' size={16} className='text-green-500' weight='bold' />
            ) : (
              <Icon name='close' size={16} className='text-red-700' weight='bold' />
            )}
          </span>
          <h4
            className={twMerge(
              'ml-3 text-base',
              isCorrect ? 'text-green-500' : 'text-red-700',
            )}
          >
            Teste de caso #{position}
          </h4>
        </div>

        <button
          type='button'
          className='grid place-content-center p-2'
          onClick={handleButtonClick}
          disabled={isLocked}
        >
          {isLocked ? (
            <Icon name='lock' className='text-base text-gray-100' weight='bold' />
          ) : (
            <AnimatedArrow isUp={isOpen} />
          )}
        </button>
      </header>
      <AnimatedFieldsContainer isOpen={isOpen}>
        <Field label='Entrada' value={translatedInputs} />
        <Field
          label='Seu resultado'
          value={userOutput ? (userOutput as string) : 'sem resultado'}
          isFromUser={true}
        />
        <Field label='Resultado esperado' value={translatedExpectedOutput} />
      </AnimatedFieldsContainer>
    </div>
  )
}
