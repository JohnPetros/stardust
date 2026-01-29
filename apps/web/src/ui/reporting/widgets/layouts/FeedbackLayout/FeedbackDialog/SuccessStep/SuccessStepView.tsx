import { Button } from '@/ui/global/widgets/components/Button'
import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  onReset: () => void
}

export const SuccessStepView = ({ onReset }: Props) => {
  return (
    <div className='flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-500'>
      <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-green-500'>
        <Icon name='check' className='text-gray-950' size={40} />
      </div>

      <h3 className='text-2xl font-bold text-gray-100'>Agradecemos o feedback!</h3>

      <div className='mt-8 w-full'>
        <Button
          onClick={onReset}
          className='w-full h-12 rounded-lg bg-gray-800 text-sm font-semibold text-gray-100 hover:bg-gray-700'
        >
          Quero enviar outro
        </Button>
      </div>
    </div>
  )
}
