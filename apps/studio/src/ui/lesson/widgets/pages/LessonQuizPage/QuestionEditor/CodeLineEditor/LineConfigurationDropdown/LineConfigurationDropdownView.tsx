import { Icon } from '@/ui/global/widgets/components/Icon'
import { Button } from '@/ui/shadcn/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/ui/shadcn/components/dropdown-menu'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'

const INDENTATION_OPTIONS = [0, 1, 2, 3, 4, 5]

type Props = {
  index: number
  isInput: boolean
  indentation: number
  onAddText: (index: number) => void
  onAddInput: (index: number) => void
  onIndentationChange: (indentation: number) => void
}

export const LineConfigurationDropdownView = ({
  index,
  isInput,
  indentation,
  onAddText,
  onAddInput,
  onIndentationChange,
}: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='size-6'>
          <Icon name='configuration' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        <DropdownMenuLabel>Configuração de linha</DropdownMenuLabel>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Tipo de conteúdo</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                Texto
                {!isInput && (
                  <DropdownMenuShortcut>
                    <Icon name='check' />
                  </DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                Entrada de dados
                {isInput && (
                  <DropdownMenuShortcut>
                    <Icon name='check' />
                  </DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Identação</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {INDENTATION_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => onIndentationChange(option)}
                >
                  Nível {option}
                  {indentation === option && (
                    <DropdownMenuShortcut>
                      <Icon name='check' />
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAddText(index + 1)}>
          Adicionar texto a direita
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAddInput(index + 1)}>
          Adicionar entrada de dados a direita
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
