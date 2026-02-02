# PRD: Agente Assistente de Codigo (Manual)

## 1. Visao Geral

Usuarios iniciantes na linguagem Delegua frequentemente encontram barreiras na
resolucao de desafios, seja por duvidas de sintaxe ou por dificuldade em
estruturar o raciocinio logico.

Esta funcionalidade introduz um assistente inteligente com abordagem pedagogica,
atuando como mentor durante a resolucao de desafios. O foco desta entrega e
disponibilizar o suporte via API (com resposta em tempo real) e registrar a
feature na documentacao do projeto. Nao ha entrega de interface (UI) nesta
etapa.

---

## 2. Requisitos Funcionais

### Assistente (Comportamento Pedagogico)

**Descricao:** O assistente deve orientar o usuario a chegar na resposta por
conta propria, sem entregar a solucao final.

- [x] **Mentoria guiada:** Fazer perguntas, sugerir passos e ajudar a decompor o
      problema.
- [x] **Sem resposta direta:** Nunca fornecer o codigo completo que resolve o
      desafio.
- [x] **Foco no desafio:** Responder apenas quando a pergunta estiver
      relacionada ao desafio ou a linguagem Delegua.
- [x] **Apoio de sintaxe:** Explicar e exemplificar sintaxe de Delegua quando
      necessario.
- [x] **Analise de codigo:** Identificar e explicar possiveis erros logicos e
      sintaticos em codigos fornecidos pelo usuario.
- [x] **Limites de certeza:** Quando faltar contexto suficiente, declarar que
      nao consegue responder adequadamente.

##### Regras de Negocio

- **Idioma:** Responder sempre em PT-BR.
- **Somente Delegua:** Nao sugerir codigo em outras linguagens.
- **Nao expor informacoes internas:** Nao mencionar identificadores internos do
  desafio.

---

### Formato da Resposta (Blocos de Texto)

**Descricao:** O retorno deve ser estruturado para renderizacao consistente no
produto.

- [x] **Paragrafos estruturados:** Organizar a resposta em paragrafos, com uso
      de blocos de texto quando fizer sentido.
- [x] **Destaques importantes:** Informacoes criticas (alertas, cuidados,
      pontos-chave) devem vir destacadas.
- [x] **Codigo multiline:** Trechos de codigo com mais de uma linha devem vir em
      um bloco dedicado de codigo.
- [x] **Codigo executavel:** Quando enviar codigo, o bloco deve permitir que o
      usuario execute o exemplo.

##### Regras de Negocio

- **Sem formato tecnico para o usuario:** Nao mencionar termos como
  markdown/mdx.
- **Sem delimitadores de codigo comuns:** Evitar backticks e cercas de codigo;
  usar apenas o bloco de codigo previsto.

---

### Disponibilizacao via API (Streaming)

**Descricao:** O assistente deve estar disponivel por uma rota de API que aceite
mensagens e retorne resposta em tempo real.

- [x] **Receber mensagens:** Aceitar uma pergunta do usuario vinculada a um chat
      e a um desafio.
- [x] **Responder em tempo real:** Enviar a resposta de forma progressiva
      (streaming) para melhorar a experiencia.
- [x] **Historico de conversa:** Utilizar o historico do chat como contexto de
      conversa.
- [x] **Salvar mensagens:** Ao final, registrar a mensagem do usuario e a
      resposta final do assistente no historico.

##### Regras de Negocio

- **Contexto do desafio:** Ajudar levando em conta o desafio atual, sem revelar
  informacoes internas.

---

### Limites e Tratamento de Erros

**Descricao:** Garantir confiabilidade e evitar abuso.

- [x] **Limite de uso:** Aplicar limite de mensagens do assistente para evitar
      uso excessivo.
- [x] **Erros de indisponibilidade/cota:** Se o servico de IA estiver
      indisponivel ou sem cota, retornar mensagem clara e orientar o usuario.
- [x] **Mensagens amigaveis:** Erros devem ser explicados de forma simples, sem
      detalhes tecnicos.

---

### Edição do nome do chat

**Descricao:** O usuário deve ser capaz de alterar o nome do chat já existente.

#### Regras de Negocio

- [x] **Nome do chat:** O nome do chat deve ser mais que um caractere.
- [x] **Chat existente:** Apenas o chat existente pode ser alterado.

#### Regras de Interface

- [x] **Dialog de edição de nome:** O campo de edição do nome do chat deve estar
      disponível no histórico do chat para cada chat disponível, sendo um botão
      para abrir o campo de edição em um dialog. Ao editar, o dialog deve ser
      fechado em caso de erro ou sucesso.
- [x] **Feedback de resposta:** Toast de sucesso/erro ao alterar o nome do chat.

### Adição de texto e de código como contexto para o chat

**Descricao:** O usuário deve ser capaz de adicionar texto da descrição do
desafio e/ou código do editor de código do desagio ao chat

#### Regras de Negocio

- [ ] Apenas um seleção de texto e uma seleção de código pode ser adicionado ao
      chat, ou seja não pode existir mais de um trecho de texto ou mais de um
      trecho de código.
- [ ] os trechos de texto e código devem ser enviados juntos com a pergunta do
      usuário para o agente.
- [ ] O trecho de código deve corresponder pelo menos uma linha inteira de
      código

#### Regras de Interface

- [ ] Ao selecionar um trecho de texto ou código, o botão de adicionar o trecho
      deve aperecer acima da seleção.
- [ ] Os trechos selecionados devem aparecer no chat como blocos de texto no
      campo de texto, sendo que se for um trecho código, deve aparecer no bloco
      "Linha - [númro da linha inicial]-[número da linha final]". Se for um
      trecho de texto, deve aparecer no bloco um preview do texto com 500
      caracteres mais redicencias do texto.
- [ ] Ao descansar o mouse em cima de um bloco de seleção. deve aparecer um
      tooltip com o texto do bloco selecionado.
- [ ] Cada tipo de seleção (texto ou código) deve ter seu próprio estilização no
      campo de pergunta do usuário: icone de código em verde para trecho de
      código e icone de texto em azul para trecho de texto.

---

## 3. Fluxo de Usuario (User Flow)

**Nome do fluxo:** Pedir ajuda ao assistente durante um desafio.

1. O usuario abre o assistente durante um desafio.
2. O usuario envia uma pergunta (podendo incluir um trecho de codigo).
3. O sistema responde em tempo real com orientacoes e exemplos.
4. O usuario ajusta seu codigo e continua tentando resolver o desafio.
5. O chat mantem historico das mensagens para que o usuario retome o raciocinio.

---

## 4. Fora do Escopo (Out of Scope)

- Geracao de solucao completa do desafio.
- Funcionalidades avancadas de avaliacao automatica do codigo do usuario pelo
  assistente.
