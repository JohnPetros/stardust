import { TextBlockButton } from './TextBlockButton'

export const TextBlocksView = () => {
  return (
    <div>
      <p className='text-zinc-300'>
        Clique em um bloco abaixo para adicioná-lo ao editor.
      </p>
      <ul className='mt-4 space-y-2'>
        <li>
          <TextBlockButton type='default' endContent={null}>
            Bloco de texto padrão
          </TextBlockButton>
        </li>
        <li>
          <TextBlockButton type='alert' endContent={null}>
            Bloco de alerta
          </TextBlockButton>
        </li>
        <li>
          <TextBlockButton type='quote' endContent={null}>
            Bloco de reflexão
          </TextBlockButton>
        </li>
        <li>
          <TextBlockButton type='image' endContent={null}>
            Imagem
          </TextBlockButton>
        </li>
        <li>
          <TextBlockButton
            type='code'
            endContent={null}
            textBlockProps={[['isRunnable', 'true']]}
          >
            Bloco de código executável
          </TextBlockButton>
        </li>
        <li>
          <TextBlockButton
            type='code'
            endContent={null}
            textBlockProps={[['isRunnable', 'false']]}
          >
            Bloco de código não executável
          </TextBlockButton>
        </li>
        <li>
          <TextBlockButton type='code-line' endContent={null} hasPicture={false}>
            Linha de código
          </TextBlockButton>
        </li>
        <li>
          <TextBlockButton type='user' endContent={null} hasPicture={false}>
            Usuário
          </TextBlockButton>
        </li>
      </ul>
    </div>
  )
}
