import { Icon } from '@/ui/global/widgets/components/Icon'
import { Button } from '@/ui/shadcn/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/ui/shadcn/components/dropdown-menu'

const INDENTATION_OPTIONS = [0, 1, 2, 3, 4, 5]

type Props = {
  index: number
  isInput: boolean
  indentation: number
  isRemoveBlockDisabled: boolean
  isAddInputDisabled: boolean
  onAddText: (blockIndex: number) => void
  onAddInput: (blockIndex: number) => void
  onIndentationChange: (indentation: number) => void
  onReplaceWithText: (blockIndex: number) => void
  onReplaceWithInput: (blockIndex: number) => void
  onRemoveBlock: (blockIndex: number) => void
}

export const CodeLineConfigurationDropdownMenuView = ({
  index,
  isInput,
  indentation,
  isAddInputDisabled,
  isRemoveBlockDisabled,
  onAddText,
  onAddInput,
  onIndentationChange,
  onReplaceWithText,
  onReplaceWithInput,
  onRemoveBlock,
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
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Tipo de bloco</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => onReplaceWithText(index)}>
                  Texto
                  {!isInput && (
                    <DropdownMenuShortcut>
                      <Icon name='check' />
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onReplaceWithInput(index)}
                  disabled={isAddInputDisabled}
                >
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
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onAddText(index + 1)}>
            Adicionar texto a direita
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onAddInput(index + 1)}
            disabled={isAddInputDisabled}
          >
            Adicionar entrada de dados a direita
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onRemoveBlock(index)}
            disabled={isRemoveBlockDisabled}
          >
            Remover bloco
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
