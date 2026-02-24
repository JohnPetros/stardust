# PRD - Users Management

- Milestone de referência: https://github.com/JohnPetros/stardust/milestone/5

## Entrega: exportação de usuários em XLSX

- [x] Disponibilizar endpoint administrativo para exportar usuários.
- [x] Restringir acesso para contas autorizadas (admin/god).
- [x] Gerar arquivo no formato XLSX.
- [x] Incluir campos operacionais principais da tabela de usuários.
- [x] Permitir download via página de usuários no Studio.

## Notas de implementação

- A exportação foi implementada como `GET /profile/users/xlsx`.
- O backend exporta todos os usuários e aplica ordenação por criação (mais novos primeiro).
- O Studio exibe ação `Baixar XLSX` na página de usuários e faz fallback para nome `.xlsx` quando necessário.
