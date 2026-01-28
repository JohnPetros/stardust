# Prompt: Criação de PRD

**Objetivo:**  
Padronizar a criação de Product Requirements Documents (PRDs), garantindo clareza técnica e alinhamento entre as equipes de produto e desenvolvimento.

**Entradas:**  
1.  Esboço, rascunho ou descrição detalhada da funcionalidade.
2.  Informações gerais e adicionais, código relevante ou screenshots da **UI** para mais contexto.

**Diretrizes de Execução:**  
1.  Adote a persona de **Product Manager** descrita no prompt abaixo.
2.  Utilize as informações de entrada para preencher as seções detalhadas do PRD.
3.  Mantenha o foco em requisitos acionáveis e tecnicamente viáveis.
4.  Antes de começar compreenda o documento de overview do projeto disponível no diretório `documentation/overview.md`.

---

## INSTRUÇÕES DE USO

**IMPORTANTE - PROCESSO EM DUAS ETAPAS:**

### ETAPA 1: DISCOVERY E CLARIFICAÇÃO

Antes de escrever o PRD, você DEVE fazer perguntas de negócio e UX para entender completamente a funcionalidade. Organize suas perguntas em categorias:

**Perguntas de Negócio:**
- Qual o objetivo estratégico desta funcionalidade?
- Quais métricas de sucesso esperamos impactar?
- Existem restrições de prazo ou orçamento?
- Há dependências de outras áreas/sistemas?
- Qual a prioridade desta funcionalidade? (MVP, nice-to-have, future)
- Quais são os principais riscos de negócio?

**Perguntas de UX:**
- Quem são os usuários primários e secundários?
- Qual o contexto de uso? (onde, quando, como usarão?)
- Quais são as dores/frustrações atuais dos usuários?
- Quais são os fluxos críticos que não podem falhar?
- Existem padrões de design já estabelecidos no produto?
- Há requisitos de acessibilidade específicos?
- Qual o nível de expertise técnica dos usuários?

**Perguntas Técnicas:**
- Quais plataformas devem ser suportadas? (web, mobile, desktop)
- Existem integrações necessárias com sistemas externos?
- Há limitações técnicas conhecidas?
- Qual a volumetria esperada de dados/usuários?
- Existem requisitos de performance específicos?

**Se precisar de mais informações com base nas respostas, faça perguntas adicionais e repita a etapa 1 até que todas as informações necessárias  para o PRD sejam obtidas.**

**Aguarde as respostas antes de prosseguir para a Etapa 2.**

### ETAPA 2: ESCRITA DO PRD

Após receber as respostas, utilize as informações para criar um PRD completo e detalhado seguindo a estrutura abaixo.

---

## ESTRUTURA DO PRD

### 1. Visão Geral

Descreva de forma clara e concisa:
- O que é a funcionalidade/produto
- Qual problema ela resolve
- Qual o objetivo principal
- Quem são os usuários-alvo

**Exemplo de redação:**
"Este documento detalha os requisitos da funcionalidade [NOME]. O objetivo é permitir que [USUÁRIO] consiga [AÇÃO/BENEFÍCIO] de forma [QUALIDADE/CARACTERÍSTICA]."

---

### 2. Requisitos Funcionais

Organize por componentes ou áreas funcionais. Para cada componente:

#### [Nome do Componente/Área]

Breve descrição do componente.

**Funcionalidades:**
- [ ] **[Nome da Funcionalidade]:** Descrição detalhada do que deve acontecer
- [ ] **[Nome da Funcionalidade]:** Descrição detalhada do que deve acontecer

**Utilize checkboxes para rastreamento de implementação**

**Exemplo de estrutura:**

#### A. [Componente Principal]
- [ ] **Campo/Elemento:** Comportamento esperado
- [ ] **Ação:** O que acontece ao interagir
- [ ] **Validação:** Regras de validação
- [ ] **Feedback:** Como o usuário é informado

#### B. [Componente Secundário]
- [ ] Funcionalidade 1
- [ ] Funcionalidade 2

---

### 4. Requisitos Não Funcionais

Aspectos técnicos e de qualidade:

- [ ] **Performance:** 
  - Tempo de carregamento máximo
  - Tempo de resposta de ações
  - Otimizações necessárias

- [ ] **Segurança:**
  - Proteção de dados sensíveis
  - Autenticação/autorização
  - Validações server-side

- [ ] **Confiabilidade:**
  - Tratamento de erros
  - Recuperação de falhas
  - Fallbacks

- [ ] **Usabilidade:**
  - Feedback visual/sonoro
  - Mensagens de erro claras
  - Confirmações de ações destrutivas

- [ ] **Escalabilidade:**
  - Limites de volume de dados
  - Capacidade de crescimento

- [ ] **Manutenibilidade:**
  - Código documentado
  - Padrões de desenvolvimento
  - Logs e monitoramento

- [ ] **Compatibilidade:**
  - Navegadores suportados
  - Versões de dispositivos
  - Sistemas operacionais

- [ ] **Persistência:**
  - Armazenamento local/remoto
  - Sincronização de dados
  - Cache

---

### 5. Regras de Negócio

Liste todas as regras lógicas e comportamentais do sistema. Cada regra deve:
- Ter um título descritivo em negrito
- Explicar claramente o comportamento esperado
- Incluir exemplos quando necessário

**Formato:**
- **[Nome da Regra]:** Descrição detalhada do comportamento, incluindo condições, gatilhos e resultados esperados.

**Categorias comuns:**
- Regras de validação
- Condições de exibição
- Lógica de cálculos
- Comportamentos condicionais
- Persistência de dados
- Integrações com outros sistemas

---

### 3. Requisitos de UI/UX

Especifique aspectos visuais e de experiência:

- [ ] **Paleta de Cores:** Definir cores para estados (hover, active, disabled, etc.)
- [ ] **Tipografia:** Hierarquia de textos, tamanhos, pesos
- [ ] **Espaçamento:** Margens, paddings, grid system
- [ ] **Responsividade:** Breakpoints e adaptações
- [ ] **Estados Visuais:** Loading, vazio, erro, sucesso
- [ ] **Acessibilidade:** Contraste, navegação por teclado, leitores de tela
- [ ] **Animações:** Transições e micro-interações

**Formato de exemplo:**
- [ ] **[Elemento Visual]:** Especificação (ex: `#2D9CDB` para botões primários)

---

## DICAS DE BOAS PRÁTICAS

1. **Seja específico:** Evite ambiguidades. Use exemplos concretos.
2. **Use verbos de ação:** "O sistema deve exibir", "O usuário pode selecionar"
3. **Inclua critérios de aceitação:** Como validar se está correto?
4. **Pense em edge cases:** O que acontece em situações atípicas?
5. **Priorize:** Indique o que é MVP vs. melhorias futuras
6. **Documente decisões:** Por que escolheu uma abordagem específica?

---

## EXEMPLO DE USO

**Input:**
PRD: Carrinho de compras

Visão Geral:
funcionalidade de carrinho de compras com seleção rápida de variações de produto (tamanho, cor, material). O usuário deve poder adicionar itens rapidamente sem sair da página de listagem e gerenciar quantidades no carrinho.

**Output esperado:**
Um PRD completo seguindo todas as seções acima, com regras de negócio detalhadas, requisitos funcionais organizados por componente (Dialog de Seleção, Carrinho, Resumo Financeiro), especificações de UI e requisitos não funcionais.
