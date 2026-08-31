# PRD — Página de Perfil

- **Módulo:** `profile`
- **Milestone:** [#28 — Página de Perfil](https://github.com/JohnPetros/stardust/milestone/28)
- **Status:** open
- **Atualizado em:** 2026-04-18T13:55:38Z

## Definição do produto

### 1. Visão Geral

A Página de Perfil centraliza a visualização das informações públicas e operacionais de um usuário dentro da plataforma StarDust.

- Exibe identidade da conta, progresso geral, streak, conquistas e histórico de criações.
- Resolve a necessidade de acompanhar a evolução do usuário em um único lugar.
- Entrega contexto rápido sobre progresso, produção e marcos já alcançados.

---

### 2. Requisitos

#### REQ-01 Acesso ao Perfil por Slug

- [x] **Acesso ao Perfil por Slug**

**Descrição:** Permitir que um usuário autenticado acesse a página de perfil de outro usuário a partir do `slug` da conta.

##### Regras de Negócio

- **Autenticação obrigatória:** o acesso à página de perfil exige usuário autenticado.
- **Identificação do perfil:** o perfil deve ser carregado a partir do `userSlug` informado na rota.
- **Perfil inexistente:** quando o `slug` não corresponder a um usuário válido, o sistema deve retornar `404`.

##### Regras de UI/UX (se houver)

- **Carregamento inicial:** a página deve abrir o perfil correspondente ao `slug` acessado.
- **Confiabilidade:** em caso de perfil inexistente, o usuário não deve permanecer em uma página com dados vazios ou inconsistentes.

#### REQ-02 Resumo da Conta

- [x] **Resumo da Conta**

**Descrição:** Exibir as principais informações do dono do perfil em um bloco de cabeçalho.

##### Regras de Negócio

- **Identidade da conta:** o sistema deve exibir nome, avatar, nível, XP e data de entrada do usuário.
- **Adornos da conta:** o sistema deve exibir os adornos associados ao usuário, incluindo tier e foguete.
- **Dono da conta:** o sistema deve identificar se o visitante autenticado está acessando o próprio perfil.
- **Ações exclusivas do dono:** apenas o dono do perfil pode acessar os atalhos de configurações e snippets de código.

##### Regras de UI/UX (se houver)

- **Estados de exibição:** os atalhos exclusivos do dono não devem aparecer para visitantes de outros perfis.
- **Feedback de navegação:** os atalhos do dono devem levar diretamente para suas respectivas páginas.

#### REQ-03 Indicadores Gerais de Progresso

- [x] **Indicadores Gerais de Progresso**

**Descrição:** Consolidar os principais indicadores acumulados do dono do perfil.

##### Regras de Negócio

- **Estrelas completadas:** exibir a quantidade de estrelas desbloqueadas ou concluídas pelo usuário.
- **Planetas concluídos:** exibir a quantidade de planetas concluídos pelo usuário.
- **Conquistas adquiridas:** exibir a quantidade total de conquistas desbloqueadas pelo usuário.
- **Streak:** exibir a ofensiva atual do usuário com base no status semanal disponível.

##### Regras de UI/UX (se houver)

- **Leitura rápida:** os indicadores devem permanecer visíveis na área principal do perfil.
- **Confiabilidade:** os totais devem refletir o estado atual do dono do perfil.

#### REQ-04 Grafico de Desafios Concluidos

- [x] **Grafico de Desafios Concluidos**

**Descrição:** Exibir o consolidado de desafios concluídos do dono do perfil por nível de dificuldade.

##### Regras de Negócio

- **Segmentação por dificuldade:** o sistema deve separar os resultados em fácil, médio e difícil.
- **Valores absolutos e total:** o sistema deve informar quantidade por nível e total consolidado.
- **Origem dos dados:** assunção validada nesta auditoria: o gráfico deve representar os dados do dono do perfil visitado, não do visitante autenticado.

##### Regras de UI/UX (se houver)

- **Legibilidade:** o usuário deve conseguir identificar rapidamente os três níveis e seus respectivos totais.
- **Confiabilidade:** o gráfico não deve misturar dados de usuários diferentes.

#### REQ-05 Lista de Conquistas Desbloqueadas

- [x] **Lista de Conquistas Desbloqueadas**

**Descrição:** Exibir as conquistas já desbloqueadas pelo dono do perfil.

##### Regras de Negócio

- **Origem da lista:** a listagem deve considerar apenas conquistas desbloqueadas pelo dono do perfil.
- **Dados da conquista:** cada item deve apresentar, no mínimo, identificação da conquista, nome, descrição, ícone e recompensa.
- **Estado vazio:** quando o usuário não possuir conquistas desbloqueadas, o sistema deve exibir uma mensagem de lista vazia.

##### Regras de UI/UX (se houver)

- **Rolagem da lista:** a área de conquistas deve suportar navegação em listas extensas.
- **Feedback vazio:** o usuário deve receber uma mensagem clara quando não houver itens para exibir.

#### REQ-06 Historico de Criacoes do Usuario

- [x] **Historico de Criacoes do Usuario**

**Descrição:** Exibir as criações publicadas pelo dono do perfil em abas separadas para desafios e soluções.

##### Regras de Negócio

- **Abas de conteúdo:** o sistema deve disponibilizar as abas `Desafios` e `Soluções`.
- **Escopo dos desafios:** a aba de desafios deve listar apenas desafios criados pelo dono do perfil.
- **Escopo das soluções:** a aba de soluções deve listar apenas soluções criadas pelo dono do perfil.
- **Ordenação em desafios:** a aba `Desafios` deve permitir ordenação por mais recentes e mais votados.
- **Ordenação em soluções:** a aba `Soluções` deve permitir ordenação por mais recentes, mais votados e mais visualizados.
- **Metadados de desafios:** cada desafio deve exibir título, data relativa de publicação e total de votos.
- **Metadados de soluções:** cada solução deve exibir título, data relativa de publicação, total de votos e total de visualizações.
- **Paginação incremental:** o sistema deve permitir carregar mais itens até o fim da lista.
- **Estado vazio:** quando não houver itens em uma aba, o sistema deve exibir uma mensagem específica para aquele tipo de conteúdo.

##### Regras de UI/UX (se houver)

- **Troca de abas:** o usuário deve conseguir alternar entre `Desafios` e `Soluções` sem sair da página.
- **Feedback de carregamento:** a listagem deve exibir estado de carregamento durante a busca dos dados.
- **Feedback vazio:** cada aba deve informar claramente quando não houver conteúdo.
- **Navegação por item:** cada linha da lista deve levar para o conteúdo correspondente.

---

### 3. Fluxo de Usuário (User Flow)

**Visualizar o próprio perfil:** acesso do usuário autenticado ao seu próprio perfil.

1. O usuário acessa `/profile/[userSlug]` com o `slug` da própria conta.
2. O sistema valida o `slug` e busca os dados do perfil.
3. O sistema valida a existência do perfil:
   - **Sucesso:** exibe cabeçalho, indicadores, streak, gráfico, conquistas e histórico de criações.
   - **Falha:** retorna `404`.
4. O sistema identifica que o visitante é o dono do perfil.
5. O usuário pode acessar os atalhos de `Configurações` e `Snippets`.

**Visualizar o perfil de outro usuário:** acesso do usuário autenticado ao perfil de terceiros.

1. O usuário acessa `/profile/[userSlug]` com o `slug` de outra conta.
2. O sistema valida o `slug` e busca os dados do dono do perfil.
3. O sistema valida a existência do perfil:
   - **Sucesso:** exibe os dados do dono do perfil visitado.
   - **Falha:** retorna `404`.
4. O sistema identifica que o visitante não é o dono da conta.
5. O sistema oculta os atalhos exclusivos do dono.

**Navegar pelo histórico de criações:** exploração das abas e ordenações disponíveis.

1. O usuário acessa a seção de histórico de criações.
2. O usuário seleciona a aba `Desafios` ou `Soluções`.
3. O usuário aplica uma opção de ordenação disponível para a aba atual.
4. O sistema busca os itens correspondentes e valida se há resultados:
   - **Sucesso:** exibe a lista ordenada com os metadados de cada item.
   - **Falha:** exibe o estado vazio correspondente.
5. O usuário aciona `Mostrar mais` para continuar a navegação quando houver novas páginas.

---

### 4. Fora do Escopo (Out of Scope)

- Edição direta dos dados da conta dentro da página principal de perfil.
- Publicação de novos desafios a partir da própria página de perfil.
- Perfis privados e retorno `404` para acesso restrito.
- Ações sociais no perfil, como seguir, compartilhar ou comparar usuários. `🚧 Em construção`

#### Descartado durante a implementação _(somente Modo Retrospectivo)_

- **Nenhum item descartado confirmado:** a auditoria da implementação e as respostas fornecidas não confirmaram requisitos removidos ou adiados de forma explícita.
