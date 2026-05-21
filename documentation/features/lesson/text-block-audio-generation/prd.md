# PRD — Geração de Áudio Automático nos Blocos de Texto

### 1. Visão Geral

* A funcionalidade permite que a equipe do Studio gere narração em voz sintética (TTS) para os blocos de texto da história de uma estrela — bloco a bloco ou em lote para toda a história de uma vez.
* Ela resolve o problema de criar arquivos de áudio manualmente e de forma desacoplada do fluxo editorial, tornando a produção de conteúdo narrado mais rápida e centralizada.
* O objetivo principal é integrar geração de áudio diretamente no editor de blocos do Studio, com preview de escuta após processamento e geração em background — tanto individual quanto em lote — para que o operador continue navegando livremente enquanto os áudios são produzidos. A Lesson Page não é alterada nesta entrega.

### 1.1 Status da entrega atual

- [x] O backend já aceita disparo assíncrono de geração de áudio por bloco e em lote, permitindo que o Studio solicite processamento sem bloquear a operação editorial.
- [x] O sistema já persiste voz, status e arquivo de áudio por bloco, incluindo transições de `pending`, `done`, `error` e `cancelled` durante o processamento em background.
- [x] O backend já oferece cancelamento cooperativo individual e em lote para evitar retrabalho e manter o estado dos blocos consistente.

> Nesta entrega, foi concluída a fundação backend do recurso. A experiência completa do Studio descrita nos requisitos abaixo — incluindo polling, preview inline e controles visuais — continua pendente em specs de UI.

---

### 2. Requisitos

#### REQ-01 [Gerar áudio de um bloco individualmente]

- [ ] **Gerar áudio de um bloco individualmente**

**Descrição:** O editor deve permitir acionar a geração de áudio TTS para um bloco específico a partir do seu conteúdo atual.

##### Regras de Negócio
- **Blocos elegíveis:** Apenas blocos dos tipos `default`, `alert` e `quote` expõem a ação de geração. Blocos `user` e `code` não suportam áudio.
- **Conteúdo como fonte:** O texto enviado ao provedor TTS deve ser o conteúdo atual do bloco, sem marcações MDX ou tags de formatação.
- **Geração assíncrona:** A ação dispara o processamento em background; o operador pode continuar navegando enquanto o áudio é gerado.
- **Regeneração:** Se o bloco já possuir áudio, a ação substitui o arquivo anterior sem exigir remoção manual prévia.
- **Estado por bloco:** Cada bloco deve ter seu próprio estado de geração, independente dos demais: `idle`, `pending`, `error` ou `done`.

##### Regras de UI/UX
- **Localização:** O botão de geração deve estar dentro do card do bloco, visível quando o bloco estiver expandido.
- **Conteúdo mínimo:** O botão deve ficar desabilitado quando o bloco estiver com conteúdo vazio.
- **Feedback de erro:** Em caso de falha, o card deve indicar o estado de erro sem apagar o áudio anterior, se houver.

---

#### REQ-02 [Gerar áudio em lote para todos os blocos]

- [ ] **Gerar áudio em lote para todos os blocos**

**Descrição:** O editor deve oferecer uma ação para disparar a geração de áudio de todos os blocos elegíveis da história de uma vez.

##### Regras de Negócio
- **Blocos alvo:** A ação deve processar todos os blocos do tipo `default`, `alert` e `quote` presentes na lista.
- **Geração assíncrona:** O processamento ocorre em background; o operador não precisa aguardar na tela.
- **Estado individual preservado:** Cada bloco deve continuar exibindo seu próprio estado de geração durante e após o lote.
- **Regeneração inclusa:** Blocos que já possuem áudio também devem ter o áudio regenerado na ação em lote.
- **Blocos em andamento ignorados:** Blocos que já estiverem no estado `pending` no momento da ação em lote devem ser ignorados.

##### Regras de UI/UX
- **Localização da ação:** O botão de geração em lote deve estar no cabeçalho do painel de blocos, separado dos controles individuais.
- **Feedback imediato:** Ao acionar o lote, todos os cards elegíveis que não estiverem em `pending` devem entrar nesse estado imediatamente.

---

#### REQ-03 [Acompanhar o estado de geração via polling]

- [ ] **Acompanhar o estado de geração via polling**

**Descrição:** O editor deve consultar periodicamente o servidor para atualizar o estado de geração dos blocos pendentes e carregar o estado atual ao abrir a página.

##### Regras de Negócio
- **Carga inicial:** Ao abrir o editor, o sistema deve buscar o estado de áudio atual de cada bloco a partir do servidor.
- **Escopo do polling:** O polling deve ocorrer apenas enquanto houver pelo menos um bloco no estado `pending`.
- **Encerramento automático:** O polling deve parar quando todos os blocos saírem do estado `pending` (concluídos ou com erro).
- **Atualização de estado:** Ao receber a resposta, o sistema deve atualizar individualmente o estado de cada bloco retornado.

##### Regras de UI/UX
- **Indicador visual:** Blocos em estado `pending` devem exibir um spinner no lugar do player de áudio.
- **Sem bloqueio de edição:** O polling não deve impedir o operador de continuar editando o conteúdo dos blocos.

---

#### REQ-04 [Pré-visualizar o áudio gerado no card]

- [ ] **Pré-visualizar o áudio gerado no card**

**Descrição:** O editor deve exibir um player de áudio inline no card do bloco para que o operador escute o resultado antes de salvar.

##### Regras de Negócio
- **Disponibilidade:** O player deve aparecer apenas quando o bloco estiver no estado `done` e possuir um arquivo de áudio associado.
- **Atualização após regeneração:** Ao regenerar, o player deve refletir o novo arquivo automaticamente.

##### Regras de UI/UX
- **Player compacto:** Controles de play/pause e barra de progresso, sem ocupar área excessiva do card.
- **Posicionamento:** O player deve aparecer abaixo do campo de conteúdo, dentro do card expandido.

---

#### REQ-05 [Selecionar voz para geração do bloco]

- [ ] **Selecionar voz para geração do bloco**

**Descrição:** Antes de acionar a geração, o operador deve poder escolher qual voz será usada na narração do bloco.

##### Regras de Negócio
- **Lista fixa:** As vozes disponíveis são pré-definidas pelo sistema, sem possibilidade de cadastro ou remoção pelo operador.
- **Configuração por bloco:** Cada bloco mantém sua própria voz selecionada, independente dos demais.
- **Voz padrão:** O sistema deve ter uma voz pré-selecionada para novos blocos, evitando que o operador precise configurar manualmente em todos os casos.
- **Voz na geração em lote:** Na geração em lote, cada bloco deve usar a voz configurada individualmente no momento da ação.
- **Persistência da voz:** O identificador da voz selecionada deve ser salvo junto ao bloco no payload de salvamento.

##### Regras de UI/UX
- **Localização:** O seletor de voz deve estar dentro do card do bloco expandido, próximo ao botão de geração.
- **Feedback da seleção atual:** O seletor deve exibir o nome da voz atualmente escolhida.

---

### 3. Fluxo de Usuário

**Gerar áudio de um bloco individualmente:**

1. O operador acessa o editor de história de uma estrela no Studio.
2. O operador expande um card de bloco elegível (`default`, `alert` ou `quote`) com conteúdo preenchido.
3. O operador seleciona a voz desejada no seletor do card.
4. O operador aciona o botão de geração de áudio dentro do card.
5. O sistema dispara a geração em background e atualiza o estado do bloco para `pending`.
   - O card exibe o spinner imediatamente.
6. O polling consulta o servidor periodicamente:
   - **Concluído:** O estado do bloco passa para `done` e o player de áudio aparece no card.
   - **Erro:** O estado do bloco passa para `error` e o card exibe o feedback de falha.

---

**Gerar áudio em lote:**

1. O operador acessa o editor de história de uma estrela no Studio.
2. O operador configura a voz desejada individualmente nos blocos que quiser antes de acionar o lote.
3. O operador aciona o botão de geração em lote no cabeçalho do painel de blocos.
4. O sistema dispara a geração em background para todos os blocos elegíveis que não estejam em `pending` e atualiza o estado de cada um para `pending`.
   - Todos os cards elegíveis afetados exibem o spinner imediatamente.
5. O operador pode navegar livremente enquanto o processamento ocorre.
6. O polling consulta o servidor periodicamente e atualiza cada bloco individualmente:
   - **Concluído:** O estado do bloco passa para `done` e o player aparece no card.
   - **Erro:** O estado do bloco passa para `error` e o card exibe o feedback de falha.

---

**Pré-visualizar o áudio gerado:**

1. O operador expande um card de bloco no estado `done`.
2. O player de áudio está visível abaixo do campo de conteúdo.
3. O operador aciona o play e escuta a narração gerada.
4. O operador decide se mantém o áudio ou aciona regeneração.

---

### 4. Fora do Escopo

* Reprodução de áudio na Lesson Page do aluno (app `web`).
* Configuração do aluno para alternar entre reprodução automática e controle manual.
* Geração de áudio para blocos do tipo `user` e `code`.
* Remoção manual de arquivos de áudio pelo operador.
* Edição ou ajuste manual do arquivo de áudio gerado.
* Sincronização de áudio com markers de vídeo.
* Geração automática de áudio ao salvar os blocos.
* Gestão ou cadastro de novas vozes pelo operador.
