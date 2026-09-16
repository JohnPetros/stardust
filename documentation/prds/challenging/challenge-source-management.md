---
title: Gerenciamento de fontes de desafios
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/12
last_updated_at: 2026-03-30
---

# PRD — Gerenciamento de fontes de desafios

Disponibiliza para: challenging; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

O **Gerenciamento de Challenge Sources** é uma funcionalidade do **StarDust Studio** que permite ao administrador (conta god) registrar e visualizar a origem dos desafios de código, cujos problemas são inspirados em questões do LeetCode. A feature centraliza o rastreamento dessas referências externas, associando cada source ao seu respectivo challenge via URL de origem, e atua como suporte direto ao **Agente Criador de Desafios**.

**Objetivo Principal:** Listar e cadastrar as URLs de origem dos desafios, associando cada source ao challenge correspondente em uma relação 1:1.

**Valor Entregue:** Controle operacional do catálogo de desafios com rastreabilidade da fonte de inspiração, apoiando a curadoria da geração automática por IA e evitando duplicatas.

---

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/12 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

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

#### RP-01 — Listagem de Challenge Sources

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Listagem de Challenge Sources.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Tabela paginada exibindo todos os challenge sources cadastrados, com suporte a busca pelo título do challenge vinculado.

##### Regras de Negócio
- **Colunas obrigatórias:** A tabela deve exibir: URL de origem, Título do challenge vinculado e Ações.
- **Paginação:** A listagem deve ser paginada seguindo o padrão existente no Studio.
- **Acesso restrito:** A página só pode ser acessada por usuários autenticados com conta god.
- **Vínculo 1:1:** Cada source está vinculado a exatamente um challenge. Um challenge pode ter no máximo um source.

##### Regras de Experiência

- **URL clicável:** A URL de origem deve ser exibida como link que abre em nova aba.
- **Título truncado:** O título do challenge deve ser truncado com ellipsis se exceder o espaço disponível na coluna.
- **Ações por linha:** Cada linha deve ter um botão de deletar (ícone de lixeira).
- **Feedback:** Toast de sucesso ou erro ao concluir a exclusão.
- **Segurança:** Página acessível apenas a conta god — redirecionar ou bloquear demais perfis.

---

#### RP-02 — Criação de Challenge Source

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Criação de Challenge Source.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Dialog para cadastrar um novo source, informando a URL de origem e o challenge ao qual ele pertence.

##### Regras de Negócio
- **URL obrigatória:** O campo de URL não pode estar vazio.
- **Challenge obrigatório:** O vínculo com um challenge é obrigatório na criação.
- **Unicidade:** Se o challenge selecionado já possuir um source, o sistema deve bloquear a criação e exibir mensagem explicativa.
- **Persistência:** O source deve ser salvo com `url` e `challenge_id`.

##### Regras de Experiência

- **Dialog:** Botão "Adicionar source" abre o formulário em um dialog.
- **Busca por título:** O campo de seleção de challenge deve permitir busca por título para facilitar o vínculo à medida que o catálogo cresce.
- **Botão desabilitado:** O botão de salvar deve ficar desabilitado enquanto o formulário estiver inválido.
- **Feedback de sucesso:** Dialog fecha e listagem é atualizada automaticamente.
- **Feedback de erro:** Mensagem de erro exibida dentro do dialog sem fechá-lo.
- **Loading no submit:** Botão exibe estado de carregamento durante a requisição.

---

#### RP-03 — Exclusão de Challenge Source

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Exclusão de Challenge Source.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Ação de remover um source. O challenge vinculado permanece intacto após a exclusão.

##### Regras de Negócio
- **Imutabilidade do challenge:** A exclusão do source não altera, remove nem desvincula o challenge vinculado de nenhuma forma.
- **Confirmação obrigatória:** A exclusão não ocorre sem confirmação explícita do usuário.

##### Regras de Experiência

- **Dialog de confirmação:** Alert dialog com as opções "Cancelar" e "Confirmar exclusão".
- **Feedback:** Toast de sucesso após exclusão confirmada; toast de erro se a operação falhar.
- **Atualização da listagem:** Listagem atualizada automaticamente após exclusão bem-sucedida.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| challenging | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

### 3. Fluxo de Usuário (User Flow)

#### JN-01 — Visualizar sources cadastrados

1. O administrador (conta god) acessa a página de Challenge Sources no Studio.
2. O sistema carrega e exibe a listagem paginada de sources.
3. O administrador digita no campo de busca para filtrar pelo título do challenge vinculado.
4. O sistema filtra a listagem conforme a busca.

---

#### JN-02 — Cadastrar um novo source

1. O administrador clica no botão "Adicionar source".
2. O sistema abre o dialog com o formulário de criação.
3. O administrador preenche a URL de origem e seleciona o challenge a ser vinculado (com busca por título).
4. O administrador clica em "Salvar".
5. O sistema valida os dados:
   - **URL inválida:** Exibe mensagem de validação no campo.
   - **Challenge já possui source:** Exibe mensagem de erro dentro do dialog sem fechá-lo.
   - **Sucesso:** Dialog fecha, listagem é atualizada e toast de sucesso é exibido.

---

#### JN-03 — Excluir um source

1. O administrador clica no ícone de lixeira na linha do source desejado.
2. O sistema abre o alert dialog de confirmação.
3. O administrador confirma a exclusão.
4. O sistema processa a exclusão:
   - **Sucesso:** Dialog fecha, listagem é atualizada e toast de sucesso é exibido.
   - **Erro:** Toast de erro é exibido, source permanece na listagem.

---

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | **Edição de source:** Não será possível editar um source existente. O fluxo previsto é deletar e recriar. |
| Escopo | **Múltiplas URLs por source:** Cada source possui apenas uma URL de origem. Suporte a múltiplas plataformas não está contemplado nesta versão. |
| Escopo | **Vinculação automática pelo agente:** A associação entre source e challenge não é feita automaticamente pelo Agente Criador de Desafios — o cadastro é manual nesta entrega. A automação é um item de backlog futuro e não uma limitação permanente. |
| Escopo | **Acesso por outros perfis:** Apenas conta god tem acesso. Não há suporte a outros níveis de permissão nesta versão. |
| Escopo | **Notificações:** Nenhuma notificação é enviada ao criar ou excluir um source. |
| Escopo | **Histórico de alterações:** Não há rastreamento de quem criou ou deletou um source. |
| Escopo | **Metadados adicionais da plataforma:** Campos como título original, dificuldade ou ID do problema na plataforma externa não fazem parte desta versão. |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
