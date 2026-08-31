# PRD — Editor de código de desafio

- **Módulo:** `challenging`
- **Milestone:** [#13 — Editor de código de desafio](https://github.com/JohnPetros/stardust/milestone/13)
- **Status:** open
- **Atualizado em:** 2026-07-16T02:27:35Z

## Definição do produto

### 1. Visão Geral

O **Challenge Code Editor** é o ambiente de escrita e execução de código dentro da página de desafios da plataforma StarDust. Ele permite que o estudante escreva, edite e execute código na linguagem Delegua diretamente no navegador, recebendo feedback imediato sobre a correção da sua solução.

**Problema resolvido:** Sem um editor embutido, o usuário precisaria de ferramentas externas para escrever e testar código, quebrando o fluxo de aprendizado e a imersão na jornada gamificada.

**Objetivo:** Oferecer uma experiência de codificação integrada, fluida e acessível para que o usuário resolva desafios de lógica de programação sem sair da plataforma.

---

### 2. Requisitos

#### REQ-01 Escrita de Código

- [ ] **Escrita de Código**

**Descrição:** O editor fornece suporte completo à escrita de código na linguagem Delegua, com recursos de produtividade como highlighting, autocomplete e detecção de erros em tempo real.

##### Regras de Negócio

- **Código salvo por desafio:** O código digitado é salvo automaticamente por desafio, independente de autenticação ou conexão com o servidor, garantindo que o progresso não se perca ao recarregar a página ou trocar de aba.
- **Carregamento inicial:** Ao abrir um desafio, o editor carrega o último código salvo do usuário. Se não houver código salvo, carrega o código inicial do desafio.
- **Detector de erros condicional:** O verificador de erros em tempo real é desabilitado quando o desafio não envolve funções.

##### Regras de UI/UX

- **Syntax highlighting:** O editor exibe coloração de sintaxe para a linguagem Delegua (português).
- **Autocomplete:** Sugestões de auto-complete são exibidas conforme o usuário digita.
  - [x] Entregue em 2026-07-16: autocomplete Delegua ampliado com estruturas, palavras-chave, funções globais, métodos existentes e símbolos declarados no código aberto.
  - [x] Entregue em 2026-07-16: digitação e `Ctrl + Espaço` consultam o código atual do editor e preservam snippets com placeholders.
  - [x] Entregue em 2026-07-16: remontagens do editor não acumulam providers de hover/autocomplete.
  - [x] Entregue em 2026-07-16: seleções de texto podem ser envolvidas por aspas duplas, aspas simples e crase pela configuração da linguagem Delegua.
- **Documentação contextual:** Documentação é exibida ao passar o mouse sobre palavras-chave.
- **Detecção de erros:** Erros de sintaxe são destacados em tempo real no editor. A funcionalidade pode ser desativada pelo usuário nas configurações.

---

#### REQ-02 Ações da Toolbar

- [ ] **Ações da Toolbar**

**Descrição:** A toolbar oferece ações rápidas para controlar a execução, o estado do código e o acesso a recursos auxiliares.

##### Regras de Negócio

- **Reset com confirmação:** O reset de código exige confirmação explícita do usuário para evitar perda acidental de progresso.
- **Assistente IA restrito:** A ação de ativar o assistente IA está disponível apenas para usuários autenticados.

##### Regras de UI/UX

- **Executar:** Roda o código do usuário contra os casos de teste do desafio.
- **Resetar código:** Reverte o editor ao código original do desafio, com diálogo de confirmação prévia.
- **Desfazer:** Restaura o código ao estado anterior à última edição.
- **Consultar guias:** Abre a documentação da linguagem Delegua organizada por categorias.
- **Ver atalhos:** Lista todos os atalhos de teclado disponíveis.
- **Configurações:** Permite ajustar tamanho da fonte, tamanho do tab e ativar/desativar o detector de erros.
- **Ativar assistente IA:** Alterna a visibilidade do painel do assistente de IA.

---

#### REQ-03 Atalhos de Teclado

- [ ] **Atalhos de Teclado**

**Descrição:** O editor expõe atalhos de teclado para as ações mais frequentes, aumentando a produtividade do estudante.

##### Regras de UI/UX

- `Alt + Enter` — Executar código.
- `Ctrl + K` — Abrir guias da linguagem.
- `Ctrl + Z` — Desfazer última edição.
- `Ctrl + .` — Comentar/descomentar linhas selecionadas.
- `Ctrl + X` — Recortar/copiar linha.
- `Ctrl + L` — Selecionar linha.

---

#### REQ-04 Execução e Feedback

- [ ] **Execução e Feedback**

**Descrição:** Ao executar o código, o sistema valida a solução contra os casos de teste do desafio e fornece feedback imediato ao estudante.

##### Regras de Negócio

- **Bloqueio de `Leia()`:** A execução é bloqueada se o usuário remover os comandos de entrada (`Leia()`) necessários para os casos de teste. O aviso exibido é: *"Não mexa em nenhum comando Leia()!"*.
- **Redirecionamento pós-execução:** Ao executar, o usuário é redirecionado para a aba de Resultado com o feedback da validação dos casos de teste.

##### Regras de UI/UX

- **Erro de sintaxe ou execução:** O usuário recebe um aviso com a mensagem de erro e o número da linha problemática.
- **Som de falha:** Um som de falha é reproduzido quando a execução do código resulta em erro.

---

#### REQ-05 Console de Output

- [ ] **Console de Output**

**Descrição:** Exibe o output das chamadas `escreva()` em um painel de console (bottom sheet) após a execução do código, permitindo ao estudante inspecionar o resultado intermediário do seu programa.

##### Regras de Negócio

- **Abertura condicional:** O console abre automaticamente ao finalizar a execução somente se houver pelo menos um output de `escreva()`. Se a execução não produzir nenhum `escreva()`, o bottom sheet não abre automaticamente.
- **Limpeza por execução:** O output é limpo no início de cada nova execução.
- **Erros não exibidos no console:** Erros de execução ou sintaxe não são exibidos no console — permanecem exclusivamente no toast de erro.

##### Regras de UI/UX

- **Exibição de output:** Cada linha produzida por `escreva()` é exibida na ordem em que foi executada.
- **Abertura manual:** O usuário pode abrir e fechar o console manualmente a qualquer momento, independente de ter executado o código.
- **Responsividade:** Em desktop, o console é exibido como bottom sheet sobreposto ao editor, sem substituir as abas existentes. Em mobile, é exibido como bottom sheet nativo acessível via gesto ou botão.

---

#### REQ-06 Seleção de Código para Assistente IA

- [ ] **Seleção de Código para Assistente IA**

**Descrição:** Quando o assistente IA está ativo, o usuário pode selecionar trechos de código no editor para enriquecer o contexto enviado ao assistente.

##### Regras de Negócio

- **Requer assistente ativo:** O botão de seleção de código só aparece quando o assistente IA está habilitado, o que requer autenticação.

##### Regras de UI/UX

- **Botão flutuante:** Ao selecionar um trecho de código, um botão flutuante "Adicionar" aparece sobre o editor.
- **Envio de contexto:** Ao clicar no botão, o trecho selecionado é enviado como contexto para o assistente IA.
- **Comportamento do botão:** O botão desaparece ao clicar fora do editor ou ao realizar uma nova ação. Uma nova seleção reexibe o botão.

---

### 3. Fluxo de Usuário (User Flow)

**Fluxo principal — Resolver um desafio:**

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

**Fluxo alternativo — Resetar código:**

1. O usuário clica em "Resetar código" na toolbar.
2. Um diálogo de confirmação é exibido.
3. O usuário confirma:
   - **Confirma:** O editor reverte ao código inicial do desafio.
   - **Cancela:** O editor permanece inalterado.

---

**Fluxo alternativo — Usar assistente IA com seleção de código:**

1. O usuário autenticado ativa o assistente IA pela toolbar.
2. O painel do assistente aparece ao lado do editor (desktop) ou como aba (mobile).
3. O usuário seleciona um trecho de código no editor.
4. O botão flutuante "Adicionar" aparece sobre a seleção.
5. O usuário clica em "Adicionar": o trecho é enviado como contexto ao assistente.
6. O usuário digita sua pergunta e envia ao assistente.

---

### 4. Fora do Escopo (Out of Scope)

- Exibição de erros de execução no console de output (tratados exclusivamente via toast).
- Exibição do console em tempo real durante a digitação (somente após executar).
- Persistência de histórico de outputs entre execuções.
- Execução de código diretamente pelo console (modo REPL).
- Suporte a linguagens além de Delegua.
- Sincronização do código salvo entre dispositivos.
