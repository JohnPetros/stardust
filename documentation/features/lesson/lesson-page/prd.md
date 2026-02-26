# PRD - Lesson Page

### 1. Visão Geral

A Lesson Page é a tela responsável por conduzir o aluno pela jornada de aprendizado de uma estrela, em dois estágios obrigatórios: narrativa (Story) e avaliação (Quiz), com conclusão em Rewarding.

O problema que esta funcionalidade resolve é garantir uma progressão pedagógica guiada, com validação de aprendizado ao final, mantendo contexto gamificado (vidas, progresso e recompensa).

O objetivo principal deste PRD é padronizar e documentar o comportamento funcional **já implementado** da Lesson Page, para alinhar produto, design e desenvolvimento. O valor entregue é previsibilidade da experiência e base única para medir sucesso por conclusão da lição, acerto no quiz, tempo de conclusão e redução de abandono.

### 2. Requisitos

#### [x] Acesso e Inicialização da Lição

**Descrição:** Permitir entrada segura na lição por estrela desbloqueada e preparar todo o estado inicial da experiência.

##### Regras de Negócio

- **Acesso por Estrela Desbloqueada:** A lição só pode ser acessada via `starSlug` válido e desbloqueado para o usuário autenticado. Em caso de estrela inválida/bloqueada, retornar `404`.
- **Carga de Conteúdo da Lição:** Ao entrar na página, o sistema deve buscar perguntas, blocos de texto e conteúdo de história da estrela.
- **Montagem da Story:** Quando houver `story` textual, separar por delimitador `----`; quando não houver, gerar conteúdo a partir dos text blocks.
- **Estado Inicial da Sessão:** Iniciar a lição no estágio `story`, com quiz preparado e contador de tempo da sessão reiniciado.

##### Regras de UI/UX (se houver)

- **Transição Inicial:** Exibir animação de transição ao abrir a página e ocultar automaticamente após 1 segundo.
- **Feedback de Carregamento:** Exibir estado de loading no estágio de transição para rewarding.
- **Responsividade:** O layout deve funcionar em mobile e desktop sem perda de funcionalidade.
- **Compatibilidade:** A experiência deve operar nos navegadores modernos suportados pelo produto.

#### [x] Consumo Sequencial da Story

**Descrição:** Garantir leitura progressiva dos blocos narrativos antes do início do quiz.

##### Regras de Negócio

- **Progressão Obrigatória Story -> Quiz:** O usuário deve avançar pela Story para liberar o Quiz; não há pulo direto para o quiz nesta versão.
- **Avanço por Blocos:** Cada clique em "Continuar" avança para o próximo trecho da história.
- **Entrada no Quiz:** Ao atingir o último bloco, o sistema deve exigir confirmação final para transição ao estágio `quiz`.

##### Regras de UI/UX (se houver)

- **Contexto da Lição:** Exibir título com nome e número da estrela no topo da Story.
- **Leitura Cumulativa:** Trechos já lidos permanecem visíveis para preservar contexto narrativo.
- **Feedback de Ação:** O botão "Continuar" deve manter foco e resposta visual clara.
- **Acessibilidade:** Garantir navegação por teclado na ação de continuar e confirmação de avanço.

#### [x] Execução do Quiz Multiformato

**Descrição:** Permitir responder questões em diferentes formatos, mantendo validação uniforme da resposta do usuário.

##### Regras de Negócio

- **Tipos de Questão Suportados:** O quiz deve suportar seleção única, seleção múltipla (checkbox), resposta aberta, drag-and-drop de lista e drag-and-drop em slots de código.
- **Registro de Resposta:** Interações do usuário devem atualizar a resposta atual da questão no estado do quiz.
- **Estado de Não Respondido:** Quando não houver entrada válida (ex.: nada selecionado/preenchido), a resposta deve ser considerada não respondida.
- **Conteúdo Condicional:** Questões podem incluir trecho de código e imagem contextual.

##### Regras de UI/UX (se houver)

- **Enunciado Unificado:** Todos os tipos devem exibir enunciado no mesmo padrão visual da etapa quiz.
- **Botão de Verificação:** O botão deve permanecer fixo no rodapé, com estado desabilitado enquanto a questão não for respondida.
- **Feedback Imediato:** Após verificação, exibir retorno visual de acerto/erro.
- **Acessibilidade:** Permitir acionamento por teclado (incluindo Enter) quando houver resposta.

#### [x] Validação de Respostas, Vidas e Progresso

**Descrição:** Controlar o ciclo de verificação da resposta, progressão entre questões, consumo de vidas e evolução de progresso da lição.

##### Regras de Negócio

- **Ciclo de Verificação:** Ao clicar em "Verificar", o sistema valida a resposta da questão atual.
- **Resposta Correta:** Exibir estado de sucesso e permitir continuar para a próxima questão.
- **Resposta Incorreta:** Exibir estado de falha e permitir nova tentativa, com consumo de vida no fluxo de repetição.
- **Controle de Vidas:** O quiz inicia com 5 vidas e deve bloquear continuidade quando vidas chegarem a zero.
- **Encerramento por Vidas Zeradas:** Ao zerar vidas, exibir alerta de fim de tentativa e encerrar a lição ao confirmar saída.
- **Barra de Progresso:** Atualizar progresso geral combinando avanço da Story e do Quiz.

##### Regras de UI/UX (se houver)

- **Header Fixo da Lição:** Exibir progresso visual e contador de vidas durante story e quiz.
- **Feedback Multissensorial:** Reproduzir feedback sonoro de acerto/erro após verificação.
- **Confiabilidade:** Em caso de inconsistência de estado (ex.: ausência de questão atual), não permitir ação inválida.
- **Performance:** Interações de verificação e troca de questão devem ter resposta imediata percebida pelo usuário.

#### [x] Conclusão da Lição e Redirecionamento para Rewarding

**Descrição:** Finalizar a lição após a última questão, consolidando métricas de desempenho e encaminhando para a tela de recompensa.

##### Regras de Negócio

- **Fim do Quiz:** Quando não houver próxima questão, alterar estágio para `rewarding`.
- **Payload de Rewarding:** Antes do redirecionamento, gerar payload com `questionsCount`, `incorrectAnswersCount`, `secondsCount` e `starId`.
- **Contrato Atual de Integração:** Persistir payload em cookie e manter o contrato atual de rewarding.
- **Higienização de Sessão:** Limpar contador local de segundos e resetar store da lição ao concluir.
- **Navegação Final:** Redirecionar para a página de rewarding da estrela.

##### Regras de UI/UX (se houver)

- **Transição de Conclusão:** Exibir loading enquanto ocorre a preparação do payload e o redirecionamento.
- **Confiabilidade:** Se houver falha na preparação do payload, não exibir dados incompletos ao usuário.

#### [x] Saída Voluntária da Lição

**Descrição:** Permitir que o usuário abandone a lição de forma explícita e segura, com confirmação.

##### Regras de Negócio

- **Confirmação de Saída:** O usuário deve confirmar intenção de sair antes do abandono da lição.
- **Limpeza de Estado:** Ao confirmar saída, limpar contador de tempo e resetar estado da lição.
- **Destino Pós-Saída:** Redirecionar para a página de espaço.

##### Regras de UI/UX (se houver)

- **Ação Visível no Header:** Exibir botão/ícone de saída durante a lição.
- **Diálogo de Confirmação:** Exibir opções claras de "Sair" e "Cancelar".
- **Acessibilidade:** O diálogo deve permitir navegação por teclado e foco inicial previsível.

#### [x] Requisitos Não Funcionais Obrigatórios

**Descrição:** Definir critérios mínimos de qualidade para a experiência da Lesson Page nesta versão documentada.

##### Regras de Negócio

- **Métricas de Sucesso do Produto:** Acompanhar conclusão da lição, acerto no quiz, tempo de conclusão e abandono de fluxo.
- **Persistência entre Refresh:** Ao atualizar/fechar página, a lição reinicia do zero.
- **Escopo de Entrega:** Documentação reflete funcionalidade já implementada, sem expansão de escopo.

##### Regras de UI/UX (se houver)

- **Responsividade:** Garantir usabilidade completa em mobile e desktop.
- **Acessibilidade:** Garantir navegação por teclado, contraste adequado e mensagens de feedback compreensíveis.
- **Performance:** Meta de carga inicial percebida em até 2 segundos, considerando condições normais de rede.
- **Confiabilidade:** Definir fallback para falhas de rede/serviço e comportamento previsível em erro.
- **Compatibilidade:** Garantir funcionamento nos navegadores/dispositivos suportados oficialmente pelo produto.

### 3. Fluxo de Usuário (User Flow)

**Nome do fluxo:** Entrada e Story obrigatória.

1. O usuário acessa `/lesson/[starSlug]`.
2. O sistema valida acesso da estrela e carrega Story + Quiz.
3. O usuário realiza leitura dos blocos narrativos clicando em "Continuar".
4. O sistema valida se há próximo bloco:
   - **Sucesso:** Exibe próximo trecho.
   - **Falha:** Exibe confirmação final para iniciar o quiz.

**Nome do fluxo:** Resposta e validação de questão no Quiz.

1. O usuário acessa a etapa de quiz após concluir a Story.
2. O usuário realiza resposta na questão atual.
3. O sistema valida se há resposta preenchida:
   - **Sucesso:** Habilita "Verificar".
   - **Falha:** Mantém botão desabilitado.
4. O usuário clica em "Verificar" e recebe feedback.
5. O sistema valida resultado da resposta:
   - **Sucesso:** Permite continuar para próxima questão.
   - **Falha:** Mantém na questão e aplica regra de tentativa/vida.

**Nome do fluxo:** Encerramento por vidas esgotadas.

1. O usuário permanece no quiz após respostas incorretas.
2. O sistema reduz vidas conforme regra de validação.
3. O sistema valida se ainda há vidas:
   - **Sucesso:** Mantém usuário no quiz.
   - **Falha:** Exibe alerta de fim de tentativa com ação de saída.

**Nome do fluxo:** Conclusão e Rewarding.

1. O usuário responde a última questão do quiz.
2. O sistema detecta ausência de próxima questão.
3. O sistema valida dados para rewarding:
   - **Sucesso:** Gera cookie de payload e redireciona para rewarding.
   - **Falha:** Mantém fallback de confiabilidade sem concluir com dados inválidos.

**Nome do fluxo:** Saída voluntária da lição.

1. O usuário acessa a ação de sair no header.
2. O usuário confirma abandono no diálogo.
3. O sistema valida confirmação:
   - **Sucesso:** Limpa sessão da lição e redireciona ao espaço.
   - **Falha:** Fecha diálogo e mantém usuário na lição.

### 4. Fora do Escopo (Out of Scope)

- Permitir pulo direto da Story para o Quiz.
- Persistir progresso da lição após refresh/reabertura da página.
- Compra, recuperação automática ou economia de vidas dentro da Lesson Page.
- Inclusão de novos tipos de questão além dos cinco já suportados.
- Alteração do contrato atual de rewarding baseado em cookie.
- Redesenho visual amplo da interface fora dos comportamentos funcionais já implementados.
