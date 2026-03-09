https://github.com/JohnPetros/stardust/milestone/10

## Status de Implementacao (Spec: star-challenge-selector)

Ultima atualizacao: 2026-02-25

- [x] Expor endpoint de vinculo de desafio por estrela (`PATCH /challenging/challenges/:challengeId/star`)
- [x] Expor endpoint de desvinculo de desafio por estrela (`DELETE /challenging/challenges/:challengeId/star`)
- [x] Adicionar schema de validacao `challengeStarSchema` e export no pacote validation
- [x] Expandir contrato `ChallengingService` no core com `editChallengeStar` e `removeChallengeStar`
- [x] Implementar os metodos REST em `apps/studio` e `apps/web`
- [x] Criar e integrar `StarChallengeSelector` no `StarItem` (busca, paginacao, estados loading/error/empty/content)
- [x] Exibir titulo do desafio selecionado na trigger do seletor com largura fixa e ellipsis
- [x] Exibir desafio atualmente vinculado no dialog e fornecer acao de desvincular
- [x] Implementar fluxo de troca sem bloqueio (buscar atual -> desvincular -> vincular novo)
