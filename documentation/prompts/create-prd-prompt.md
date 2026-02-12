# Prompt: Criar PRD

**Objetivo:** Padronizar a criação de Product Requirements Documents (PRDs),
garantindo clareza técnica e alinhamento entre as equipes de produto, design e
desenvolvimento.

**Entradas possíveis (Inputs):**

- URL da milestone no Github use a tool de `webfetch` para obter os dados da página.
- Esboço, rascunho ou descrição da funcionalidade.
- Informações de contexto, código relevante ou screenshots.
- Documentação de referência (se houver).
- Parte da codebase que já implementa a PRD.

---

## INSTRUÇÕES DE EXECUÇÃO

**Você deve seguir rigorosamente este processo de duas etapas:**

### ETAPA 1: DISCOVERY E CLARIFICAÇÃO (CRÍTICO)

**NÃO GERE O PRD IMEDIATAMENTE.** Antes de escrever, analise o pedido e faça
perguntas para preencher lacunas. Organize as perguntas em:

1. **Negócio:** Objetivos, métricas de sucesso, prioridade.
2. **UX/Design:** Público-alvo, jornada, dores atuais.
3. **Técnico:** Plataformas, integrações, performance, dados.

**-> Use a tool `question` para gerar perguntas.**
**-> Pare e aguarde as minhas respostas antes de continuar.**
**-> Se necessário, faça mais perguntas com base nas respostas anteriores.**

### ETAPA 2: ESCRITA DO PRD

Após receber as respostas, gere o documento completo seguindo estritamente o
template abaixo.

---

## TEMPLATE DO PRD (Estrutura de Saída)

### 1. Visão Geral

_Descreva de forma clara e concisa:_

- O que é a funcionalidade/produto.
- Qual problema resolve.
- Qual o objetivo principal e valor entregue.

### 2. Requisitos

_Liste as funcionalidades. Não use IDs numéricos. Use checkboxes para
rastreamento._

#### [Nome do Requisito]

**Descrição:** Breve contexto do requisito.

_(Repita para todos os requisitos)_

##### Regras de Negócio

_Liste as regras lógicas e comportamentais (Backend/Lógica)._

- **[Nome da Regra]:** Descrição detalhada do comportamento, validações,
      condições, gatilhos e cálculos.
- **[Nome da Regra]:** Descrição detalhada...

##### Regras de UI/UX (se houver)

_Especifique aspectos visuais e de interação (Frontend)._

- **[Elemento Visual]:** Especificação (Cores, Tipografia, Estados).
- **Responsividade:** Comportamento em mobile/desktop.
- **Acessibilidade:** Regras de contraste e navegação por teclado.
- **Feedback:** Mensagens de erro, sucesso e estados de loading.
- **Performance:** (Tempo de carregamento, resposta).
- **Segurança:** (Autenticação, proteção de dados).
- **Confiabilidade:** (Tratamento de erros, fallbacks).
- **Compatibilidade:** (Navegadores, dispositivos).

### 3. Fluxo de Usuário (User Flow)

_Descreva o caminho passo-a-passo que o usuário percorre, divida em fluxos
menores caso necessário._

**Nome do fluxo:** Breve contexto do fluxo.

1. O usuário acessa [Tela/Local].
2. O usuário realiza [Ação].
3. O sistema valida [Condição]:
   - **Sucesso:** Ocorre X.
   - **Falha:** Ocorre Y.

### 4. Fora do Escopo (Out of Scope)

_O que NÃO será desenvolvido nesta versão para evitar scope creep._

## Restrições para o PRD

- Não inclua tópicos de design, arquitetura, design de interação, design de código, etc. O PRD deve ser focado em funcionalidades.
