# PRD: Agente Assistente de Código (Manual)

## 1. Visão Geral

Usuários iniciantes na linguagem Delegua frequentemente encontram barreiras na
resolução de desafios, seja por dúvidas de sintaxe ou por dificuldade em
estruturar o raciocínio lógico.

Esta funcionalidade introduz um assistente inteligente com abordagem pedagógica,
atuando como mentor durante a resolução de desafios. O foco desta entrega é
disponibilizar o suporte via API (com resposta em tempo real) e registrar a
feature na documentação do projeto. Não há entrega de interface (UI) nesta
etapa.

---

## 2. Requisitos

### Assistente (Comportamento Pedagógico)

**Descrição:** O assistente deve orientar o usuário a chegar na resposta por
conta própria, sem entregar a solução final.

- [x] **Mentoria guiada:** Fazer perguntas, sugerir passos e ajudar a decompor o
      problema.
- [x] **Sem resposta direta:** Nunca fornecer o código completo que resolve o
      desafio.
- [x] **Foco no desafio:** Responder apenas quando a pergunta estiver
      relacionada ao desafio ou à linguagem Delegua.
- [x] **Apoio de sintaxe:** Explicar e exemplificar sintaxe de Delegua quando
      necessário.
- [x] **Análise de código:** Identificar e explicar possíveis erros lógicos e
      sintáticos em códigos fornecidos pelo usuário.
- [x] **Limites de certeza:** Quando faltar contexto suficiente, declarar que
      não consegue responder adequadamente.

#### Regras de Negócio

- **Idioma:** Responder sempre em PT-BR.
- **Somente Delegua:** Não sugerir código em outras linguagens.
- **Não expor informações internas:** Não mencionar identificadores internos do
  desafio.

---

### Formato da Resposta (Blocos de Texto)

**Descrição:** O retorno deve ser estruturado para renderização consistente no
produto.

- [x] **Parágrafos estruturados:** Organizar a resposta em parágrafos, com uso
      de blocos de texto quando fizer sentido.
- [x] **Destaques importantes:** Informações críticas (alertas, cuidados,
      pontos-chave) devem vir destacadas.
- [x] **Código multiline:** Trechos de código com mais de uma linha devem vir em
      um bloco dedicado de código.
- [x] **Código executável:** Quando enviar código, o bloco deve permitir que o
      usuário execute o exemplo.

##### Regras de Negócio

- **Sem formato técnico para o usuário:** Não mencionar termos como
  markdown/mdx.
- **Sem delimitadores de código comuns:** Evitar backticks e cercas de código;
  usar apenas o bloco de código previsto.

---

### Disponibilização via API (Streaming)

**Descrição:** O assistente deve estar disponível por uma rota de API que aceite
mensagens e retorne resposta em tempo real.

- [x] **Receber mensagens:** Aceitar uma pergunta do usuário vinculada a um chat
      e a um desafio.
- [x] **Responder em tempo real:** Enviar a resposta de forma progressiva
      (streaming) para melhorar a experiência.
- [x] **Histórico de conversa:** Utilizar o histórico do chat como contexto de
      conversa.
- [x] **Salvar mensagens:** Ao final, registrar a mensagem do usuário e a
      resposta final do assistente no histórico.

##### Regras de Negócio

- **Contexto do desafio:** Ajudar levando em conta o desafio atual, sem revelar
  informações internas.

---

### Limites e Tratamento de Erros

**Descrição:** Garantir confiabilidade e evitar abuso.

- [x] **Limite de uso:** Aplicar limite de mensagens do assistente para evitar
      uso excessivo.
- [x] **Erros de indisponibilidade/cota:** Se o serviço de IA estiver
      indisponível ou sem cota, retornar mensagem clara e orientar o usuário.
- [x] **Mensagens amigáveis:** Erros devem ser explicados de forma simples, sem
      detalhes técnicos.

---

### Edição do nome do chat

**Descrição:** O usuário deve ser capaz de alterar o nome do chat já existente.

#### Regras de Negócio

- [x] **Nome do chat:** O nome do chat deve ser mais que um caractere.
- [x] **Chat existente:** Apenas o chat existente pode ser alterado.

#### Regras de Interface

- [x] **Dialog de edição de nome:** O campo de edição do nome do chat deve estar
      disponível no histórico do chat para cada chat disponível, sendo um botão
      para abrir o campo de edição em um dialog. Ao editar, o dialog deve ser
      fechado em caso de erro ou sucesso.
- [x] **Feedback de resposta:** Toast de sucesso/erro ao alterar o nome do chat.

### Adição de texto e de código como contexto para o chat

**Descrição:** O usuário deve ser capaz de adicionar texto da descrição do
desafio e/ou código do editor de código do desafio ao chat

#### Regras de Negócio

- [x] Apenas um seleção de texto e uma seleção de código pode ser adicionado ao
      chat, ou seja não pode existir mais de um trecho de texto ou mais de um
      trecho de código.
- [x] os trechos de texto e código devem ser enviados juntos com a pergunta do
      usuário para o agente.
- [x] O trecho de código deve corresponder pelo menos uma linha inteira de
      código

#### Regras de Interface

- [x] Ao selecionar um trecho de texto ou código, o botão de adicionar o trecho
      deve aparecer acima da seleção.
- [x] Os trechos selecionados devem aparecer no chat como blocos de texto no
      campo de texto, sendo que se for um trecho código, deve aparecer no bloco
      "Linha - [número da linha inicial]-[número da linha final]". Se for um
      trecho de texto, deve aparecer no bloco um preview do texto com 500
      caracteres mais reticências do texto.
- [x] Ao descansar o mouse em cima de um bloco de seleção, deve aparecer um
      tooltip com o texto do bloco selecionado.
- [x] Cada tipo de seleção (texto ou código) deve ter seu próprio estilização no
      campo de pergunta do usuário: ícone de código em verde para trecho de
      código e ícone de texto em azul para trecho de texto.

---

### Responsividade do Chatbot (Mobile)

**Descrição:** O assistente deve estar disponível no mobile dentro do slider do desafio.

- [x] **Nova aba no slider:** Incluir a aba "Assistente" no slider do desafio em telas menores.
- [x] **Disponibilidade contínua:** A aba do assistente deve ficar sempre disponível no mobile.
- [x] **Desktop inalterado:** Manter o painel lateral existente no desktop, sem alterar o fluxo do chat.

---

## 3. Fluxo de Usuário (User Flow)

**Nome do fluxo:** Pedir ajuda ao assistente durante um desafio.

1. O usuário abre o assistente durante um desafio.
2. O usuário envia uma pergunta (podendo incluir um trecho de código).
3. O sistema responde em tempo real com orientações e exemplos.
4. O usuário ajusta seu código e continua tentando resolver o desafio.
5. O chat mantém histórico das mensagens para que o usuário retome o raciocínio.

---

## 4. Fora do Escopo (Out of Scope)

- Geração de solução completa do desafio.
- Funcionalidades avançadas de avaliação automática do código do usuário pelo
  assistente.
