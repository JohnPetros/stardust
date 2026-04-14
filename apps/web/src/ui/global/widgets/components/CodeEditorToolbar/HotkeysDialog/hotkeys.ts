type BuildHotkeysParams = {
  primaryModifierKeyLabel: 'Ctrl' | 'Cmd'
  altModifierKeyLabel: 'Alt' | 'Option'
}

export const buildHotkeys = ({
  primaryModifierKeyLabel,
  altModifierKeyLabel,
}: BuildHotkeysParams) => [
  {
    action: 'Executar código',
    command: `${altModifierKeyLabel} + Enter`,
  },
  {
    action: 'Arrumar código',
    command: `${primaryModifierKeyLabel} + M`,
  },
  {
    action: 'Exibir documentação da linguagem',
    command: `${primaryModifierKeyLabel} + K`,
  },
  {
    action: 'Deletar/copiar linha',
    command: `${primaryModifierKeyLabel} + X`,
  },
  {
    action: 'Selecionar linha',
    command: `${primaryModifierKeyLabel} + L`,
  },
  {
    action: 'Comentar código',
    command: `${primaryModifierKeyLabel} + .`,
  },
  {
    action: 'Apagar último código digitado',
    command: `${primaryModifierKeyLabel} + Z`,
  },
]
