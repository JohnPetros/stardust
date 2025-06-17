type WarningMessageViewProps = {
  shouldShow: boolean
}

export const WarningMessageView = ({ shouldShow }: WarningMessageViewProps) => {
  if (shouldShow)
    return (
      <p className='p-6 rounded-md border-dashed border border-yellow-400 text-yellow-400'>
        É recomendado que você complete todos os planetas antes de prosseguir para fazer
        desafios de código.
      </p>
    )
}
