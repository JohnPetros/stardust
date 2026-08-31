# PRD — Sign Up

- **Módulo:** `auth`
- **Milestone:** [#34 — Sign Up](https://github.com/JohnPetros/stardust/milestone/34)
- **Status:** open
- **Atualizado em:** 2026-06-17T22:23:31Z

## Definição do produto

### 1. Visao Geral

A pagina de cadastro do StarDust entrega agora um fluxo guiado e confiavel para criacao de conta no navegador, com validacao progressiva de nome, e-mail e senha, feedback imediato de erro e confirmacao final apenas quando o sistema reconhece a criacao real do usuario.

Tambem foi concluida a cobertura automatizada desse fluxo em navegador real, reduzindo risco de regressao nos pontos mais sensiveis da jornada de cadastro sem depender do backend real nem do realtime real.

---

### 2. Itens Entregues

- [x] Fluxo progressivo de cadastro com revelacao sequencial de nome, e-mail, senha e botao de envio.
- [x] Validacoes e mensagens de feedback preservadas para nome, e-mail e senha.
- [x] Submissao do cadastro integrada ao contrato existente de criacao de conta.
- [x] Sucesso final exibido apenas apos confirmacao do evento de criacao do usuario.
- [x] Eventos de outro usuario nao concluem o cadastro indevidamente.
- [x] Reenvio de e-mail de confirmacao com loading e feedback de sucesso/erro.
- [x] Link de navegacao para login mantido durante o formulario.
- [x] Suite automatizada de navegador real para a rota `/auth/sign-up`, coexistindo com os testes Jest ja existentes.

---

### 3. Impacto de Produto

- Menor risco de regressao no onboarding de novos usuarios.
- Maior confianca de que a experiencia real do navegador respeita o comportamento esperado de cadastro.
- Confirmacao mais segura do estado de sucesso, evitando concluir a jornada apenas pelo aceite HTTP inicial.
- Melhor previsibilidade para manutencoes futuras no fluxo de cadastro, com cobertura automatizada dos cenarios criticos.

---

### 4. Divergencias Relevantes

- Nenhuma divergencia de produto em relacao ao comportamento esperado da jornada de cadastro.
