---
title: Editor de código de desafio
status: draft
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/13
last_updated_at: 2026-07-16
---

# PRD — Editor de código de desafio

Disponibiliza para: challenging; consumidores adicionais não explicitados no documento legado.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

O **Challenge Code Editor** é o ambiente de escrita e execução de código dentro da página de desafios da plataforma StarDust. Ele permite que o estudante escreva, edite e execute código na linguagem Delegua diretamente no navegador, recebendo feedback imediato sobre a correção da sua solução.

**Problema resolvido:** Sem um editor embutido, o usuário precisaria de ferramentas externas para escrever e testar código, quebrando o fluxo de aprendizado e a imersão na jornada gamificada.

**Objetivo:** Oferecer uma experiência de codificação integrada, fluida e acessível para que o usuário resolva desafios de lógica de programação sem sair da plataforma.

---

## 2. Problema e Oportunidade

🚧 Em construção — problema e oportunidade não estão explicitados como seção própria no documento legado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | https://github.com/JohnPetros/stardust/milestone/13 | Fonte legada de produto; autoridade canônica no Confluence não identificada. |

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

#### RP-01 — Escrita de Código

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Escrita de Código.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** O editor fornece suporte completo à escrita de código na linguagem Delegua, com recursos de produtividade como highlighting, autocomplete e detecção de erros em tempo real.

##### Regras de Negócio
- **Código salvo por desafio:** O código digitado é salvo automaticamente por desafio, independente de autenticação ou conexão com o servidor, garantindo que o progresso não se perca ao recarregar a página ou trocar de aba.
- **Carregamento inicial:** Ao abrir um desafio, o editor carrega o último código salvo do usuário. Se não houver código salvo, carrega o código inicial do desafio.
- **Detector de erros condicional:** O verificador de erros em tempo real é desabilitado quando o desafio não envolve funções.

##### Regras de Experiência

- **Syntax highlighting:** O editor exibe coloração de sintaxe para a linguagem Delegua (português).
- **Autocomplete:** Sugestões de auto-complete são exibidas conforme o usuário digita.
  - [x] Entregue em 2026-07-16: autocomplete Delegua ampliado com estruturas, palavras-chave, funções globais, métodos existentes e símbolos declarados no código aberto.
  - [x] Entregue em 2026-07-16: digitação e `Ctrl + Espaço` consultam o código atual do editor e preservam snippets com placeholders.
  - [x] Entregue em 2026-07-16: remontagens do editor não acumulam providers de hover/autocomplete.
  - [x] Entregue em 2026-07-16: seleções de texto podem ser envolvidas por aspas duplas, aspas simples e crase pela configuração da linguagem Delegua.
- **Documentação contextual:** Documentação é exibida ao passar o mouse sobre palavras-chave.
- **Detecção de erros:** Erros de sintaxe são destacados em tempo real no editor. A funcionalidade pode ser desativada pelo usuário nas configurações.

---

#### RP-02 — Ações da Toolbar

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Ações da Toolbar.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** A toolbar oferece ações rápidas para controlar a execução, o estado do código e o acesso a recursos auxiliares.

##### Regras de Negócio
- **Reset com confirmação:** O reset de código exige confirmação explícita do usuário para evitar perda acidental de progresso.
- **Assistente IA restrito:** A ação de ativar o assistente IA está disponível apenas para usuários autenticados.

##### Regras de Experiência

- **Executar:** Roda o código do usuário contra os casos de teste do desafio.
- **Resetar código:** Reverte o editor ao código original do desafio, com diálogo de confirmação prévia.
- **Desfazer:** Restaura o código ao estado anterior à última edição.
- **Consultar guias:** Abre a documentação da linguagem Delegua organizada por categorias.
- **Ver atalhos:** Lista todos os atalhos de teclado disponíveis.
- **Configurações:** Permite ajustar tamanho da fonte, tamanho do tab e ativar/desativar o detector de erros.
- **Ativar assistente IA:** Alterna a visibilidade do painel do assistente de IA.

---

#### RP-03 — Atalhos de Teclado

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Atalhos de Teclado.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

##### Regras de Negócio

- 🚧 Em construção — regra de negócio não explicitada no documento legado.

**Descrição:** O editor expõe atalhos de teclado para as ações mais frequentes, aumentando a produtividade do estudante.

##### Regras de Experiência

- `Alt + Enter` — Executar código.
- `Ctrl + K` — Abrir guias da linguagem.
- `Ctrl + Z` — Desfazer última edição.
- `Ctrl + .` — Comentar/descomentar linhas selecionadas.
- `Ctrl + X` — Recortar/copiar linha.
- `Ctrl + L` — Selecionar linha.

---

#### RP-04 — Execução e Feedback

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Execução e Feedback.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Ao executar o código, o sistema valida a solução contra os casos de teste do desafio e fornece feedback imediato ao estudante.

##### Regras de Negócio
- **Bloqueio de `Leia()`:** A execução é bloqueada se o usuário remover os comandos de entrada (`Leia()`) necessários para os casos de teste. O aviso exibido é: *"Não mexa em nenhum comando Leia()!"*.
- **Redirecionamento pós-execução:** Ao executar, o usuário é redirecionado para a aba de Resultado com o feedback da validação dos casos de teste.

##### Regras de Experiência

- **Erro de sintaxe ou execução:** O usuário recebe um aviso com a mensagem de erro e o número da linha problemática.
- **Som de falha:** Um som de falha é reproduzido quando a execução do código resulta em erro.

---

#### RP-05 — Console de Output

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Console de Output.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Exibe o output das chamadas `escreva()` em um painel de console (bottom sheet) após a execução do código, permitindo ao estudante inspecionar o resultado intermediário do seu programa.

##### Regras de Negócio
- **Abertura condicional:** O console abre automaticamente ao finalizar a execução somente se houver pelo menos um output de `escreva()`. Se a execução não produzir nenhum `escreva()`, o bottom sheet não abre automaticamente.
- **Limpeza por execução:** O output é limpo no início de cada nova execução.
- **Erros não exibidos no console:** Erros de execução ou sintaxe não são exibidos no console — permanecem exclusivamente no toast de erro.

##### Regras de Experiência

- **Exibição de output:** Cada linha produzida por `escreva()` é exibida na ordem em que foi executada.
- **Abertura manual:** O usuário pode abrir e fechar o console manualmente a qualquer momento, independente de ter executado o código.
- **Responsividade:** Em desktop, o console é exibido como bottom sheet sobreposto ao editor, sem substituir as abas existentes. Em mobile, é exibido como bottom sheet nativo acessível via gesto ou botão.

---

#### RP-06 — Seleção de Código para Assistente IA

Necessidades do usuário:

- 🚧 Em construção — necessidade não explicitada no documento legado.

Resultado: Seleção de Código para Assistente IA.

Atores: 🚧 Em construção — atores não explicitados no documento legado.

**Descrição:** Quando o assistente IA está ativo, o usuário pode selecionar trechos de código no editor para enriquecer o contexto enviado ao assistente.

##### Regras de Negócio
- **Requer assistente ativo:** O botão de seleção de código só aparece quando o assistente IA está habilitado, o que requer autenticação.

##### Regras de Experiência

- **Botão flutuante:** Ao selecionar um trecho de código, um botão flutuante "Adicionar" aparece sobre o editor.
- **Envio de contexto:** Ao clicar no botão, o trecho selecionado é enviado como contexto para o assistente IA.
- **Comportamento do botão:** O botão desaparece ao clicar fora do editor ou ao realizar uma nova ação. Uma nova seleção reexibe o botão.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| challenging | Não explicitado no documento legado | Validar e manter o contrato de produto correspondente. |

## 7. Jornadas

### 3. Fluxo de Usuário (User Flow)

#### JN-01 — rincipal — Resolver um desafio:

1. O usuário acessa a página de um desafio.
2. O editor carrega o último código salvo. Se não houver, carrega o código inicial do desafio.
3. O usuário escreve ou edita o código no editor.
4. O usuário clica em "Executar" ou usa `Alt + Enter`.
5. O sistema valida se os comandos `Leia()` estão presentes:
   - **Falha:** Exibe aviso e bloqueia a execução.
   - **Sucesso:** Continua para o próximo passo.
6. O runtime Delegua executa o código:
   - Cada chamada `escreva()` é capturada e acumulada.
7. Ao finalizar a execução:
   - Se houver output de `escreva()`: o console (bottom sheet) abre automaticamente com as linhas exibidas em ordem.
   - Se não houver output: o console não abre.
   - Se houver erro: um toast com a mensagem e número da linha é exibido; um som de falha é reproduzido.
8. O usuário é redirecionado para a aba de Resultado com o feedback da validação dos casos de teste.

---

#### JN-02 — lternativo — Resetar código:

1. O usuário clica em "Resetar código" na toolbar.
2. Um diálogo de confirmação é exibido.
3. O usuário confirma:
   - **Confirma:** O editor reverte ao código inicial do desafio.
   - **Cancela:** O editor permanece inalterado.

---

#### JN-03 — lternativo — Usar assistente IA com seleção de código:

1. O usuário autenticado ativa o assistente IA pela toolbar.
2. O painel do assistente aparece ao lado do editor (desktop) ou como aba (mobile).
3. O usuário seleciona um trecho de código no editor.
4. O botão flutuante "Adicionar" aparece sobre a seleção.
5. O usuário clica em "Adicionar": o trecho é enviado como contexto ao assistente.
6. O usuário digita sua pergunta e envia ao assistente.

---

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Escopo | Exibição de erros de execução no console de output (tratados exclusivamente via toast). |
| Escopo | Exibição do console em tempo real durante a digitação (somente após executar). |
| Escopo | Persistência de histórico de outputs entre execuções. |
| Escopo | Execução de código diretamente pelo console (modo REPL). |
| Escopo | Suporte a linguagens além de Delegua. |
| Escopo | Sincronização do código salvo entre dispositivos. |

### Decisões descartadas durante a definição

- **Não identificado:** nenhuma alternativa foi formalmente descartada no documento legado.
