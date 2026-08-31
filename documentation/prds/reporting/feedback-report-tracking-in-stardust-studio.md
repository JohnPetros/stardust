# PRD — Acompanhamento de Relatórios de Feedback no StarDust Studio

- **Módulo:** `reporting`
- **Milestone:** [#1 — Acompanhamento de Relatórios de Feedback no StarDust Studio](https://github.com/JohnPetros/stardust/milestone/1)
- **Status:** open
- **Atualizado em:** 2026-08-30T21:34:53Z

## Definição do produto

## Objetivo

Transformar a página de feedbacks do **StarDust Studio** em uma central administrativa para localizar, acompanhar, responder e concluir relatórios enviados pelos usuários, preservando todo o histórico da conversa.

O escopo deste milestone é restrito à interface administrativa do Studio. O diálogo de feedback da aplicação Web participa apenas como dependência externa para envio e recebimento de respostas.

## Escopo

- Listagem paginada com ID, avatar, e-mail do autor, tipo, status, atividade recente, preview e quantidade de respostas.
- Busca por ID ou e-mail e filtros por tipo, status e período.
- Contadores de relatórios abertos, fechados e não lidos.
- Priorização de relatórios não lidos e, depois, por atividade mais recente.
- Dialog com relato original, conversa cronológica e anexos.
- Respostas administrativas de 1 a 2.000 caracteres.
- Até 3 anexos PNG ou JPG por mensagem, com limite de 10 MB por arquivo.
- Status limitados a `Aberto` e `Fechado`.
- Fechamento permitido somente após existir uma resposta administrativa.
- Reabertura disponível apenas para administradores, sem dialog adicional.
- Notificação do usuário por e-mail quando o administrador responder.
- Notificação resumida no Discord quando o usuário responder, contendo ID, usuário, trecho, indicação de anexo e link para o Studio.
- Indicador persistente de respostas não lidas no Studio.

## Regras críticas

- O histórico permanece visível quando o relatório estiver fechado.
- Respostas e mudanças de status devem ser persistidas antes das notificações assíncronas.
- Falhas de e-mail ou Discord não desfazem mensagens nem mudanças de status.
- O badge de não lidos conta relatórios, não mensagens.
- Discord e e-mail são canais de aviso; a conversa persistida no StarDust é a fonte canônica.

## Fora do escopo

- Implementar ou redesenhar o diálogo de feedback da aplicação Web.
- Excluir ou arquivar relatórios.
- Excluir ou editar mensagens.
- Estados adicionais, atribuição por administrador, prioridades, tags ou SLA.
- Respostas por e-mail ou Discord.
- Notas internas e log separado de auditoria administrativa.
- Painel analítico novo no Studio.

## Critérios de sucesso iniciais

Nos primeiros 60 dias:

- ao menos 90% dos relatórios recebem resposta administrativa;
- mediana da primeira resposta inferior a 3 dias;
- ao menos 70% dos relatórios são fechados após interação administrativa;
- nenhuma resposta ou mudança de status é perdida por erro da interface.

## Referência

[PRD — Acompanhamento de Relatórios de Feedback no Studio](https://github.com/JohnPetros/stardust/blob/main/documentation/features/reporting/feedback-reports-management/prd.md)
