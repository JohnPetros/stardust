---
title: Página de Loja
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/6
last_updated_at: 2026-02-28
---

# PRD — Página de Loja

Disponibiliza para: shop; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

A Página Shop é o espaço em que usuários logados ativos personalizam sua
experiência na plataforma por meio da aquisição e seleção de itens cosméticos
(insígnias, foguetes e avatares) usando StarCoins.

O problema que ela resolve é a baixa motivação de longo prazo quando o usuário
não percebe progressão visual e valor no acúmulo de moedas. Ao permitir compra
e troca rápida de itens, a funcionalidade aumenta o senso de progresso,
identidade e retorno recorrente ao produto.

O objetivo principal desta versão é **aumentar retenção** por personalização. A
métrica principal de acompanhamento é **uso de StarCoins na Shop** (gasto total
e gasto médio por usuário ativo). Como a página já está implementada, este PRD
formaliza o comportamento funcional atual para alinhamento entre produto,
design e desenvolvimento.

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/6 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

## 3. Público-alvo

🚧 Em construção — público-alvo, contexto de uso e Jobs to Be Done não estão explicitados no documento legado.

## 4. Objetivos e Métricas de Sucesso

🚧 Em construção — objetivos e métricas estruturados não estão registrados no documento legado.

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Conteúdo legado não informa uma meta aprovada. | A meta precisa ser confirmada antes de usar o PRD como autoridade de produto. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Capacidade documentada | Preservar o comportamento descrito no conteúdo legado até validação canônica. |

#### RP-01 — Catálogo de Insígnias

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Catálogo de Insígnias.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Exibir todas as insígnias disponíveis para compra por usuário
autenticado, com status de aquisição e ação correspondente.

##### Regras de Negócio
- **Listagem completa:** O sistema deve listar todas as insígnias disponíveis na
  loja para o usuário autenticado.
- **Dados mínimos por item:** Cada insígnia deve exibir nome, imagem, preço e
  descrição funcional.
- **Status de aquisição:** O sistema deve identificar se a insígnia já pertence
  ao usuário para alterar a ação disponível.
- **Compra com moeda virtual:** A compra deve consumir StarCoins quando o
  usuário tiver saldo suficiente.

##### Regras de Experiência

- **Elemento Visual:** Cada insígnia deve apresentar card com imagem, nome,
  preço e ação principal.
- **Responsividade:** A grade de itens deve funcionar em mobile e desktop sem
  perda de legibilidade.
- **Acessibilidade:** Imagens devem ter texto alternativo e ações devem ser
  acionáveis por teclado.
- **Feedback:** Exibir confirmação de compra bem-sucedida e aviso claro quando
  não houver saldo suficiente.
- **Performance:** A listagem deve carregar de forma fluida na entrada da tela.
- **Segurança:** Somente usuário autenticado pode concluir compra.
- **Confiabilidade:** Em falha de carregamento, exibir mensagem de erro e
  permitir nova tentativa.
- **Compatibilidade:** Comportamento consistente nos navegadores modernos de
  desktop e mobile.

---

#### RP-02 — Listagem de Foguetes com Busca, Ordenação e Paginação

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Listagem de Foguetes com Busca, Ordenação e Paginação.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Permitir descoberta de foguetes por pesquisa textual, ordenação
por preço e navegação paginada.

##### Regras de Negócio
- **Busca textual:** O usuário deve conseguir filtrar foguetes por termo de
  pesquisa.
- **Ordenação por preço:** O usuário deve alternar entre "Menor preço" e
  "Maior preço".
- **Paginação:** A listagem deve ser paginada para limitar volume por tela.
- **Persistência de critérios:** Ao mudar busca ou ordenação, o sistema deve
  reiniciar a paginação para a primeira página.

##### Regras de Experiência

- **Elemento Visual:** A seção de foguetes deve conter campo de busca,
  seletor de ordenação e paginação.
- **Responsividade:** A grade de foguetes deve se adaptar a diferentes larguras
  de tela.
- **Acessibilidade:** Busca, seletor e paginação devem ter foco visível e uso
  via teclado.
- **Feedback:** Mudanças de filtro devem atualizar a lista sem ambiguidade de
  estado.
- **Performance:** A atualização de lista deve manter tempo de resposta
  percebido adequado.
- **Segurança:** Dados de listagem devem respeitar contexto do usuário
  autenticado quando aplicável.
- **Confiabilidade:** Em lista vazia, exibir estado vazio sem quebrar a
  navegação.
- **Compatibilidade:** Busca, ordenação e paginação devem funcionar em
  navegadores modernos.

---

#### RP-03 — Listagem de Avatares com Busca, Ordenação e Paginação

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Listagem de Avatares com Busca, Ordenação e Paginação.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Permitir descoberta de avatares por pesquisa textual, ordenação
por preço e navegação paginada.

##### Regras de Negócio
- **Busca textual:** O usuário deve conseguir filtrar avatares por termo de
  pesquisa.
- **Ordenação por preço:** O usuário deve alternar entre "Menor preço" e
  "Maior preço".
- **Paginação:** A listagem de avatares deve ser paginada.
- **Persistência de critérios:** Ao alterar busca ou ordenação, a paginação deve
  retornar ao início.

##### Regras de Experiência

- **Elemento Visual:** A seção de avatares deve conter busca, ordenação e
  paginação.
- **Responsividade:** Os cards devem manter leitura e ação clara em mobile e
  desktop.
- **Acessibilidade:** Controles de filtro e ação devem ser navegáveis por
  teclado.
- **Feedback:** Estado do item (comprável, adquirido, selecionado) deve ser
  visualmente claro.
- **Performance:** Trocas de página e filtros devem responder sem travamentos
  perceptíveis.
- **Segurança:** A compra deve ocorrer apenas em sessão autenticada.
- **Confiabilidade:** Em erro de consulta, exibir fallback e permitir recarregar.
- **Compatibilidade:** Experiência consistente entre navegadores suportados.

---

#### RP-04 — Compra e Seleção de Itens da Loja

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Compra e Seleção de Itens da Loja.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Permitir que o usuário compre itens com StarCoins e selecione
itens já adquiridos para personalização ativa.

##### Regras de Negócio
- **Compra de foguete/avatar:** Se o item ainda não for adquirido e houver saldo
  suficiente, o sistema deve concluir a compra, debitar StarCoins e aplicar o
  item como selecionado.
- **Seleção sem nova compra:** Se foguete/avatar já estiver adquirido, o sistema
  deve apenas selecionar o item, sem novo débito.
- **Compra de insígnia:** A compra deve falhar quando a insígnia já tiver sido
  adquirida ou quando não houver saldo suficiente.
- **Bloqueio por saldo insuficiente:** Itens sem saldo suficiente não devem ser
  concluídos como compra.
- **Atualização de perfil:** Após compra ou seleção válida, o estado do usuário
  deve ser atualizado para refletir saldo e inventário atual.

##### Regras de Experiência

- **Elemento Visual:** O botão de ação deve refletir o estado do item com
  rótulos "Comprar", "Selecionar", "Selecionado" ou "Adquirido".
- **Responsividade:** A ação principal deve permanecer visível e acionável em
  todas as resoluções suportadas.
- **Acessibilidade:** Botões e diálogos devem estar acessíveis via teclado e com
  rótulos compreensíveis.
- **Feedback:** Mostrar confirmação de sucesso para compra e mensagens de erro
  para saldo insuficiente/regra violada.
- **Performance:** O tempo de resposta entre clique e retorno visual deve ser
  curto e previsível.
- **Segurança:** A operação de compra deve exigir autenticação e validação no
  backend.
- **Confiabilidade:** Em falha de integração, manter estado anterior e informar o
  usuário.
- **Compatibilidade:** Fluxo de compra/seleção deve ser consistente em
  navegadores modernos.

---

#### RP-05 — Feedback Operacional e Estados de Carregamento

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Feedback Operacional e Estados de Carregamento.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Garantir clareza de estados para evitar ambiguidade durante
consultas, compra e seleção de itens.

##### Regras de Negócio
- **Estado de carregamento:** Toda ação de compra/seleção deve ter estado de
  processamento para evitar ações duplicadas.
- **Mensagens de falha:** Erros de negócio devem ser comunicados com mensagem
  compreensível para o usuário.
- **Sincronização de estado:** Após fechamento de confirmação de compra, o
  sistema deve sincronizar dados de perfil e inventário.

##### Regras de Experiência

- **Elemento Visual:** Exibir indicadores claros de carregamento e conclusão de
  ação.
- **Responsividade:** Diálogos e alertas devem abrir corretamente em mobile e
  desktop.
- **Acessibilidade:** Alertas e diálogos devem ser compreensíveis para leitor de
  tela e navegação por teclado.
- **Feedback:** Diferenciar claramente sucesso de compra, seleção e impedimento
  por regra de negócio.
- **Performance:** Alertas devem aparecer imediatamente após o resultado da ação.
- **Segurança:** Não expor detalhes internos de erro técnico ao usuário final.
- **Confiabilidade:** Em inconsistência de estado, priorizar recarregar dados do
  usuário.
- **Compatibilidade:** Comportamento consistente dos alertas em navegadores
  suportados.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| shop | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

#### JN-01 — Jornada preservada do documento legado

### 3. Fluxo de Usuário (User Flow)

**Nome do fluxo:** Explorar catálogo e filtrar itens.

1. O usuário acessa a tela Shop.
2. O usuário visualiza seções de insígnias, foguetes e avatares.
3. O usuário realiza busca e ordenação por preço em foguetes/avatares.
4. O sistema valida os critérios informados:
   - **Sucesso:** Lista é atualizada com paginação correspondente.
   - **Falha:** Sistema apresenta erro de carregamento e mantém estado estável.

**Nome do fluxo:** Comprar foguete ou avatar.

1. O usuário acessa a seção de foguetes ou avatares.
2. O usuário realiza a ação de compra em um item não adquirido.
3. O sistema valida saldo e disponibilidade do item:
   - **Sucesso:** Debita StarCoins, adiciona item ao inventário, seleciona o item
     e exibe confirmação.
   - **Falha:** Informa saldo insuficiente ou erro de negócio, sem alterar saldo
     nem inventário.

**Nome do fluxo:** Selecionar item já adquirido.

1. O usuário acessa item já adquirido (foguete/avatar).
2. O usuário aciona "Selecionar".
3. O sistema valida se o item pertence ao inventário:
   - **Sucesso:** Item passa a ser o selecionado ativo do usuário.
   - **Falha:** Operação é cancelada e o usuário recebe mensagem de erro.

**Nome do fluxo:** Comprar insígnia.

1. O usuário acessa a seção de insígnias.
2. O usuário aciona "Comprar" em uma insígnia.
3. O sistema valida aquisição prévia e saldo:
   - **Sucesso:** Insígnia é adicionada ao perfil e o saldo é atualizado.
   - **Falha:** Compra é recusada com feedback claro (insígnia já adquirida ou
     saldo insuficiente).

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | CRUD administrativo de itens da loja (criar, editar, remover) em painel |
| Escopo | Criação de novas categorias de itens além de insígnias, foguetes e avatares. |
| Escopo | Alteração das regras globais de economia de StarCoins fora do contexto de |
| Escopo | Versão mobile nativa (app) ou funcionalidades fora da Web responsiva. |
| Escopo | Reformulação de onboarding de itens padrão de novos usuários. |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
