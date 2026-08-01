---
title: Acompanhamento de Relatórios de Feedback no Studio
milestone: https://github.com/JohnPetros/stardust/milestone/1
apps: studio
dependencies: server, web, email, discord
status: draft
last_updated_at: 2026-08-01
---

# PRD: Acompanhamento de Relatórios de Feedback no Studio

## 1. Visão Geral

### 1.1 Descrição

Esta revisão transforma a página de relatórios de feedback do **StarDust
Studio** em uma central administrativa de acompanhamento. Além de localizar e
consultar relatos, administradores poderão acompanhar conversas, responder ao
usuário, trabalhar com anexos e controlar um ciclo simples de abertura e
fechamento.

O escopo deste PRD é restrito à experiência administrativa do Studio. O diálogo
de feedback utilizado pelo usuário na aplicação Web é uma dependência externa:
este documento define apenas os contratos e efeitos necessários para que as
respostas do usuário apareçam e sejam tratadas corretamente no Studio.

### 1.2 Problema

A implementação vinculada ao [milestone 1](https://github.com/JohnPetros/stardust/milestone/1)
centraliza a listagem e a consulta de feedbacks, mas o fluxo documentado termina
na visualização ou exclusão definitiva do relato. Isso impede o administrador de:

- pedir esclarecimentos e preservar a resposta junto ao relato original;
- saber quais conversas receberam novas mensagens do usuário;
- comunicar uma resposta ou resolução de forma consistente;
- distinguir relatórios em andamento de relatórios concluídos;
- preservar um histórico útil para produto, suporte e QA.

O resultado atual é uma combinação de consulta no Studio, comunicação por canais
paralelos e acompanhamento manual, com risco de perda de contexto e de relatos
sem retorno.

### 1.3 Objetivo

Oferecer no Studio um fluxo único e rastreável para localizar, ler, responder e
concluir relatórios de feedback, mantendo o histórico íntegro e avisando cada
participante pelo canal adequado.

### 1.4 Proposta de valor

- **Para administradores:** uma fila simples que evidencia o que exige atenção e
  mantém relato, mensagens e anexos no mesmo contexto.
- **Para produto, suporte e QA:** histórico pesquisável sem exclusão ou
  fragmentação em ferramentas externas.
- **Para usuários da aplicação:** respostas administrativas recebidas por e-mail
  e acessíveis na experiência de feedback da aplicação Web.
- **Para o StarDust:** uma solução integrada e proporcional ao volume atual, sem
  introduzir a complexidade operacional de um help desk completo.

### 1.5 Escopo da primeira versão

Esta versão contempla:

- listagem administrativa com busca, filtros, paginação, contadores e ordenação;
- estado de leitura das respostas recebidas do usuário;
- diálogo com relato original e conversa cronológica;
- respostas administrativas textuais com anexos de imagem;
- estados `Aberto` e `Fechado`, incluindo reabertura;
- e-mail assíncrono quando o administrador responde;
- notificação resumida no Discord quando o usuário responde;
- métricas agregadas de resposta e fechamento.

### 1.6 Critérios de sucesso

As métricas devem ser avaliadas nos primeiros 60 dias após a disponibilização:

| Métrica | Meta inicial |
|---|---:|
| Relatórios que recebem ao menos uma resposta administrativa | >= 90% |
| Mediana do tempo até a primeira resposta administrativa | < 3 dias |
| Relatórios fechados após interação administrativa | >= 70% |
| Respostas ou mudanças de status perdidas por erro da interface | 0 |

As metas são iniciais porque ainda não existe uma linha de base confiável. Elas
devem ser revistas após o primeiro ciclo de 60 dias.

### 1.7 Restrições e princípios

- O Studio continua restrito a contas administrativas autorizadas.
- O histórico não pode ser excluído nem arquivado nesta versão.
- O ciclo de vida deve permanecer simples, com somente dois estados.
- Mensagens do usuário e do administrador são públicas entre os dois lados; não
  existem notas internas nesta versão.
- Discord e e-mail são canais de aviso, não fontes canônicas da conversa.
- A conversa persistida no StarDust é a fonte canônica.

## 2. Público-alvo

### 2.1 Público principal

**Administradores do StarDust** responsáveis por ler feedbacks e responder aos
usuários. Usam o Studio em desktop, em sessões operacionais periódicas ou após
receberem uma notificação.

**Dores e necessidades:**

- descobrir rapidamente quais relatórios exigem atenção;
- entender o relato sem alternar entre diferentes ferramentas;
- responder e concluir uma conversa sem perder o histórico;
- diferenciar itens novos, em andamento e concluídos;
- evitar que uma falha de e-mail cause perda ou duplicação da resposta.

**Jobs to Be Done:**

- Quando houver uma nova resposta do usuário, quero identificar o relatório que
  exige atenção, para continuar a conversa sem procurar manualmente.
- Quando eu analisar um relato, quero ver o contexto e toda a conversa, para dar
  uma resposta informada.
- Quando eu responder, quero que a mensagem seja salva e o usuário seja avisado,
  para que a comunicação seja confiável mesmo se o e-mail atrasar.
- Quando o assunto estiver concluído, quero fechar o relatório sem apagar o
  histórico, para manter a fila organizada e o contexto disponível.

### 2.2 Públicos secundários

- **Equipe de produto:** consulta ideias, respostas e desfechos para apoiar
  decisões de produto.
- **Equipe de QA e desenvolvimento:** consulta problemas relatados, evidências e
  esclarecimentos fornecidos pelo usuário.
- **Equipe de suporte:** acompanha conversas relacionadas à experiência do
  usuário, quando possuir acesso administrativo ao Studio.

### 2.3 Participante externo

O **usuário autenticado da aplicação Web** inicia o relato e pode responder à
conversa. Ele é participante do fluxo de negócio, mas sua interface não faz
parte do escopo deste PRD.

### 2.4 Não público

- visitantes não autenticados;
- usuários comuns sem acesso ao Studio;
- equipes que procuram gestão completa de suporte, SLA, atribuição ou filas por
  agente;
- comunidades que procuram votação pública, roadmap ou discussão aberta entre
  usuários.

## 3. Análise do Cenário Competitivo

### 3.1 Resumo do mercado

O problema está entre duas categorias consolidadas:

1. **Gestão de feedback de produto**, representada por Canny e UserVoice, com
   portais, comentários, status, votação e comunicação com autores.
2. **Atendimento e ticketing**, representado por Intercom e Jira Service
   Management, com inbox, histórico, estados, anexos e notificações.

O StarDust não precisa reproduzir integralmente nenhuma dessas categorias. A
oportunidade é incorporar apenas o ciclo essencial de acompanhamento no produto
e no Studio existentes.

### 3.2 Matriz competitiva

| Solução | Público | Proposta de valor | Funcionalidades | Preço público | Limitações |
|---|---|---|---|---|---|
| [Canny](https://canny.io/pricing) | Times de produto e SaaS | Centralizar e priorizar feedback ligado a decisões de produto | Portal, comentários, status, boards, integrações e automações | Free; Pro a partir de US$ 79/mês com cobrança anual; Business sob consulta | O preço escala por usuários associados a feedback e a solução inclui recursos de priorização e roadmap além do necessário para o MVP |
| [UserVoice](https://uservoice.com/pricing) | Times de produto e customer success | Capturar, organizar e comunicar decisões sobre ideias | Portal, comentários, status públicos e internos, segmentação e notificações | Não identificado publicamente | Fluxo orientado a ideias, votação e descoberta de produto; maior complexidade que uma fila administrativa interna |
| [Intercom](https://www.intercom.com/pricing) | Suporte, vendas e atendimento | Unificar conversas, tickets e automação em uma caixa de entrada | Messenger, inbox compartilhada, tickets, histórico, e-mail e relatórios | Plano Essential listado a US$ 29 por assento/mês, com preço promocional exibido; Fin a partir de US$ 0,99 por resultado | Plataforma ampla, com custo por assento e recursos de atendimento além do escopo do StarDust |
| [Jira Service Management](https://www.atlassian.com/software/jira/service-management/pricing) | Times de suporte, operações e TI | Gerenciar solicitações por portal, e-mail e filas configuráveis | Portal, formulários, workflows, filas, anexos e notificações | Free para até 3 agentes; Standard a US$ 20 por agente/mês; Premium a US$ 51,42 por agente/mês | Workflows e configuração orientados a service management, excessivos para o ciclo simples de feedback |
| Discord + consulta manual ao banco | Equipe interna pequena | Avisar rapidamente e investigar sob demanda | Webhook, mensagens e links manuais | Sem custo incremental identificado | Não mantém estado de leitura confiável, ciclo de vida, filtros nem histórico canônico de acompanhamento |

### 3.3 Evidências relevantes

- A página oficial do Canny informa que comentários públicos de administradores
  notificam autores por e-mail; a central de notificações também cobre novos
  comentários e mudanças de status. Fontes: [Comments](https://help.canny.io/en/articles/5795311-comments)
  e [Notifications](https://help.canny.io/en/articles/5380265-notifications).
- Segundo a documentação do UserVoice, usuários podem receber e-mails sobre
  comentários e mudanças de status. O Notification Center administrativo usa
  contador, estado de leitura e agrupamento de atividades relacionadas. Fontes:
  [Email Notifications for Users](https://help.uservoice.com/hc/en-us/articles/32833899285779-Email-Notifications-for-Users)
  e [Notification Center](https://help.uservoice.com/hc/en-us/articles/360035475133-Notification-Center).
- A documentação do Intercom descreve tickets visíveis no Messenger, badge,
  histórico e e-mails quando um administrador responde ou o estado muda. Fonte:
  [How customers get notified about tickets](https://www.intercom.com/help/en/articles/8300308-how-customers-get-notified-about-tickets).
- A Atlassian diferencia notificações internas e do cliente e oferece controles
  de segurança para anexos enviados por e-mail. Fontes:
  [Customer and team notifications](https://support.atlassian.com/jira-service-management-cloud/docs/what-notifications-do-my-customers-and-service-desk-team-receive/)
  e [Customer access to attachments](https://support.atlassian.com/jira-service-management-cloud/docs/set-up-how-your-customers-access-attachments/).

### 3.4 Oportunidade e diferenciação recomendada

**Inferência baseada nas fontes:** comentários, estado de leitura, status e
notificações são padrões maduros. O diferencial do StarDust não deve ser a
quantidade de recursos, mas a integração com a identidade, o avatar e o contexto
do usuário já existentes.

Diferenciais recomendados:

- fluxo disponível no Studio e no diálogo de feedback já conhecidos, sem um
  portal ou conta adicional;
- apenas `Aberto` e `Fechado`, reduzindo esforço operacional;
- conversa privada entre usuário e administração, sem votação ou exposição
  pública;
- Discord usado para chamar atenção e Studio usado para preservar o estado;
- resposta salva antes do e-mail, protegendo a integridade da conversa.

## 4. Requisitos

### REQ-01 Listagem e localização de relatórios

- [ ] **Listagem e localização de relatórios**

**Descrição:** o Studio deve apresentar uma visão paginada dos relatórios de
feedback e permitir localizar um item por seus principais atributos.

#### Regras de Negócio

- **Regra:** cada linha deve apresentar ID, avatar e e-mail do autor, tipo,
  status, data da atividade mais recente, prévia textual, quantidade de respostas
  e ação `Ver`.
- **Regra:** os tipos permanecem `Problema`, `Ideia` e `Outro`, correspondentes
  aos intents canônicos do domínio.
- **Regra:** a página deve apresentar contadores de relatórios abertos, fechados
  e não lidos.
- **Validação:** a busca deve aceitar ID completo ou parcial e e-mail completo ou
  parcial, sem diferenciar maiúsculas de minúsculas.
- **Validação:** os filtros disponíveis devem ser tipo, status e período de
  envio, combináveis com a busca.
- **Exceção:** relatório sem respostas deve apresentar quantidade zero; relatório
  sem imagem não deve reservar espaço para miniatura na tabela.
- **Dependência:** serviço paginado de relatórios e dados públicos de perfil do
  autor.

#### Regras de UI/UX

- **Interface:** utilizar tabela e controles do design system do Studio; badges
  de tipo e status não podem depender apenas de cor.
- **Feedback:** exibir skeleton durante o carregamento e manter filtros aplicados
  quando uma consulta falhar.
- **Estado vazio:** diferenciar `Nenhum feedback recebido` de `Nenhum resultado
  para estes filtros`, oferecendo limpar filtros no segundo caso.
- **Ação bloqueada:** desabilitar paginação enquanto a página solicitada estiver
  carregando.
- **Responsividade:** preservar todas as ações em desktop; em largura reduzida,
  permitir rolagem horizontal e manter ID, autor, status e ação visíveis.
- **Acessibilidade:** filtros devem possuir rótulos programáticos, a tabela deve
  ter cabeçalhos associados e badges devem possuir texto legível.

---

### REQ-02 Priorização e estado de leitura

- [ ] **Priorização e estado de leitura**

**Descrição:** respostas novas do usuário devem tornar o relatório visivelmente
pendente de leitura até que um administrador abra a conversa.

#### Regras de Negócio

- **Regra:** o badge no item `Feedbacks` deve contar relatórios não lidos, não a
  quantidade de mensagens.
- **Regra:** a tabela deve ordenar primeiro os relatórios não lidos e, dentro de
  cada grupo, a atividade mais recente.
- **Regra:** atividade recente considera criação do relato, resposta do usuário
  ou resposta administrativa.
- **Regra:** abrir o diálogo de um relatório marca as respostas disponíveis como
  lidas para a visão administrativa.
- **Validação:** três mensagens novas no mesmo relatório incrementam o contador
  global em apenas uma unidade.
- **Exceção:** respostas administrativas não tornam o relatório não lido para o
  próprio Studio.
- **Dependência:** marcador persistente de leitura administrativa e evento de
  resposta do usuário.

#### Regras de UI/UX

- **Interface:** destacar linhas não lidas com peso tipográfico e indicador
  visual discreto; o destaque deve desaparecer após a abertura bem-sucedida.
- **Feedback:** atualizar contador e linha sem exigir recarregamento completo da
  página.
- **Estado vazio:** ocultar o badge global quando o total for zero.
- **Ação bloqueada:** se a marcação de leitura falhar, manter o relatório como não
  lido e permitir nova tentativa sem impedir a consulta.
- **Responsividade:** o indicador de não lido deve permanecer visível nas colunas
  essenciais.
- **Acessibilidade:** anunciar o total de não lidos e expor o estado `Não lido`
  por texto acessível.

---

### REQ-03 Consulta do relato e da conversa

- [ ] **Consulta do relato e da conversa**

**Descrição:** o diálogo de detalhes deve reunir a identificação do relatório,
o relato original e todas as mensagens em ordem cronológica.

#### Regras de Negócio

- **Regra:** exibir ID do relatório, e-mail e avatar do usuário, tipo, status e
  datas relevantes.
- **Regra:** diferenciar visualmente o relato original das respostas posteriores.
- **Regra:** cada mensagem deve identificar autor (`Usuário` ou `Administrador`),
  data e hora e anexos associados.
- **Regra:** o histórico deve continuar disponível quando o relatório estiver
  fechado.
- **Validação:** mensagens devem ser exibidas em ordem cronológica crescente.
- **Exceção:** avatar indisponível deve usar fallback consistente; anexo
  indisponível deve mostrar erro localizado sem impedir a leitura da conversa.
- **Dependência:** entidade de relatório, mensagens, autor e armazenamento de
  anexos.

#### Regras de UI/UX

- **Interface:** usar composição semelhante a fórum, com avatar à esquerda,
  metadados no cabeçalho da mensagem e conteúdo em bloco compacto; usar ícone
  administrativo para respostas da equipe.
- **Feedback:** carregar o diálogo com skeleton e informar falha sem fechar a
  listagem ao fundo.
- **Estado vazio:** quando não houver respostas, apresentar somente o relato
  original e o campo de resposta.
- **Ação bloqueada:** se o relatório deixar de existir ou ficar inacessível,
  informar indisponibilidade e oferecer retorno à lista.
- **Responsividade:** em viewport menor, o diálogo deve ocupar a maior parte da
  tela e permitir rolagem interna sem esconder ações.
- **Acessibilidade:** controlar foco ao abrir e fechar, permitir Escape, fornecer
  título acessível e manter ordem de leitura compatível com a cronologia.

---

### REQ-04 Envio de resposta administrativa

- [ ] **Envio de resposta administrativa**

**Descrição:** o administrador deve responder ao usuário sem sair do diálogo e
ver a mensagem persistida imediatamente após o sucesso.

#### Regras de Negócio

- **Regra:** a resposta administrativa deve conter entre 1 e 2.000 caracteres.
- **Regra:** texto composto apenas por espaços é inválido.
- **Regra:** toda resposta administrativa exige texto, mesmo quando contém
  anexos.
- **Regra:** a mensagem deve registrar o administrador autor e o instante de
  envio como metadados da conversa; isso não constitui um log de auditoria
  separado.
- **Validação:** impedir envio duplicado enquanto a requisição estiver em curso.
- **Exceção:** uma falha deve preservar texto e anexos selecionados para nova
  tentativa.
- **Dependência:** conta administrativa autenticada, endpoint de mensagens e
  processamento assíncrono de e-mail.

#### Regras de UI/UX

- **Interface:** posicionar o compositor após a conversa, com separação espacial
  clara entre mensagens existentes e nova resposta.
- **Feedback:** após persistir, inserir a mensagem na conversa e mostrar
  `Resposta enviada`; durante o envio, apresentar progresso e bloquear novo
  submit.
- **Estado vazio:** o campo vazio deve apresentar instrução curta e contador de
  caracteres quando pertinente.
- **Ação bloqueada:** explicar validações de texto junto ao campo, sem apagar o
  conteúdo.
- **Responsividade:** controles de anexar e enviar devem permanecer acessíveis sem
  sobreposição.
- **Acessibilidade:** o campo deve possuir label, erros associados por ARIA e
  envio por teclado sem impedir quebras de linha.

---

### REQ-05 Anexos em respostas

- [ ] **Anexos em respostas**

**Descrição:** o administrador deve poder anexar evidências visuais à resposta e
consultar anexos enviados pelo usuário.

#### Regras de Negócio

- **Regra:** permitir no máximo 3 anexos por mensagem.
- **Regra:** aceitar somente arquivos PNG (`.png`) e JPG (`.jpg`).
- **Regra:** cada arquivo deve possuir no máximo 10 MB.
- **Validação:** validar quantidade, extensão, MIME type e tamanho antes do
  upload; o servidor deve repetir as validações relevantes.
- **Validação:** a resposta só pode ser persistida após todos os uploads da
  mensagem serem concluídos com sucesso.
- **Exceção:** falha em um upload não pode criar uma mensagem parcial; arquivos
  válidos e texto devem permanecer disponíveis para nova tentativa.
- **Dependência:** fluxo autenticado de URL assinada e armazenamento de arquivos
  de feedback.

#### Regras de UI/UX

- **Interface:** apresentar anexos selecionados com nome, tamanho, miniatura e
  ação de remoção; anexos persistidos devem abrir uma visualização ampliada ou
  recurso equivalente seguro.
- **Feedback:** mostrar progresso individual de upload e erro no arquivo
  específico.
- **Estado vazio:** informar `PNG ou JPG, até 3 arquivos, 10 MB cada` junto ao
  controle.
- **Ação bloqueada:** explicar formato, limite ou tamanho excedido sem remover os
  outros arquivos válidos.
- **Responsividade:** miniaturas devem quebrar linha sem expandir o diálogo
  horizontalmente.
- **Acessibilidade:** controle deve funcionar por teclado e miniaturas devem ter
  descrição derivada do nome do arquivo.

---

### REQ-06 Ciclo de vida aberto e fechado

- [ ] **Ciclo de vida aberto e fechado**

**Descrição:** o administrador deve controlar o estado do relatório diretamente
no diálogo, preservando um ciclo simples e reversível.

#### Regras de Negócio

- **Regra:** todo novo relatório inicia como `Aberto`.
- **Regra:** apenas administradores podem fechar ou reabrir relatórios.
- **Regra:** um relatório só pode ser fechado depois de existir ao menos uma
  resposta administrativa persistida.
- **Regra:** um relatório fechado pode ser reaberto pelo seletor de status, sem
  diálogo adicional.
- **Regra:** fechar ou reabrir não remove mensagens nem anexos.
- **Validação:** o servidor deve rejeitar transição para `Fechado` sem resposta
  administrativa, mesmo que a interface seja contornada.
- **Exceção:** se o estado mudar em outra sessão, apresentar o estado atual e
  solicitar que o administrador revise antes de repetir a ação.
- **Dependência:** status do relatório e existência de resposta administrativa.

#### Regras de UI/UX

- **Interface:** usar seletor de status com somente `Aberto` e `Fechado`.
- **Feedback:** atualizar badge, contadores e tabela após a transição; falha deve
  restaurar o estado confirmado pelo servidor.
- **Estado vazio:** não aplicável; todo relatório possui um estado.
- **Ação bloqueada:** desabilitar `Fechado` enquanto não houver resposta
  administrativa e explicar o motivo abaixo do seletor.
- **Responsividade:** manter o seletor visível no cabeçalho funcional do diálogo.
- **Acessibilidade:** comunicar estado e indisponibilidade por texto, não somente
  por cor.

---

### REQ-07 Notificação do usuário por e-mail

- [ ] **Notificação do usuário por e-mail**

**Descrição:** cada resposta administrativa deve iniciar uma notificação por
e-mail sem tornar a persistência da conversa dependente do provedor de entrega.

#### Regras de Negócio

- **Regra:** persistir a resposta antes de enfileirar o e-mail.
- **Regra:** o e-mail deve conter assunto identificável, trecho curto da
  resposta e CTA `Ver conversa` para a aplicação Web.
- **Regra:** o usuário deve continuar a conversa somente dentro da aplicação; a
  mensagem não deve incentivar resposta direta ao e-mail.
- **Regra:** se uma resposta for enviada junto de uma mudança para `Fechado`, o
  mesmo e-mail deve informar o fechamento.
- **Regra:** mudança isolada de status, reabertura e mensagens do próprio usuário
  não disparam e-mail nesta versão.
- **Validação:** enfileirar no máximo uma notificação para cada resposta
  persistida.
- **Exceção:** falha de entrega não desfaz a resposta nem impede mudança de
  status; o processamento deve aplicar tentativas automáticas.
- **Dependência:** pacote de e-mail, fila assíncrona, e-mail do usuário e URL
  pública da conversa.

#### Regras de UI/UX

- **Interface:** não apresentar controles de entrega de e-mail no compositor.
- **Feedback:** confirmar `Resposta enviada` após persistência; não afirmar que o
  e-mail foi entregue.
- **Estado vazio:** não aplicável.
- **Ação bloqueada:** ausência de e-mail válido deve impedir a resposta e
  apresentar erro operacional claro ao administrador.
- **Responsividade:** não aplicável além do feedback do compositor.
- **Acessibilidade:** confirmação deve ser anunciada por região de status.

---

### REQ-08 Notificação de resposta do usuário no Discord

- [ ] **Notificação de resposta do usuário no Discord**

**Descrição:** cada nova resposta do usuário deve chamar a atenção da equipe no
Discord e direcioná-la ao registro canônico no Studio.

#### Regras de Negócio

- **Regra:** enviar uma notificação para o canal administrativo configurado após
  persistir a resposta do usuário.
- **Regra:** incluir ID do relatório, identificação do usuário, trecho curto da
  resposta, indicação da existência de anexos e link direto para o relatório no
  Studio.
- **Regra:** não publicar o conteúdo integral nem os anexos no Discord.
- **Validação:** uma resposta deve produzir no máximo uma notificação, com
  idempotência em novas tentativas do job.
- **Exceção:** falha do Discord não desfaz a resposta nem altera seu estado de não
  lida no Studio; o processamento deve admitir novas tentativas.
- **Dependência:** evento de resposta do usuário, webhook do Discord, URL do
  Studio e rota capaz de abrir o relatório indicado.

#### Regras de UI/UX

- **Interface:** o link recebido deve abrir o Studio e, após autenticação quando
  necessária, direcionar ao relatório correspondente.
- **Feedback:** se o relatório não estiver mais acessível, a rota deve apresentar
  erro contextual e permitir retorno à listagem.
- **Estado vazio:** não aplicável.
- **Ação bloqueada:** acesso sem permissão deve seguir a autenticação e autorização
  padrão do Studio.
- **Responsividade:** o deep link deve funcionar nas larguras suportadas pelo
  Studio.
- **Acessibilidade:** a tela de destino deve mover o foco para o título do
  diálogo após a abertura.

---

### REQ-09 Confiabilidade, segurança e desempenho

- [ ] **Confiabilidade, segurança e desempenho**

**Descrição:** a experiência deve preservar dados e permissões em carregamentos,
concorrência, falhas de rede e integrações assíncronas.

#### Regras de Negócio

- **Regra:** somente contas administrativas autorizadas podem listar, consultar,
  responder e alterar status.
- **Regra:** nenhuma operação desta versão pode excluir ou arquivar relatórios,
  mensagens ou anexos.
- **Regra:** texto de mensagens deve ser tratado como conteúdo não confiável e
  renderizado sem execução de HTML ou script.
- **Validação:** mutações devem ser idempotentes ou protegidas contra repetição
  causada por duplo clique, timeout ou retry.
- **Validação:** listagem e abertura do diálogo devem alcançar resposta útil em
  até 2 segundos no percentil 95, desconsiderando indisponibilidade externa de
  rede e usando volume esperado do MVP.
- **Exceção:** integrações de e-mail e Discord podem concluir depois da resposta
  da interface e não participam desse limite.
- **Dependência:** autorização do Studio, contratos do Server, persistência no
  Supabase, fila assíncrona e storage autenticado.

#### Regras de UI/UX

- **Interface:** todas as mutações devem possuir estados distintos de repouso,
  carregamento, sucesso e erro.
- **Feedback:** erros devem indicar a ação que falhou e permitir tentativa segura
  sem fechar o diálogo ou descartar dados.
- **Estado vazio:** seguir os estados definidos na listagem e na conversa.
- **Ação bloqueada:** desabilitar somente a ação afetada, preservando navegação e
  leitura sempre que possível.
- **Responsividade:** suportar a faixa de desktop adotada pelo Studio sem corte
  de conteúdo ou ações.
- **Acessibilidade:** atender navegação por teclado, foco visível, contraste AA,
  nomes acessíveis e anúncios de alterações assíncronas relevantes.

---

### REQ-10 Medição do resultado

- [ ] **Medição do resultado**

**Descrição:** o produto deve registrar fatos agregáveis para calcular as metas
da primeira versão sem criar um histórico administrativo de auditoria.

#### Regras de Negócio

- **Regra:** disponibilizar dados ou eventos para relatório criado, primeira
  resposta administrativa, resposta administrativa, resposta do usuário,
  fechamento e reabertura.
- **Regra:** calcular tempo até a primeira resposta a partir da criação do
  relatório e da primeira mensagem administrativa persistida.
- **Regra:** considerar `fechado após interação` apenas quando existir resposta
  administrativa anterior ou concomitante.
- **Validação:** eventos analíticos devem evitar duplicidade por ID estável do
  fato de negócio.
- **Exceção:** falhas de analytics não podem impedir a ação principal.
- **Dependência:** infraestrutura existente de eventos de domínio, Inngest e
  PostHog ou consulta agregada equivalente.

#### Regras de UI/UX

- **Interface:** nenhuma nova tela analítica é exigida nesta versão.
- **Feedback:** instrumentação deve ser invisível ao administrador.
- **Estado vazio:** não aplicável.
- **Ação bloqueada:** analytics nunca bloqueia a ação principal.
- **Responsividade:** não aplicável.
- **Acessibilidade:** não aplicável.

## 5. Fluxo de Usuário (User Flow)

### Fluxo A - Localizar e abrir um relatório

1. O administrador acessa `Feedbacks` no Studio.
2. O sistema apresenta contadores, filtros e a lista paginada, priorizando não
   lidos e atividade recente.
3. O administrador pesquisa ou filtra os relatórios.
4. O sistema valida:
   - **Sucesso:** atualiza a lista e a paginação com os critérios combinados.
   - **Sem resultados:** apresenta estado vazio e ação para limpar filtros.
   - **Falha:** mantém os critérios e oferece nova tentativa.
5. O administrador seleciona `Ver`.
6. O sistema abre o diálogo, carrega o relato e a conversa e marca o relatório
   como lido para o Studio.

### Fluxo B - Responder ao usuário

1. O administrador abre um relatório.
2. O sistema apresenta o relato original, o histórico e o compositor.
3. O administrador escreve entre 1 e 2.000 caracteres e, opcionalmente,
   seleciona até 3 imagens válidas.
4. O sistema valida:
   - **Sucesso:** conclui os uploads, persiste uma única mensagem, atualiza a
     conversa e enfileira o e-mail.
   - **Texto inválido:** indica o problema junto ao campo.
   - **Anexo inválido:** identifica o arquivo e preserva os demais dados.
   - **Falha de upload ou persistência:** mantém texto e anexos para nova
     tentativa.
5. O Studio apresenta `Resposta enviada`.
6. O job de e-mail processa a notificação independentemente da interface.

### Fluxo C - Fechar um relatório

1. O administrador abre um relatório `Aberto`.
2. O sistema verifica se existe resposta administrativa.
3. O administrador tenta selecionar `Fechado`:
   - **Sem resposta administrativa:** a opção permanece desabilitada e o motivo
     é exibido abaixo do seletor.
   - **Com resposta administrativa:** a transição é enviada ao servidor sem
     diálogo adicional.
4. O servidor valida a regra novamente.
5. Em sucesso, o Studio atualiza status, contadores e listagem sem remover o
   histórico.
6. Em falha, o Studio restaura o estado confirmado e permite nova tentativa.

### Fluxo D - Responder e fechar na mesma interação

1. O relatório já possui ao menos uma resposta administrativa persistida.
2. O administrador prepara uma nova resposta e define o estado final como
   `Fechado` na mesma interação suportada pela interface.
3. O sistema persiste a mensagem e a transição de forma consistente.
4. O e-mail contém o trecho da resposta e informa que o relatório foi fechado.
5. Se a mensagem ou a transição falhar, a interface não deve comunicar sucesso
   parcial como conclusão total; deve apresentar o estado efetivamente
   persistido.

### Fluxo E - Reabrir um relatório

1. O administrador abre um relatório `Fechado`.
2. O histórico permanece visível.
3. O administrador seleciona `Aberto` no seletor.
4. O sistema valida:
   - **Sucesso:** reabre o relatório e atualiza contadores e listagem.
   - **Falha:** mantém `Fechado` e oferece nova tentativa.
5. Nenhum diálogo adicional ou e-mail é apresentado.

### Fluxo F - Receber resposta do usuário

1. O usuário responde por meio da experiência externa da aplicação Web.
2. O servidor persiste a mensagem.
3. O relatório passa a `Não lido` para o Studio e sua atividade recente é
   atualizada.
4. O sistema enfileira uma notificação resumida para o Discord.
5. O job valida:
   - **Sucesso:** publica ID, usuário, trecho, indicação de anexos e deep link.
   - **Falha:** tenta novamente sem duplicar a mensagem nem remover o estado de
     não lido.
6. O administrador abre o deep link ou a listagem e continua a conversa no
   Studio.

### Fluxo G - Abrir um deep link do Discord

1. O administrador seleciona o link de um relatório no Discord.
2. O Studio verifica a sessão:
   - **Autenticado e autorizado:** abre o relatório indicado.
   - **Sem sessão:** solicita autenticação e retorna ao relatório após sucesso.
   - **Sem permissão:** apresenta acesso negado.
   - **Relatório indisponível:** informa o erro e oferece retorno à listagem.
3. Ao abrir o relatório, o sistema aplica a regra de leitura administrativa.

## 6. Fora do Escopo (Out of Scope)

- implementar ou redesenhar o diálogo de feedback da aplicação Web;
- excluir ou arquivar relatórios;
- excluir, editar ou ocultar mensagens e anexos já enviados;
- registrar um log separado de auditoria administrativa;
- adicionar estados além de `Aberto` e `Fechado`;
- permitir que o usuário feche ou reabra relatórios;
- responder à conversa diretamente pelo e-mail ou Discord;
- enviar ao Discord o conteúdo integral ou os arquivos anexados;
- enviar e-mail por mudança isolada de status, reabertura ou resposta do usuário;
- criar notas internas invisíveis ao usuário;
- atribuir relatórios a administradores, equipes ou responsáveis;
- adicionar prioridade, SLA, tags, categorias customizáveis ou automações de
  triagem;
- votação pública, roadmap, deduplicação de ideias ou comunidade de feedback;
- exclusão definitiva como mecanismo de retenção ou moderação;
- painel analítico novo no Studio;
- acompanhamento visual de entrega de e-mail ou Discord no MVP.

### 6.1 Decisões descartadas nesta revisão

- **Exclusão definitiva:** removida do produto para preservar o histórico e
  evitar perda irreversível de contexto.
- **Arquivamento:** descartado para o MVP; `Fechado` já atende à organização da
  fila sem introduzir um terceiro conceito.
- **Mais estados:** opções como `Em análise`, `Pendente` e `Aguardando usuário`
  foram substituídas pelo ciclo mínimo `Aberto`/`Fechado`.
- **Diálogo de confirmação para status:** descartado; a proteção ocorre pela
  exigência de resposta administrativa e pela validação do servidor.
- **Auditoria administrativa separada:** descartada; mensagens mantêm autor e
  data, mas não haverá trilha adicional de ações nesta versão.
- **Somente notificação interna:** descartada. Respostas do usuário combinam
  estado de não lido no Studio com aviso resumido no Discord.

## 7. Dependências, Riscos e Hipóteses

### 7.1 Dependências

- o Server deve expor listagem ampliada, detalhe, mensagens, leitura e mudança de
  status com autorização administrativa;
- a experiência Web deve fornecer respostas do usuário e respeitar o bloqueio de
  resposta quando o relatório estiver fechado;
- o armazenamento deve emitir URLs assinadas e preservar vínculo entre anexo e
  mensagem;
- o pacote de e-mail e a fila devem processar notificações com idempotência;
- o webhook do Discord deve estar configurado por ambiente;
- o Studio deve possuir rota endereçável por ID para os deep links.

### 7.2 Riscos

- **Concorrência:** duas sessões administrativas podem responder ou alterar o
  estado simultaneamente. O servidor deve retornar o estado canônico e impedir
  efeitos duplicados.
- **Notificação atrasada:** e-mail ou Discord podem falhar depois da persistência.
  A conversa continua válida; jobs devem aplicar retry e observabilidade técnica.
- **Anexos maliciosos:** extensão isolada não é suficiente. Cliente, servidor e
  storage devem validar tipo, tamanho e autorização de acesso.
- **Badge inconsistente:** leitura mantida somente no cliente pode divergir entre
  sessões. O marcador precisa ser persistente.
- **Deep link quebrado:** autenticação ou roteamento pode perder o destino. O
  retorno pós-login deve preservar o ID solicitado.

### 7.3 Hipóteses restantes

- o volume inicial permite uma única fila administrativa, sem atribuição por
  agente;
- uma resposta administrativa é condição suficiente para permitir fechamento,
  sem exigir aceite explícito do usuário;
- retries e observabilidade técnica existentes são suficientes sem uma tela de
  entrega no Studio;
- a política de retenção atual do StarDust permite manter indefinidamente o
  histórico de feedback enquanto exclusão e arquivamento estiverem fora do
  escopo.

## 8. Referências Internas

- [Milestone 1 — Gerenciador de Relatórios de Feedback no StarDust Studio](https://github.com/JohnPetros/stardust/milestone/1)
- `documentation/features/reporting/feedback-reports-management/specs/feedback-reports-page-spec.md`
- `documentation/features/reporting/feedback-reports-management/specs/list-feedback-reports-endpoint-spec.md`
- `documentation/features/reporting/feedback-reports-management/specs/delete-feedback-report-endpoint-spec.md`
  (legada; deve ser supersedida porque exclusão saiu do produto)
- `documentation/features/reporting/feedback-dialog/specs/feedback-dialog-widget-spec.md`
- `documentation/features/reporting/feedback-dialog/specs/send-feedback-endpoint-spec.md`
- `documentation/features/reporting/feedback-dialog/specs/screenshot-upload-url-spec.md`
- Design Pencil: lista `MVWsz`, relatório aberto `nbV72` e relatório fechado
  `aHFPL`.
