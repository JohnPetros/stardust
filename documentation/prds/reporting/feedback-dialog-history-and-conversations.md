# PRD — Histórico e Conversas no Diálogo de Feedback

- **Módulo:** `reporting`
- **Milestone:** [#41 — Histórico e Conversas no Diálogo de Feedback](https://github.com/JohnPetros/stardust/milestone/41)
- **Status:** open
- **Atualizado em:** 2026-08-13T00:19:23Z

## Definição do produto

## Objetivo

Transformar o diálogo de feedback da aplicação Web em um ponto contínuo de comunicação entre o usuário autenticado e a equipe StarDust. Além de criar um relato, o usuário poderá consultar os próprios reportes, identificar respostas novas, acompanhar o histórico e continuar conversas abertas.

O escopo desta milestone é restrito à experiência do usuário na aplicação Web. A gestão administrativa permanece coberta pela milestone de acompanhamento de feedbacks no Studio.

## Escopo

- Disponibilizar o diálogo em todas as áreas autenticadas, em desktop e mobile.
- Criar reportes como `Problema`, `Ideia` ou `Outro`.
- Exigir relato inicial entre 10 e 1.000 caracteres.
- Gerar automaticamente título de até 60 caracteres a partir do relato.
- Permitir uma imagem PNG ou JPG de até 10 MB no relato inicial.
- Manter captura e recorte no desktop e permitir seleção de imagem no desktop e mobile.
- Exibir histórico privado com filtros `Todos`, `Abertos` e `Fechados`.
- Carregar reportes em lotes de 10 com ação `Carregar mais`.
- Priorizar reportes com nova resposta e atividade mais recente.
- Exibir badge com quantidade de reportes com novidades, não mensagens.
- Apresentar `Nova resposta` no item do histórico sem contador individual.
- Exibir relato inicial, mensagens e anexos em conversa cronológica.
- Permitir respostas do usuário entre 1 e 2.000 caracteres.
- Permitir até 3 anexos PNG ou JPG por resposta, com limite de 10 MB cada.
- Preservar rascunhos localmente enquanto a página permanecer aberta.
- Manter reportes fechados visíveis, com resposta desabilitada.
- Abrir diretamente a conversa pelo botão `Ver conversa` do e-mail, preservando o destino após autenticação.

## Regras críticas

- O usuário acessa somente reportes da própria conta.
- Somente administradores alteram o status `Aberto` ou `Fechado`.
- O relato inicial cria o reporte; respostas posteriores são mensagens associadas.
- Texto é obrigatório em relatos e respostas, mesmo quando houver anexos.
- Reportes, mensagens e anexos não podem ser excluídos ou arquivados nesta versão.
- Não haverá atualização realtime no MVP.
- E-mail e Discord são canais de aviso; a conversa persistida no StarDust é a fonte canônica.

## Fora do escopo

- Feedback de visitantes não autenticados.
- Alteração de status pelo usuário.
- Exclusão, arquivamento ou edição de conteúdo persistido.
- Respostas por e-mail ou Discord.
- Persistência de rascunho entre sessões.
- PDF, WEBP, GIF, vídeo, áudio ou outros formatos.
- Votação, comentários públicos, roadmap, tags, prioridade ou SLA.
- Painel administrativo do Studio.

## Critérios de sucesso iniciais

Nos primeiros 60 dias:

- ao menos 70% das respostas administrativas são visualizadas em até 7 dias;
- ao menos 30% dos reportes respondidos pela equipe recebem continuidade do usuário;
- sucesso técnico superior a 99% no envio de relatos e respostas;
- nenhuma exposição de reporte para outro usuário.

## Referências

- [PRD — Histórico e Conversas no Diálogo de Feedback](https://github.com/JohnPetros/stardust/blob/main/documentation/features/reporting/feedback-dialog/prd.md)
- [Milestone administrativa — Acompanhamento de Relatórios de Feedback no Studio](https://github.com/JohnPetros/stardust/milestone/1)
