# PRD — Agente assistente de código

- **Módulo:** `ai`
- **Milestone:** [#2 — Agente assistente de código](https://github.com/JohnPetros/stardust/milestone/2)
- **Status:** open
- **Atualizado em:** 2026-07-29T02:07:57Z

## Definição do produto

## 📍 Motivação

Usuários iniciantes na linguagem **Delégua** frequentemente encontram barreiras na resolução de desafios, seja por dúvidas de sintaxe ou dificuldades em estruturar o raciocínio lógico.

Para aumentar a retenção e o sucesso do aprendizado, precisamos introduzir um assistente inteligente. O objetivo desta task é preparar o terreno técnico, criando a inteligência do agente e a rota de comunicação, garantindo que o suporte pedagógico esteja disponível via API antes de partirmos para a interface visual.

## 🔍 Detalhes

Esta etapa foca exclusivamente na **infraestrutura e lógica do agente**, respeitando as seguintes premissas:

* **Abordagem Pedagógica:** O chatbot deve ser instruído (via System Prompt) a **jamais fornecer a resposta direta** de um desafio. Ele deve atuar como um mentor que guia o aluno.
* **Capacidades:**
* Exemplificar sintaxe de Delégua.
* Analisar e apontar erros lógicos/sintáticos em códigos fornecidos.
* **Formatação de Resposta (MDX):** O texto de retorno deve ser estruturado em parágrafos e utilizar widgets MDX. Trechos de código multiline devem obrigatoriamente retornar formatados para o widget `Code` com o modo de execução habilitada.
* **Documentação:** A criação do novo módulo deve ser devidamente registrada na **Wiki StarDust**.
* **Escopo:** **Não deve ser implementada nenhuma interface de usuário (UI)** nesta task. O objetivo é apenas o endpoint funcional e o módulo de IA.

## 💡 Sugestão de Implementação

### 1. Novo Módulo de Infraestrutura (`ai`)

* Criar um módulo centralizado chamado `ai` para concentrar toda a lógica de inteligência artificial.
* Este módulo deve encapsular as configurações do modelo, definição de *System Prompts* e quaisquer *tools* que o agente venha a utilizar.

### 2. Integração com Vercel AI SDK

* Utilizar o **Vercel AI SDK** pela facilidade de integração com o Next.js e suporte nativo a streaming de dados.
* Configurar o agente de modo que ele consiga compreender código Delégua. Use os guias de manual sobre o LSP para ser usado como contexto.

### 3. API Route / Controller (`web`)

* Expor um endpoint na aplicação `web` que aceite as mensagens do usuário.
* A rota deve utilizar a API de **streaming** do SDK para fornecer respostas em tempo real ao cliente.
* O controller deve ser "magro", delegando a construção da lógica e o processamento do prompt para o módulo de infraestrutura `ai`.
