# PRD — Gerenciamento de usuários

- **Módulo:** `profile`
- **Milestone:** [#5 — Gerenciamento de usuários](https://github.com/JohnPetros/stardust/milestone/5)
- **Status:** open
- **Atualizado em:** 2026-02-28T11:26:41Z

## Definição do produto

Aqui está o **doc completo** já com a funcionalidade de **Exportar base de usuários** adicionada (e removida do “Fora do Escopo”).

---

### 1. Visão Geral

A funcionalidade de Gerenciamento de Usuários no Studio permite que equipes internas consultem, filtrem, ordenem e naveguem pela base de usuários da plataforma em uma única página operacional.

O problema que ela resolve e a dificuldade de localizar rapidamente usuários relevantes para suporte, acompanhamento de progresso e análise operacional, especialmente quando a base cresce e exige múltiplos critérios de busca.

O objetivo principal desta versão e padronizar a operação interna com uma listagem confiável e rastreável, reduzindo o tempo para localizar usuários por meio de busca, filtros, ordenação e paginação, com prioridade alta no roadmap.

---

### 2. Requisitos

#### Listagem consolidada de usuários

**Descrição:** Exibir os usuários da plataforma em tabela com dados essenciais para análise operacional.

##### Regras de Negócio

* **Fonte da listagem:** O sistema deve carregar a listagem de usuários a partir do endpoint de usuários com parâmetros de consulta.
* **Campos obrigatórios na listagem:** Cada linha deve apresentar nome, nível, XP semanal, quantidade de estrelas desbloqueadas, quantidade de conquistas desbloqueadas, quantidade de desafios completados, status de completude do espaço, insígnias, data de criação e ação para abrir perfil.
* **Estado sem resultados:** Quando não houver itens retornados para os critérios aplicados, o sistema deve apresentar estado vazio informando que nenhum usuário foi encontrado.
* **Ação de consulta externa:** Quando o usuário listado possuir identificador de perfil público, o sistema deve permitir abrir o perfil no aplicativo principal em nova navegação.

##### Regras de UI/UX

* **Tabela de usuários:** Deve apresentar linhas com dados legíveis e permitir inspeção rápida por coluna.
* **Responsividade:** Em telas menores, a área deve manter usabilidade com rolagem e preservação do conteúdo principal da tabela.
* **Acessibilidade:** Elementos interativos da tabela devem ser navegáveis por teclado e possuir rótulos compreensíveis.
* **Feedback:** Exibir estado de carregamento enquanto a listagem estiver em processamento e mensagem clara no estado vazio.
* **Performance:** Carregamento da listagem deve ocorrer de forma eficiente para não comprometer a análise operacional.
* **Segurança:** A consulta deve respeitar autenticação e autorização do ambiente administrativo.
* **Confiabilidade:** Em falhas de carregamento, a funcionalidade deve manter estado consistente para nova tentativa de consulta.
* **Compatibilidade:** Deve funcionar nos navegadores suportados pelo Studio.

---

#### Busca por nome com refinamento progressivo

**Descrição:** Permitir localizar usuários pelo nome para reduzir tempo de descoberta de contas específicas.

##### Regras de Negócio

* **Critério de busca:** O sistema deve aceitar texto de busca por nome de usuário.
* **Aplicação da busca:** A busca deve atualizar a listagem usando o termo informado e reiniciar a paginação para a primeira página.
* **Refinamento progressivo:** A consulta deve considerar intervalo de digitação para evitar excesso de requisições em sequência.

##### Regras de UI/UX

* **Campo de busca:** Deve estar visível no topo dos filtros e indicar claramente que busca por nome.
* **Responsividade:** O campo deve permanecer utilizável em desktop e mobile.
* **Acessibilidade:** Deve permitir foco por teclado e leitura de placeholder pelo leitor de tela.
* **Feedback:** Durante nova busca, apresentar atualização da listagem conforme o estado de carregamento.
* **Performance:** Evitar disparos excessivos de requisição durante digitação contínua.
* **Segurança:** O termo de busca deve ser tratado de forma segura no backend.
* **Confiabilidade:** Em falha de consulta, manter termo digitado para nova tentativa.
* **Compatibilidade:** Comportamento consistente nos navegadores suportados.

---

#### Filtros de status, insígnias e período de criação

**Descrição:** Oferecer filtros combináveis para segmentação de usuários por progresso e características.

##### Regras de Negócio

* **Filtro de status do espaço:** Deve permitir os estados Todos, Completo e Em progresso.
* **Filtro de insígnias:** Deve permitir seleção de múltiplas insígnias disponíveis para refinar a listagem.
* **Filtro por período de criação:** Deve permitir filtrar usuários por data inicial e final de criação.
* **Combinação de filtros:** O sistema deve aplicar filtros em conjunto e reiniciar a paginação ao alterar qualquer filtro.

##### Regras de UI/UX

* **Controles de filtro:** Devem estar agrupados e identificados para facilitar a combinação de critérios.
* **Responsividade:** Os filtros devem reorganizar em múltiplas linhas sem perda de funcionalidade.
* **Acessibilidade:** Seletores e calendário devem ser operáveis por teclado.
* **Feedback:** Mudanças de filtro devem refletir rapidamente na listagem e no total de resultados.
* **Performance:** Aplicação de filtros não deve degradar a experiência de navegação.
* **Segurança:** Filtros devem ser validados e normalizados no backend.
* **Confiabilidade:** Em seleção inválida de período, impedir resultado inconsistente.
* **Compatibilidade:** Comportamento estável nos navegadores suportados pelo Studio.

---

#### Ordenação por métricas de progresso

**Descrição:** Permitir ordenação da listagem por colunas de progresso para análise comparativa rápida.

##### Regras de Negócio

* **Colunas ordenáveis:** O sistema deve permitir ordenação por nível, XP semanal, estrelas desbloqueadas, conquistas desbloqueadas e desafios completados.
* **Estados de ordenação:** Cada coluna deve suportar estados de ordenação neutro, ascendente e descendente.
* **Persistência de critério:** O critério de ordenação aplicado deve refletir na consulta da listagem e permanecer consistente durante navegação entre páginas.
* **Mudança de ordenação:** Ao alterar a ordenação, a paginação deve retornar para a primeira página.

##### Regras de UI/UX

* **Indicador de ordenação:** Cabeçalhos ordenáveis devem informar visualmente o estado atual.
* **Responsividade:** Interação de ordenação deve permanecer acionável em diferentes tamanhos de tela.
* **Acessibilidade:** Cabeçalhos ordenáveis devem ter indicação semântica para tecnologia assistiva.
* **Feedback:** A atualização da ordem deve ser percebida na renderização dos resultados.
* **Performance:** Troca de ordenação deve ter tempo de resposta adequado para fluxo de análise.
* **Segurança:** Critérios de ordenação devem ser restritos a campos permitidos.
* **Confiabilidade:** Evitar inconsistência de ordenação entre frontend e backend.
* **Compatibilidade:** Comportamento uniforme em navegadores suportados.

---

#### Paginação e controle de volume exibido

**Descrição:** Permitir navegação por páginas e ajuste de itens por página para balancear leitura e desempenho.

##### Regras de Negócio

* **Navegação paginada:** O sistema deve permitir avançar, voltar e selecionar página específica.
* **Itens por página:** O sistema deve permitir alterar quantidade de itens exibidos por página.
* **Recalculo de páginas:** O total de páginas deve ser recalculado com base no total de itens e no limite por página.
* **Reset de contexto:** Ao alterar itens por página, a paginação deve retornar para a primeira página.

##### Regras de UI/UX

* **Componente de paginação:** Deve exibir página atual, total de páginas e total de itens.
* **Responsividade:** Controles de paginação devem permanecer acessíveis em diferentes larguras.
* **Acessibilidade:** Botões e seletores de paginação devem ser navegáveis por teclado.
* **Feedback:** Mudança de página deve atualizar dados e manter visibilidade do estado atual.
* **Performance:** Troca de página deve ter resposta estável para uso contínuo.
* **Segurança:** Parâmetros de página e limite devem ser validados para evitar valores indevidos.
* **Confiabilidade:** Não permitir navegação para páginas fora dos limites válidos.
* **Compatibilidade:** Funcionar de forma consistente nos navegadores suportados.

---

#### Exportação da base de usuários (via botão na página de Usuários)

**Descrição:** Permitir que equipes internas exportem a listagem de usuários para um arquivo (ex: CSV) diretamente pela página de Usuários, respeitando os filtros, busca, ordenação e período aplicados na tela.

##### Regras de Negócio

* **Ação de exportação:** O sistema deve disponibilizar um botão “Exportar” no topo da página de Usuários.
* **Escopo do export:** O arquivo exportado deve refletir exatamente os critérios ativos na tela (busca por nome, filtros de status/insígnias/período e ordenação).
* **Fonte dos dados:** A exportação deve ser gerada a partir do backend via endpoint dedicado (ex: `GET /admin/users/export`) usando os mesmos parâmetros de consulta da listagem (com validação server-side).
* **Formato do arquivo:** O sistema deve exportar em CSV (UTF-8) com cabeçalhos.
* **Campos exportados:** O arquivo deve conter as mesmas colunas essenciais exibidas na tabela: nome, nível, XP semanal, estrelas desbloqueadas, conquistas desbloqueadas, desafios completados, status de completude do espaço, insígnias, data de criação e identificadores necessários para rastreio interno (ex: `userId`).
* **Volume:** Para evitar travar o browser, o backend deve gerar o arquivo de forma eficiente. Se houver limites (ex: máximo de linhas), o sistema deve aplicar limite explícito e comunicar no retorno, ou gerar export assíncrono (job) e disponibilizar o arquivo quando estiver pronto.
* **Segurança:** A exportação deve respeitar autenticação e autorização do ambiente administrativo.
* **Auditoria (recomendado):** Registrar evento de exportação (quem exportou, quando, filtros usados) para rastreabilidade.

##### Regras de UI/UX

* **Posicionamento:** O botão “Exportar” deve ficar no header da página, próximo aos filtros/ações principais.
* **Feedback de carregamento:** Ao clicar, o botão deve indicar estado de processamento (ex: “Exportando…”), evitando cliques repetidos.
* **Sucesso:** Ao concluir, iniciar download automaticamente e exibir confirmação discreta (toast).
* **Falha:** Exibir mensagem clara e permitir nova tentativa sem perder os filtros/busca atuais.
* **Acessibilidade:** Botão deve ser navegável por teclado e possuir rótulo/aria-label descritivo.

---

### 3. Fluxo de Usuário (User Flow)

**Nome do fluxo:** Localizar usuário por busca e filtros para ação operacional.

1. O usuário acessa a página de Usuários no Studio.
2. O usuário digita um nome no campo de busca e aplica filtros de status, insígnias e período de criação.
3. O sistema valida os critérios informados:

   * **Sucesso:** Atualiza a listagem com os usuários que correspondem aos critérios e reposiciona para a primeira página.
   * **Falha:** Mantém os critérios preenchidos e apresenta estado de erro para nova tentativa.

**Nome do fluxo:** Ordenar resultados para análise comparativa.

1. O usuário acessa a tabela de usuários já carregada.
2. O usuário aciona a ordenação em uma coluna de métrica de progresso.
3. O sistema valida o critério de ordenação:

   * **Sucesso:** Recarrega a listagem com a nova ordem e exibe os resultados ordenados.
   * **Falha:** Mantém a ordenação anterior e sinaliza indisponibilidade momentânea da consulta.

**Nome do fluxo:** Navegar por páginas e abrir perfil de usuário.

1. O usuário acessa os controles de paginação ao final da listagem.
2. O usuário altera a página ou o total de itens por página e seleciona um usuário para abrir perfil externo.
3. O sistema valida paginação e disponibilidade de perfil:

   * **Sucesso:** Atualiza a listagem conforme a navegação e abre o perfil público do usuário selecionado.
   * **Falha:** Impede navegação inválida e mantém o usuário na última página válida com feedback.

**Nome do fluxo:** Exportar usuários com critérios aplicados.

1. O usuário acessa a página de Usuários no Studio e aplica busca, filtros e/ou ordenação.
2. O usuário clica no botão “Exportar”.
3. O sistema valida permissões e critérios:

   * **Sucesso:** Gera o arquivo (CSV) com os mesmos critérios aplicados e inicia o download, exibindo confirmação.
   * **Falha:** Exibe erro, mantém os critérios aplicados e permite tentar novamente.

---

### 4. Fora do Escopo (Out of Scope)

* Criação manual de usuários no Studio.
* Edição de dados cadastrais de usuários diretamente na listagem.
* Bloqueio, suspensão ou exclusão de contas de usuário.
* Gestão completa de permissões e papéis administrativos.
* Novas integrações além do endpoint atual de listagem de usuários.
