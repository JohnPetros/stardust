---
title: Notas Privadas do Usuario
status: draft
source:
  - type: direct-request
    ref: documentation/features/profile/user-notes/prd.md
last_updated_at: 2026-09-15
---

# PRD — Notas Privadas do Usuario

Disponibiliza para: profile; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

- A funcionalidade oferece um espaco privado de anotacoes para o usuario autenticado, acessivel tanto nos fluxos de `lesson` e `challenge` quanto por uma area dedicada de notas.
- Ela resolve a necessidade de registrar insights, resumos e rascunhos durante o estudo, sem misturar esse conteudo com recursos publicos ou colaborativos.
- O objetivo principal e permitir criar, consultar, editar e excluir notas pessoais com experiencia rapida, contextual, persistida e reutilizavel em diferentes momentos da jornada.

---

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | documentation/features/profile/user-notes/prd.md | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

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

#### RP-01 — Capacidade descrita pela referência legada

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: o comportamento descrito no requisito.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** O usuario autenticado deve conseguir acessar suas notas pessoais tanto pelos fluxos de estudo quanto por uma entrada dedicada de navegacao autenticada.

##### Regras de Negocio

- **Acesso multi-contexto:** O acesso a notas existe nos fluxos de `lesson` e `challenge`, e tambem em uma pagina dedicada acessivel pela navegacao autenticada.
- **Acesso autenticado:** O atalho de notas aparece somente para usuarios autenticados.
- **Area privada dedicada:** A plataforma deve oferecer uma area privada de gerenciamento de notas para quem precisa consultar ou editar anotacoes fora do contexto imediato da aula.

##### Regras de Experiência

- **Abertura contextual:** O drawer continua abrindo a partir de um atalho visual no cabecalho da tela atual.
- **Navegacao dedicada:** A navegacao autenticada deve expor uma entrada `Notas` para acesso rapido ao workspace completo.
- **Responsividade:** O acesso dedicado precisa funcionar bem em desktop e mobile sem quebrar a navegacao principal.

---

#### RP-02 — Capacidade descrita pela referência legada

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: o comportamento descrito no requisito.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** O usuario deve conseguir escrever e atualizar notas pessoais com titulo obrigatorio e corpo em Markdown editado por interface rica.

##### Regras de Negocio

- **Titulo obrigatorio:** Toda nota precisa de um titulo com pelo menos 1 caractere.
- **Corpo opcional:** O conteudo da nota pode estar vazio.
- **Persistencia individual:** Cada nota e salva como registro proprio, separado do cadastro geral do usuario.
- **Atualizacao de data:** Toda edicao deve atualizar a data da ultima modificacao.

##### Regras de Experiência

- **Editor rico:** O drawer deve oferecer edicao com formatacao basica e persistencia em Markdown.
- **Feedback de formulario:** Erros de validacao e estados de salvamento devem ser visiveis durante a interacao.
- **Continuidade do estudo:** O usuario pode continuar na pagina principal enquanto salva a nota.

---

#### RP-03 — Capacidade descrita pela referência legada

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: o comportamento descrito no requisito.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** O usuario deve conseguir abrir uma listagem sobre o drawer para localizar notas existentes e retomar a edicao rapidamente.

##### Regras de Negocio

- **Listagem privada:** O sistema retorna apenas notas do usuario autenticado.
- **Ordenacao:** As notas devem ser listadas por atualizacao mais recente primeiro.
- **Busca por titulo:** O usuario pode filtrar a listagem por texto no titulo.
- **Paginacao:** A listagem deve usar resposta paginada para suportar crescimento da colecao.

##### Regras de Experiência

- **Preview da nota:** Cada item deve exibir titulo, trecho do conteudo e data relativa de atualizacao.
- **Busca sob demanda:** A listagem deve ser carregada quando o usuario abrir o modal de notas.
- **Estado vazio e erro:** A interface deve informar ausencia de notas e falhas de carregamento com acao de recuperacao.

---

#### RP-04 — Capacidade descrita pela referência legada

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: o comportamento descrito no requisito.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** O usuario deve conseguir remover uma nota propria mediante confirmacao explicita, sem risco de afetar notas de outros usuarios.

##### Regras de Negocio

- **Ownership obrigatorio:** Update e delete devem validar que a nota pertence ao usuario autenticado.
- **Exclusao definitiva:** Ao confirmar a exclusao, a nota deve ser removida do repositorio persistido.
- **Privacidade do recurso:** O backend nao deve aceitar campos controlados pelo servidor nos payloads de entrada.

##### Regras de Experiência

- **Confirmacao explicita:** O fluxo de exclusao deve depender de confirmacao do usuario.
- **Atualizacao imediata:** A lista local deve refletir create, update e delete sem exigir recarregamento completo.
- **Feedback:** O usuario deve receber retorno claro em caso de sucesso ou erro.

---

#### RP-05 — Capacidade descrita pela referência legada

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: o comportamento descrito no requisito.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** O usuario autenticado deve conseguir abrir uma area exclusiva para notas privadas, com lista, busca, edicao e exclusao sem depender do contexto de uma aula ou desafio.

##### Regras de Negocio

- **Workspace privado:** A pagina dedicada mostra apenas notas do proprio usuario autenticado.
- **Busca por titulo:** O usuario pode localizar notas pelo titulo sem perder a ordenacao por atualizacao mais recente.
- **Mesma base de dados:** A experiencia dedicada reutiliza o mesmo recurso de notas ja usado no drawer, sem criar um fluxo paralelo.

##### Regras de Experiência

- **Desktop em duas colunas:** No desktop, a pagina deve exibir lista lateral e editor ao mesmo tempo.
- **Fluxo mobile em uma tela por vez:** No mobile, a experiencia alterna entre lista e editor sem mudar de rota.
- **Edicao sem friccao:** Criacao, selecao, salvamento e exclusao devem acontecer no mesmo workspace, com confirmacao para descarte e exclusao.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| profile | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

### 3. Fluxo de Usuario (User Flow)

#### JN-01 — Registrar uma nova anotacao durante o estudo:

1. O usuario autenticado acessa uma pagina de `lesson` ou `challenge`.
2. O usuario abre o drawer de notas pelo atalho do cabecalho.
3. O usuario preenche titulo e conteudo da anotacao.
4. O sistema valida e salva a nota:
   - **Sucesso:** a nota e persistida e permanece disponivel para edicao futura.
   - **Falha:** a interface exibe erro e preserva o conteudo digitado.

#### JN-02 — Reabrir e editar uma nota existente:

1. O usuario abre o drawer de notas.
2. O usuario escolhe `Ver notas`.
3. O sistema carrega a listagem privada com busca e paginacao.
4. O usuario seleciona uma nota existente.
5. O sistema preenche o formulario com os dados da nota:
   - **Sucesso:** a nota volta ao modo de edicao no mesmo drawer.
   - **Falha:** a interface informa o erro e oferece nova tentativa.

#### JN-03 — Excluir uma anotacao:

1. O usuario abre uma nota existente no drawer.
2. O usuario aciona a exclusao.
3. O sistema solicita confirmacao explicita.
4. O sistema valida a operacao:
   - **Sucesso:** a nota e removida e a lista local e reconciliada.
   - **Falha:** a nota e restaurada na interface e o erro e exibido.

---

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Compartilhamento de notas entre usuarios. |
| Escopo | Organizacao por tags, pastas, busca global ou historico de versoes. |
| Escopo | Vinculo das notas a estrelas, desafios especificos, questoes ou comentarios. |
| Escopo | Autosave, edicao offline ou sincronizacao local fora do salvamento manual. |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
