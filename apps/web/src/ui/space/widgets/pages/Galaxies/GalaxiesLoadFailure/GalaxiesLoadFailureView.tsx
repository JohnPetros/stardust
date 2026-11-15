import { Button } from '@/ui/global/widgets/components/Button'

export type Props = {
  onRetry: () => void
}

export function GalaxiesLoadFailureView({ onRetry }: Props) {
  return (
    <div
      role='alert'
      className='mx-auto mt-24 flex w-full max-w-[440px] flex-col items-center gap-4 text-center md:mt-40'
    >
      <h2 className='text-xl font-semibold text-theme-text-primary'>
        Não foi possível carregar as galáxias
      </h2>
      <p className='text-sm text-theme-text-secondary'>
        Verifique sua conexão e tente de novo. Seu progresso continua salvo.
      </p>
      <Button
        testId='retry-button'
        onClick={onRetry}
        className='w-auto min-w-[180px] whitespace-nowrap px-6'
      >
        Tentar novamente
      </Button>
    </div>
  )
}
