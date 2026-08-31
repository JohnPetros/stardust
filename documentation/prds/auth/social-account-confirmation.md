# PRD — Confirmação de Conta Social

- **Módulo:** `auth`
- **Milestone:** [#37 — Confirmação de Conta Social](https://github.com/JohnPetros/stardust/milestone/37)
- **Status:** open
- **Atualizado em:** 2026-06-15T22:12:27Z

## Definição do produto

### 1. Visão Geral

A funcionalidade de **Confirmação de Conta Social** é a tela exibida após o usuário iniciar autenticação social via Google ou GitHub.

Ela resolve o período intermediário entre o retorno do provedor social e a disponibilidade completa do perfil do usuário dentro da aplicação. O objetivo principal é garantir que:

- Contas sociais existentes sejam autenticadas e redirecionadas para a aplicação.
- Novas contas sociais aguardem a criação do perfil de usuário.
- O usuário receba feedback visual enquanto a criação está pendente.
- O usuário possa tentar novamente a criação do perfil caso o evento esperado não chegue.

---

### 2. Requisitos

#### REQ-01 Autenticar conta social a partir dos tokens retornados

- [ ] **Autenticar conta social a partir dos tokens retornados**

**Descrição:** A tela deve processar os tokens retornados pelo provedor social para concluir o login/cadastro social.

##### Regras de Negócio

- **Leitura dos tokens:** O sistema deve ler `access_token` e `refresh_token` do hash da URL.
- **Execução única:** O fluxo de autenticação social deve ser executado apenas uma vez por carregamento da página.
- **Tokens obrigatórios:** Se `access_token` ou `refresh_token` estiverem ausentes, o fluxo de autenticação social não deve ser iniciado.
- **Conta existente:** Se o backend indicar que a conta social já existe, o usuário deve ser considerado criado/autenticado imediatamente.
- **Nova conta:** Se o backend indicar que se trata de uma nova conta, a tela deve permanecer em estado de espera até receber confirmação de criação do usuário.

##### Regras de UI/UX

- **Estado inicial:** Enquanto o processamento ocorre, a tela deve exibir loading e mensagem de espera.
- **Feedback:** A tela deve manter o usuário informado de que a criação/autenticação está em andamento.
- **Confiabilidade:** Quando tokens estiverem ausentes, o comportamento visual específico ainda deve ser documentado como lacuna de produto, pois não há mensagem explícita observada para esse cenário.

---

#### REQ-02 Exibir estado pendente para nova conta social

- [ ] **Exibir estado pendente para nova conta social**

**Descrição:** Quando a autenticação social resultar em uma nova conta, o sistema deve aguardar a criação do perfil do usuário antes de permitir avanço para a aplicação.

##### Regras de Negócio

- **Conta nova pendente:** Quando `isNewAccount` for verdadeiro, o usuário deve permanecer em estado pendente até que a criação do usuário seja confirmada.
- **Confirmação por evento:** A criação do usuário deve ser reconhecida quando o sistema receber um evento realtime de criação de usuário cujo e-mail corresponda ao e-mail da conta autenticada.
- **Correspondência por e-mail:** O evento só deve confirmar a criação se `userEmail` for igual ao e-mail da conta atual.

##### Regras de UI/UX

- **Loading:** A tela deve exibir indicador de carregamento enquanto o usuário está pendente.
- **Mensagens rotativas:** A tela deve exibir mensagens de espera em sequência, como “Aquecendo os motores 🚀” e frases similares.
- **Acessibilidade:** 🚧 Em construção. Não há evidência suficiente na implementação observada para definir regras específicas de navegação por teclado ou contraste além dos componentes existentes.
- **Performance:** O estado pendente deve ser exibido sem bloquear a interface.

---

#### REQ-03 Confirmar criação do perfil de usuário

- [ ] **Confirmar criação do perfil de usuário**

**Descrição:** Quando o perfil do usuário for criado, a tela deve informar sucesso e permitir que o usuário avance para a página principal.

##### Regras de Negócio

- **Usuário criado:** O sistema deve marcar o usuário como criado após receber o evento realtime correspondente.
- **Liberação de avanço:** Após a criação do usuário, a tela deve deixar de exibir o estado de loading e mostrar uma mensagem de boas-vindas.
- **Navegação para aplicação:** Ao clicar no botão principal, o usuário deve ser levado para a rota principal da aplicação (`/space`).

##### Regras de UI/UX

- **Mensagem de sucesso:** A tela deve exibir o título “Bem-vindo(a) 👋”.
- **Subtítulo:** A tela deve exibir “Seu perfil foi criado com sucesso!”.
- **CTA:** A tela deve exibir o botão “Ir para a página principal”.
- **Animação:** Ao avançar, deve ser exibida uma animação de foguete antes da navegação para a página principal.
- **Feedback:** O botão deve representar claramente a ação de entrada na aplicação.

---

#### REQ-04 Redirecionar conta social existente

- [ ] **Redirecionar conta social existente**

**Descrição:** Quando o login social pertence a uma conta já existente, o usuário não precisa aguardar criação de perfil.

##### Regras de Negócio

- **Conta existente:** Se `isNewAccount` for falso, o sistema deve considerar o usuário pronto para acessar a aplicação.
- **Animação automática:** Para conta existente, a animação de foguete deve ser acionada automaticamente.
- **Destino final:** Após a animação, o usuário deve ser direcionado para `/space`.

##### Regras de UI/UX

- **Transição:** A tela deve usar a animação de foguete como transição visual para a aplicação.
- **Sem confirmação manual:** Para conta existente, não é necessário exibir botão de confirmação antes do redirecionamento.

---

#### REQ-05 Permitir tentativa de recriação do usuário

- [ ] **Permitir tentativa de recriação do usuário**

**Descrição:** Se a criação do perfil de uma nova conta não for confirmada rapidamente, o usuário deve ter uma opção para tentar novamente.

##### Regras de Negócio

- **Atraso para retry:** O botão “Tentar novamente” deve aparecer após 7 segundos em estado pendente.
- **Ocultação do retry:** O botão deve ser ocultado quando o usuário deixar de ser uma nova conta pendente ou quando o usuário for criado.
- **Nova tentativa:** Ao clicar em “Tentar novamente”, o sistema deve solicitar nova tentativa de criação do usuário.
- **Dependência do evento:** Mesmo após retry, a conclusão do fluxo depende da chegada do evento realtime de criação do usuário.

##### Regras de UI/UX

- **Botão de retry:** O botão deve ter o texto “Tentar novamente”.
- **Estado de loading:** Ao acionar o retry, o botão deve exibir estado de carregamento enquanto a ação estiver em andamento.
- **Feedback:** A tela não exibe mensagem visual específica de sucesso do retry; a confirmação ocorre quando o evento de criação do usuário chega.

---

#### REQ-06 Tratar falhas e exceções conhecidas

- [ ] **Tratar falhas e exceções conhecidas**

**Descrição:** O PRD deve explicitar os cenários de erro que fazem parte do comportamento esperado ou das lacunas conhecidas do fluxo.

##### Regras de Negócio

- **Tokens ausentes:** Se os tokens não estiverem presentes na URL, o fluxo não é iniciado.
- **Falha na autenticação social:** Caso o cadastro/login social falhe, o comportamento observado não apresenta mensagem específica nessa tela.
- **Falha no realtime:** Se o evento realtime de criação de usuário não chegar, o usuário permanece em estado pendente e recebe a opção de retry.
- **Retry:** O retry republica a tentativa de criação, mas não garante avanço imediato sem confirmação posterior.

##### Regras de UI/UX

- **Erro visual:** 🚧 Em construção. Não há evidência de mensagem visual específica na tela para falha de tokens ou falha de autenticação social.
- **Fallback:** O fallback observado para ausência de confirmação realtime é o botão “Tentar novamente”.
- **Confiabilidade:** O fluxo depende da confirmação assíncrona da criação do usuário.

---

### 3. Fluxo de Usuário (User Flow)

**Login social com conta existente:** Usuário retorna do provedor social e acessa a aplicação.

1. O usuário clica em “Entrar com Google” ou “Entrar com GitHub”.
2. O usuário é redirecionado para o provedor social.
3. O provedor retorna para `/auth/social-account-confirmation` com `access_token` e `refresh_token`.
4. O sistema processa os tokens.
5. O backend informa que a conta já existe.
6. O sistema marca o usuário como criado.
7. A animação de foguete é exibida.
8. O usuário é redirecionado para `/space`.

**Login social com nova conta:** Usuário retorna do provedor social e aguarda criação do perfil.

1. O usuário clica em “Entrar com Google” ou “Entrar com GitHub”.
2. O usuário é redirecionado para o provedor social.
3. O provedor retorna para `/auth/social-account-confirmation` com `access_token` e `refresh_token`.
4. O sistema processa os tokens.
5. O backend informa que é uma nova conta.
6. A tela exibe loading e mensagens rotativas de espera.
7. O sistema aguarda evento realtime de criação do usuário.
8. O sistema valida o e-mail do evento:
   - **Sucesso:** O e-mail do evento corresponde ao e-mail da conta atual; a tela exibe mensagem de boas-vindas e botão para ir à página principal.
   - **Falha:** O evento não chega ou não corresponde; o usuário permanece em espera.
9. Se a criação for confirmada, o usuário clica em “Ir para a página principal”.
10. A animação de foguete é exibida.
11. O usuário é redirecionado para `/space`.

**Retry de criação de usuário:** Usuário tenta novamente quando a criação demora.

1. O usuário permanece na tela de espera como nova conta.
2. Após 7 segundos, o sistema exibe o botão “Tentar novamente”.
3. O usuário clica no botão.
4. O sistema exibe estado de loading no botão.
5. O sistema solicita nova tentativa de criação do usuário.
6. O sistema continua aguardando o evento realtime:
   - **Sucesso:** A tela exibe mensagem de boas-vindas.
   - **Falha:** O usuário permanece em estado pendente.

**Tokens ausentes ou inválidos:** Fluxo não iniciado.

1. O usuário acessa `/auth/social-account-confirmation` sem `access_token` ou sem `refresh_token`.
2. O sistema não inicia o fluxo de autenticação social.
3. 🚧 Em construção: não há comportamento visual específico confirmado para orientar o usuário nesse cenário.

---

### 4. Fora do Escopo (Out of Scope)

- Criação ou alteração dos provedores sociais disponíveis além de Google e GitHub.
- Redesenho completo da autenticação social.
- Definição de arquitetura técnica do realtime ou da fila de criação de usuário.
- Criação de uma milestone oficial de produto.
- Mensagens detalhadas de erro para tokens ausentes ou falhas de autenticação social, salvo como lacuna documentada.
- Fluxos de conexão/desconexão de conta social dentro das configurações de perfil.
