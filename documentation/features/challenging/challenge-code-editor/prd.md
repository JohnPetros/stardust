# Challenge Code Editor — PRD

## 1. Visão Geral

O **Challenge Code Editor** é o ambiente de escrita e execução de código dentro da página de desafios da plataforma StarDust. Ele permite que o estudante escreva, edite e execute código na linguagem Delegua diretamente no navegador, recebendo feedback imediato sobre a correção da sua solução.

**Objetivo:** Oferecer uma experiência de codificação integrada, fluida e acessível para que o usuário resolva desafios de lógica de programação sem sair da plataforma.

**Problema resolvido:** Sem um editor embutido, o usuário precisaria de ferramentas externas para escrever e testar código, quebrando o fluxo de aprendizado e a imersão na jornada gamificada.

---

## 2. Requisitos

### RQ-01 Escrita de Código

* O editor exibe syntax highlighting para a linguagem Delegua (português).
* Sugestões de auto-complete são exibidas conforme o usuário digita.
* Documentação contextual é exibida ao passar o mouse sobre palavras-chave.
* Erros de sintaxe são destacados em tempo real no editor (funcionalidade desativável pelo usuário).
* O código digitado é salvo automaticamente por desafio, garantindo que o progresso não se perca ao recarregar a página ou trocar de aba.
* Ao abrir um desafio, o editor carrega o último código salvo do usuário. Se não houver, carrega o código inicial do desafio.

### RQ-02 Ações da Toolbar

* **Executar:** Roda o código do usuário contra os casos de teste do desafio.
* **Resetar código:** Reverte o editor ao código original do desafio, com confirmação prévia para evitar perda acidental.
* **Desfazer:** Restaura o código ao estado anterior à última edição.
* **Consultar guias:** Abre a documentação da linguagem Delegua organizada por categorias.
* **Ver atalhos:** Lista todos os atalhos de teclado disponíveis.
* **Configurações:** Permite ajustar tamanho da fonte, tamanho do tab e ativar/desativar o detector de erros.
* **Ativar assistente IA:** Disponível apenas para usuários autenticados. Alterna a visibilidade do painel do assistente de IA.

### RQ-03 Atalhos de Teclado

* `Alt + Enter` — Executar código.
* `Ctrl + K` — Abrir guias da linguagem.
* `Ctrl + Z` — Desfazer última edição.
* `Ctrl + .` — Comentar/descomentar linhas selecionadas.
* `Ctrl + X` — Recortar/copiar linha.
* `Ctrl + L` — Selecionar linha.

### RQ-04 Execução e Feedback

* Ao executar, o código é validado contra os casos de teste do desafio e o usuário é redirecionado para a tela de resultados.
* Se o código contiver erro de sintaxe ou execução, o usuário recebe um aviso com a mensagem de erro e o número da linha problemática.
* Se o usuário remover comandos `Leia()` (entradas obrigatórias do desafio), recebe o aviso: "Não mexa em nenhum comando Leia()!".
* Um som de falha é reproduzido quando a execução do código resulta em erro.

### RQ-05 Console de Output

* Ao clicar em "Executar", o output de cada chamada `escreva()` é exibido em um painel de console (bottom sheet), na ordem em que foi executado.
* O console abre automaticamente ao finalizar a execução **somente se** houver pelo menos um output de `escreva()`. Se não houver nenhum `escreva()`, o bottom sheet não abre automaticamente.
* O output é limpo no início de cada nova execução.
* O usuário pode abrir e fechar o console manualmente a qualquer momento, independente de ter executado o código.
* Erros de execução ou sintaxe **não são exibidos** no console — permanecem exclusivamente no toast de erro.

### RQ-06 Seleção de Código para Assistente IA

* Quando o assistente IA está ativo, o usuário pode selecionar trechos de código no editor.
* Ao selecionar, um botão flutuante "Adicionar" aparece sobre o editor.
* Ao clicar no botão, o trecho selecionado é enviado como contexto para o assistente IA.
* O botão desaparece ao clicar fora do editor ou ao realizar uma nova ação. Uma nova seleção reexibe o botão.

---

## 3. Layout e Responsividade

### Desktop

* O editor ocupa um painel lateral redimensionável ao lado das abas de conteúdo (descrição, comentários, soluções, resultado).
* O layout dos painéis pode ser invertido (editor à esquerda ou à direita) ou expandido para tela cheia.
* Quando o assistente IA é ativado, um terceiro painel aparece ao lado do editor.
* O console de output é exibido como bottom sheet sobreposto ao editor, sem substituir as abas existentes.

### Mobile

* O editor é apresentado como uma aba deslizável ("Código") em um carrossel com as abas: Descrição, Código, Resultado e Assistente.
* A fonte do editor é ligeiramente reduzida para melhor legibilidade em telas menores.
* O console de output é exibido como bottom sheet nativo, acessível via gesto ou botão.

---

## 4. Regras de Negócio

* O verificador de erros em tempo real é desabilitado quando o desafio não envolve funções.
* O código é salvo localmente por desafio, independente de autenticação ou conexão com o servidor.
* A execução é bloqueada se o usuário remover os comandos de entrada (`Leia()`) necessários para os casos de teste.
* O botão de seleção de código para o assistente IA só aparece quando o assistente está habilitado (requer autenticação).
* O reset de código exige confirmação explícita do usuário para evitar perda acidental de progresso.
* O console de output abre automaticamente apenas quando a execução produz ao menos um `escreva()`. Execuções sem output não abrem o console.
* Erros de execução são tratados exclusivamente via toast e não são exibidos no console de output.