import { Button } from '@/ui/shadcn/components/button'
import { CodeSnippet } from '@/ui/global/widgets/components/CodeSnippet'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { AddItemButton } from '@/ui/lesson/widgets/components/AddItemButton'

type Props = {
  value?: string
  defaultValue: string
  isEnabled: boolean
  onChange: (code: string) => void
  onDisableButtonClick: () => void
  onEnableButtonClick: () => void
}

export const CodeInputView = ({
  value,
  defaultValue,
  isEnabled,
  onChange,
  onDisableButtonClick,
  onEnableButtonClick,
}: Props) => {
  return (
    <div>
      <div className='flex items-center gap-3'>
        {isEnabled && (
          <div className='flex items-center'>
            <h3>trecho de código</h3>
            <Button onClick={onDisableButtonClick} size='icon' variant='ghost'>
              <Icon name='trash' className='w-4 h-4' />
            </Button>
          </div>
        )}
        {!isEnabled && (
          <AddItemButton onClick={onEnableButtonClick}>
            Adicionar trecho de código
          </AddItemButton>
        )}
      </div>
      {isEnabled && (
        <CodeSnippet code={value ? value : defaultValue} onChange={onChange} isRunnable />
      )}
    </div>
  )
}
