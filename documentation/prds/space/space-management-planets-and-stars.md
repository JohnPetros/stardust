---
title: Gerenciamento do Espaço Sideral (Planetas e Estrelas)
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/10
last_updated_at: 2026-02-28
---

# PRD — Gerenciamento do Espaço Sideral (Planetas e Estrelas)

Disponibiliza para: space; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

O gerenciamento do espaco no Studio permite que a equipe de conteudo administre a estrutura da trilha espacial de aprendizado por meio de planetas e estrelas. A funcionalidade resolve o problema de manutencao manual e fragmentada da jornada, centralizando criacao, edicao, ordenacao e exclusao em um unico fluxo operacional. O objetivo principal e aumentar a eficiencia operacional da equipe ao publicar e ajustar a progressao dos alunos com rapidez e menor risco de erro.

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/10 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

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

#### RP-01 — Cadastro de planeta

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Cadastro de planeta.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** Permitir criar novos planetas com identidade visual e nome para compor a trilha.

##### Regras de Negocio

- **Dados obrigatorios do planeta:** O cadastro exige nome, icone e imagem.
- **Validacao de nome:** O nome deve respeitar as validacoes de formato da plataforma.
- **Estado inicial do planeta:** Um novo planeta nasce sem estrelas, com contadores zerados e indisponivel para usuarios finais.
- **Posicionamento inicial:** O planeta criado entra no fim da ordem atual de planetas.

##### Regras de Experiência

- **Formulario de cadastro:** O modal deve exibir campo de nome e uploads separados para imagem e icone.
- **Preview visual:** A imagem e o icone devem ser exibidos em preview antes da confirmacao.
- **Acessibilidade:** Inputs e botoes devem ser acessiveis por teclado e rotulados de forma clara.
- **Feedback:** Em erro de criacao, exibir mensagem de falha; em sucesso, atualizar listagem.
- **Performance:** A criacao deve refletir na lista sem exigir navegacao manual da pagina.
- **Seguranca:** Apenas usuarios autenticados no Studio podem executar a acao.
- **Confiabilidade:** Ao fechar o modal sem salvar, arquivos enviados e nao persistidos devem ser limpos do storage.
- **Compatibilidade:** Funcionar nos navegadores homologados do Studio.

- [x] Edicao e exclusao de planeta

---

#### RP-02 — Edicao e exclusao de planeta

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Edicao e exclusao de planeta.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** Permitir ajustar dados visuais e remover planetas obsoletos com confirmacao explicita.

##### Regras de Negocio

- **Edicao parcial:** Deve ser possivel alterar nome, icone e imagem de forma independente.
- **Persistencia de alteracoes:** Mudancas validas devem substituir os dados anteriores do planeta.
- **Exclusao destrutiva:** A exclusao de planeta remove o planeta e suas estrelas associadas.
- **Precondicao de exclusao:** A acao de exclusao deve exigir confirmacao do operador.

##### Regras de Experiência

- **Acao de editar:** O planeta deve oferecer atalho para abrir formulario de edicao.
- **Acao de deletar:** O planeta deve oferecer dialogo de confirmacao com aviso de irreversibilidade.
- **Acessibilidade:** Dialogo de confirmacao deve permitir navegacao por teclado e foco visivel.
- **Feedback:** Em erro na exclusao/edicao, mostrar mensagem clara; em sucesso, refletir estado atualizado.
- **Performance:** Atualizacoes devem ocorrer sem recarregamento completo manual do usuario.
- **Seguranca:** Operacoes devem ocorrer em contexto autenticado.
- **Confiabilidade:** Falhas de persistencia devem impedir fechamento silencioso com estado inconsistente.
- **Compatibilidade:** Fluxo deve manter comportamento consistente entre ambientes suportados.

- [x] Ordenacao de planetas

---

#### RP-03 — Ordenacao de planetas

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Ordenacao de planetas.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** Permitir reordenar planetas via arrastar e soltar para redefinir a progressao macro da trilha.

##### Regras de Negocio

- **Ordenacao manual:** O operador pode alterar a ordem de exibicao dos planetas por drag and drop.
- **Integridade da ordem:** A nova ordem deve conter IDs unicos de todos os planetas envolvidos.
- **Persistencia de ordem:** A ordem salva deve ser reutilizada nas proximas cargas da pagina.

##### Regras de Experiência

- **Interacao drag and drop:** Itens devem apresentar affordance visual de arraste.
- **Acessibilidade:** Deve existir indicacao visual clara do item em movimento.
- **Feedback:** Em falha de reordenacao, exibir erro e evitar confirmacao silenciosa.
- **Performance:** Reordenacao deve responder rapidamente apos soltar o item.
- **Seguranca:** Reordenacao exige autenticacao.
- **Confiabilidade:** Em erro, evitar persistir ordem parcial.
- **Compatibilidade:** Comportamento consistente no conjunto de navegadores alvo.

- [x] Gestao de estrelas do planeta

---

#### RP-04 — Gestao de estrelas do planeta

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Gestao de estrelas do planeta.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** Permitir criar, listar, remover e ordenar estrelas dentro de cada planeta.

##### Regras de Negocio

- **Criacao de estrela:** Ao adicionar estrela, ela deve ser criada no planeta selecionado.
- **Nome inicial da estrela:** A nova estrela inicia com nome padrao deduplicado automaticamente quando necessario.
- **Numeracao sequencial:** Estrelas devem manter numeracao ordinal dentro do planeta.
- **Exclusao de estrela:** Ao remover estrela, a numeracao das restantes deve ser reajustada para manter sequencia continua.
- **Ordenacao de estrelas:** A ordem por drag and drop redefine a numeracao e a sequencia oficial do planeta.
- **Integridade da ordem:** Reordenacao aceita apenas lista valida de IDs unicos das estrelas.

##### Regras de Experiência

- **Visao colapsavel por planeta:** Cada planeta deve expandir/retrair para gerenciamento das estrelas.
- **Estado vazio:** Quando nao houver estrelas, exibir mensagem de estado vazio.
- **Acao de adicionar:** Deve existir CTA para adicionar estrela no contexto do planeta aberto.
- **Acessibilidade:** Controles de adicionar, ordenar e excluir devem ser navegaveis por teclado.
- **Feedback:** Em falhas de criacao/exclusao/reordenacao, apresentar mensagem de erro.
- **Performance:** Atualizacoes de lista devem ocorrer com baixo atraso perceptivel.
- **Seguranca:** Operacoes protegidas por autenticacao no Studio.
- **Confiabilidade:** Em falha de operacao, preservar estado consistente da lista exibida.
- **Compatibilidade:** Renderizacao consistente dos itens e controles nos navegadores suportados.

- [x] Configuracao funcional de estrela

---

#### RP-05 — Configuracao funcional de estrela

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Configuracao funcional de estrela.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descricao:** Permitir editar nome e controlar disponibilidade/tipo da estrela, alem de acessar o conteudo associado.

##### Regras de Negocio

- **Edicao de nome:** O nome da estrela pode ser alterado inline e persistido ao perder foco.
- **Slug derivado do nome:** Alteracoes de nome atualizam o identificador textual usado nas rotas de conteudo.
- **Disponibilidade da estrela:** Cada estrela pode ser marcada como disponivel ou indisponivel para usuarios.
- **Tipo da estrela:** Cada estrela pode alternar entre modo trilha normal e modo desafio.
- **Navegacao por tipo:**
  - **Quando for desafio:** A acao abre o desafio ja vinculado a estrela; sem vinculo, abre fluxo de criacao de desafio.
  - **Quando nao for desafio:** A estrela deve expor acesso aos fluxos de historia e questoes.
- **Metricas operacionais da estrela:** Exibir quantidade de usuarios na estrela e quantidade de desbloqueios para apoiar curadoria.

##### Regras de Experiência

- **Edicao inline:** Nome deve ser editavel diretamente no item da estrela.
- **Controles de toggle:** Disponibilidade e tipo devem ser ajustados por alternadores dedicados.
- **Tooltips de metricas:** Informacoes de contagem devem ter descricao contextual.
- **Acessibilidade:** Toggles, links e botoes com foco visivel e operacao por teclado.
- **Feedback:** Em falha ao salvar nome/tipo/disponibilidade, exibir erro imediato.
- **Performance:** Trocas de estado devem refletir com latencia baixa.
- **Seguranca:** Acoes restritas a ambiente autenticado de administracao.
- **Confiabilidade:** Falhas de integracao externa (ex.: desafio nao encontrado) devem ter fallback de navegacao funcional.
- **Compatibilidade:** Comportamento uniforme de edicao e toggles nos navegadores homologados.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| space | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

#### JN-01 — Jornada preservada do documento legado

### 3. Fluxo de Usuario (User Flow)

**Nome do fluxo:** Montar planeta completo no Studio.

1. O usuario acessa a pagina de planetas no Studio.
2. O usuario cria um novo planeta informando nome, imagem e icone.
3. O sistema valida os dados obrigatorios:
   - **Sucesso:** O planeta e criado e aparece na lista.
   - **Falha:** O sistema exibe mensagem de erro e mantem o formulario para ajuste.
4. O usuario expande o planeta criado e adiciona estrelas.
5. O sistema cria a estrela com numeracao e nome inicial padrao:
   - **Sucesso:** A estrela aparece na lista do planeta.
   - **Falha:** O sistema exibe erro sem alterar a lista.
6. O usuario ajusta nome, disponibilidade e tipo das estrelas.
7. O sistema persiste cada alteracao:
   - **Sucesso:** O novo estado permanece salvo.
   - **Falha:** O sistema notifica erro e evita confirmacao silenciosa.
8. O usuario reordena estrelas e planetas conforme a progressao desejada.
9. O sistema valida a ordem enviada:
   - **Sucesso:** Nova ordem e persistida.
   - **Falha:** O sistema informa conflito e mantem estado consistente.

**Nome do fluxo:** Remover itens obsoletos.

1. O usuario seleciona excluir estrela ou planeta.
2. O sistema solicita confirmacao da acao destrutiva.
3. O usuario confirma a exclusao:
   - **Sucesso:** Item removido e interface atualizada.
   - **Falha:** Mensagem de erro exibida e item preservado.

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Criacao em massa (bulk) de planetas ou estrelas. |
| Escopo | Versionamento, historico de alteracoes e desfazer/refazer. |
| Escopo | Regras automaticas de liberacao pedagogica baseadas em desempenho. |
| Escopo | Edicao de conteudo de historia/questoes dentro desta tela (apenas navegacao para telas especificas). |
| Escopo | Definicao de metas analiticas formais para esta versao do PRD. |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
