type CodeExplanationAlertDialogMode = 'confirm' | 'blocked'

type UseCodeExplanationAlertDialogProps = {
  mode: CodeExplanationAlertDialogMode
  remainingUses: number | null
}

export function useCodeExplanationAlertDialog({
  mode,
  remainingUses,
}: UseCodeExplanationAlertDialogProps) {
  if (mode === 'blocked') {
    return {
      title: 'Limite diario atingido',
      description:
        'Voce ja usou todas as 10 explicacoes de hoje. Tente novamente no proximo dia.',
      actionLabel: 'Entendi',
      shouldShowCancel: false,
      type: 'denying' as const,
    }
  }

  const usesLabel =
    remainingUses === null
      ? 'Esta acao consome 1 uso diario.'
      : `Voce ainda possui ${remainingUses} uso(s) hoje. Esta acao consome 1 uso.`

  return {
    title: 'Gerar explicacao com IA?',
    description: usesLabel,
    actionLabel: 'Gerar explicacao',
    shouldShowCancel: true,
    type: 'asking' as const,
  }
}
