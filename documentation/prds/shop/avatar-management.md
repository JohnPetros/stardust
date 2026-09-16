---
title: Gestão de Avatares
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/7
last_updated_at: 2026-02-23
---

# PRD — Gestão de Avatares

Disponibiliza para: shop; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

A funcionalidade de Gestão de Avatares no Studio permite que administradores
listem, criem, editem e removam avatares da loja em um único fluxo
operacional.

Ela resolve o problema de manutenção manual e dispersa do catálogo de avatares,
que aumenta risco de inconsistência entre dados de item (nome, preço, flags de
padrão) e mídia associada.

O objetivo principal desta entrega é **eficiência operacional** para o time
administrativo. Como este fluxo já está implementado, este PRD documenta o
comportamento atual para padronizar entendimento entre produto, design e
desenvolvimento. A métrica de sucesso fica registrada sem meta numérica rígida,
com foco qualitativo em redução de fricção e erros de operação no dia a dia.

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/7 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

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

#### RP-01 — Listagem e Consulta de Avatares

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Listagem e Consulta de Avatares.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Exibir catálogo administrativo de avatares com busca, ordenação
por preço e paginação.

##### Regras de Negócio
- **Listagem paginada:** O sistema deve listar avatares com controle de página e
  quantidade de itens por página.
- **Busca textual:** O administrador deve conseguir filtrar avatares por nome.
- **Ordenação por preço:** Deve ser possível alternar entre ordem crescente e
  decrescente de preço.
- **Contexto persistido na URL:** Busca, ordenação, página e limite por página
  devem permanecer sincronizados nos parâmetros de consulta da rota.
- **Estado vazio:** Quando não houver resultados para o filtro aplicado, o
  sistema deve exibir estado vazio explícito.

##### Regras de Experiência

- **Elemento Visual:** A tabela deve exibir colunas de nome, imagem, preço,
  adquirido por padrão, selecionado por padrão e ações.
  viewport do Studio.
- **Acessibilidade:** Campo de busca, ordenação, paginação e ações devem ser
  navegáveis por teclado.
- **Feedback:** Durante carregamento, deve exibir estado visual de skeleton da
  tabela.
- **Performance:** Mudanças de filtro e paginação devem responder de forma
  fluida para uso administrativo contínuo.
- **Segurança:** A visualização no Studio deve respeitar autenticação de sessão
  administrativa.
- **Confiabilidade:** Em erro de consulta, o sistema deve preservar estado
  atual e informar falha de forma compreensível.
- **Compatibilidade:** A experiência deve ser consistente nos navegadores
  suportados pelo Studio.

---

#### RP-02 — Criação de Avatar

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Criação de Avatar.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Permitir cadastro de novos avatares para a loja com metadados e
imagem.

##### Regras de Negócio
- **Campos obrigatórios:** A criação deve exigir nome, imagem e preço.
- **Validação de nome:** O nome deve respeitar validação mínima de conteúdo
  textual (mínimo de 3 caracteres).
- **Validação de preço:** O preço deve ser numérico e maior ou igual a zero.
- **Flags de comportamento padrão:** Deve ser possível marcar avatar como
  adquirido por padrão e/ou selecionado por padrão no momento de criação.
- **Consistência de seleção padrão:** Ao criar avatar marcado como selecionado
  por padrão, o sistema deve garantir unicidade do selecionado padrão no
  catálogo.
- **Atualização de listagem:** Após criação bem-sucedida, a listagem deve ser
  atualizada.

##### Regras de Experiência

- **Elemento Visual:** O formulário deve ser aberto em diálogo com campos de
  nome, imagem, preço e checkboxes de comportamento padrão.
  tamanhos de tela do Studio.
- **Acessibilidade:** O formulário deve permitir preenchimento e envio completo
  por teclado.
- **Feedback:** Deve haver indicação de envio em andamento e confirmação de
  sucesso/erro após a tentativa.
- **Performance:** O envio deve ter resposta compatível com fluxo operacional de
  painel administrativo.
- **Segurança:** A operação de criação deve exigir autenticação e autorização de
  administrador no backend.
- **Confiabilidade:** Em falha de criação, o sistema deve evitar resíduo de
  mídia não utilizada.
- **Compatibilidade:** O cadastro deve funcionar de forma estável nos navegadores
  suportados.

---

#### RP-03 — Edição de Avatar

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Edição de Avatar.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Permitir atualização de dados de avatares já existentes com
carregamento de valores atuais no formulário.

##### Regras de Negócio
- **Pré-preenchimento:** Ao editar, o formulário deve carregar os dados atuais
  do avatar.
- **Identificação obrigatória:** A atualização deve ocorrer somente para avatar
  com identificador válido.
- **Validação de campos:** Nome, imagem e preço devem seguir as mesmas regras da
  criação.
- **Consistência de selecionado padrão:** Ao atualizar um avatar para
  selecionado por padrão, o sistema deve manter apenas um selecionado padrão no
  catálogo.
- **Atualização de listagem:** Após edição bem-sucedida, a tabela deve refletir
  os dados atualizados.

##### Regras de Experiência

- **Elemento Visual:** A ação "Editar" deve abrir o mesmo formulário em modo de
  edição.
  resoluções menores.
- **Acessibilidade:** Campos e botões do diálogo devem manter foco e navegação
  previsíveis.
- **Feedback:** Exibir mensagens de sucesso/erro e estado de envio durante a
  atualização.
- **Performance:** Atualizações devem concluir sem bloquear a interação geral da
  página.
- **Segurança:** A edição deve ser protegida por autenticação e autorização de
  conta administrativa.
- **Confiabilidade:** Cancelamento e falhas devem preservar integridade dos
  dados persistidos.
- **Compatibilidade:** O fluxo deve manter comportamento consistente nos
  navegadores suportados.

---

#### RP-04 — Exclusão de Avatar

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Exclusão de Avatar.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Permitir remoção de avatar com confirmação explícita para evitar
deleções acidentais.

##### Regras de Negócio
- **Confirmação obrigatória:** A exclusão só deve ocorrer após confirmação do
  administrador.
- **Remoção de registro:** Após confirmação, o avatar deve ser removido do
  catálogo.
- **Remoção de mídia associada:** O fluxo deve tratar limpeza do arquivo de
  imagem relacionado ao avatar removido.
- **Tratamento de falhas:** Se houver erro em qualquer etapa crítica, o sistema
  deve reportar falha e impedir conclusão silenciosa da exclusão.
- **Atualização da listagem:** Após exclusão bem-sucedida, a tabela deve ser
  recarregada.

##### Regras de Experiência

- **Elemento Visual:** A ação "Excluir" deve abrir diálogo de confirmação com
  aviso de irreversibilidade.
- **Responsividade:** O diálogo de confirmação deve funcionar em diferentes
  tamanhos de viewport.
- **Acessibilidade:** O modal de confirmação deve ser navegável por teclado com
  ações claras de cancelar e continuar.
- **Feedback:** O sistema deve exibir retorno de sucesso/erro após a ação.
- **Performance:** A exclusão deve retornar resultado em tempo adequado para
  fluxo administrativo.
- **Segurança:** A remoção deve exigir autenticação e autorização administrativa
  no backend.
- **Confiabilidade:** Em erro, manter consistência visual e de dados na tabela.
- **Compatibilidade:** O comportamento do diálogo deve ser consistente nos
  navegadores suportados.

---

#### RP-05 — Gestão de Imagem do Avatar

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Gestão de Imagem do Avatar.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Controlar upload e limpeza de arquivos de imagem vinculados ao
fluxo de criação/edição.

##### Regras de Negócio
- **Upload dedicado:** A imagem do avatar deve ser enviada para o diretório de
  armazenamento de avatares.
- **Nome de arquivo válido:** O nome da imagem deve obedecer validações de
  formato aceitas pelo domínio.
- **Associação com formulário:** O nome final da imagem enviada deve ser
  utilizado como valor persistido no avatar.
- **Limpeza de upload descartado:** Ao fechar formulário sem concluir operação,
  o sistema deve tentar remover arquivo recém-enviado que não será utilizado.
- **Tratamento de erro de mídia:** Falhas de upload/remoção devem ser exibidas
  ao usuário com mensagem clara.

##### Regras de Experiência

- **Elemento Visual:** O campo de imagem deve permitir upload e preview da imagem
  selecionada.
- **Responsividade:** O fluxo de upload deve continuar funcional em diferentes
  tamanhos de tela do Studio.
- **Acessibilidade:** O controle de upload deve ser operável por teclado e com
  rótulos compreensíveis.
- **Feedback:** Mostrar estado de envio da imagem e mensagens de erro de validação.
- **Performance:** Upload e preview devem ocorrer sem degradar a experiência da
  página de gestão.
- **Segurança:** Upload e remoção de arquivo devem ocorrer apenas com sessão
  autenticada.
- **Confiabilidade:** O sistema deve reduzir acúmulo de arquivos órfãos em
  cenários de cancelamento e falha.
- **Compatibilidade:** O upload deve funcionar nos navegadores suportados pelo
  Studio.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| shop | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

#### JN-01 — Jornada preservada do documento legado

### 3. Fluxo de Usuário (User Flow)

**Nome do fluxo:** Consultar avatares no catálogo administrativo.

1. O administrador acessa a página de Avatares no Studio.
2. O administrador realiza busca, ordenação por preço e/ou navegação de página.
3. O sistema valida os filtros e parâmetros:
   - **Sucesso:** Exibe tabela atualizada com os itens correspondentes.
   - **Falha:** Exibe feedback de erro e mantém estado estável da tela.

**Nome do fluxo:** Criar novo avatar.

1. O administrador clica em "Criar avatar".
2. O administrador preenche nome, imagem, preço e flags opcionais.
3. O sistema valida os dados e processa a criação:
   - **Sucesso:** Salva avatar, atualiza listagem e exibe confirmação.
   - **Falha:** Exibe mensagem de erro e mantém dados para correção quando
     aplicável.

**Nome do fluxo:** Editar avatar existente.

1. O administrador aciona "Editar" em um item da tabela.
2. O administrador ajusta dados do avatar no formulário pré-preenchido.
3. O sistema valida e processa atualização:
   - **Sucesso:** Atualiza avatar, recarrega listagem e confirma operação.
   - **Falha:** Exibe erro e não aplica alterações inválidas.

**Nome do fluxo:** Excluir avatar.

1. O administrador clica em "Excluir" para um avatar.
2. O administrador confirma a ação no diálogo de exclusão.
3. O sistema executa remoção:
   - **Sucesso:** Remove item da listagem e retorna confirmação.
   - **Falha:** Mantém item, informa erro e preserva consistência da tela.

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Gestão de foguetes e insígnias em conjunto com a tela de avatares. |
| Escopo | Alterações na experiência de compra/seleção de avatares para usuário final na |
| Escopo | Mudança de regras globais de economia de StarCoins além do impacto indireto de |
| Escopo | Criação de novos papéis de acesso administrativo ou redefinição de política de |
| Escopo | Automações editoriais avançadas (aprovação em múltiplas etapas, versionamento |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
