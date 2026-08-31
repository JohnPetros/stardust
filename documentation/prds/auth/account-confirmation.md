# PRD — Confirmação de Conta

- **Módulo:** `auth`
- **Milestone:** [#35 — Confirmação de Conta](https://github.com/JohnPetros/stardust/milestone/35)
- **Status:** open
- **Atualizado em:** 2026-06-28T00:12:42Z

## Definição do produto

### 1. Visão Geral

A funcionalidade de Confirmação de Conta é a etapa exibida após o usuário confirmar o e-mail com sucesso.

Ela resolve o problema de sincronizar a autenticação da conta com a criação efetiva do perfil do usuário. Após a confirmação do e-mail, o sistema autentica o usuário, redireciona para a tela de confirmação de conta e aguarda a criação do perfil antes de permitir o acesso à página principal.

O objetivo principal é garantir que o usuário só avance para a experiência principal quando seu perfil estiver disponível, oferecendo feedback visual enquanto a criação ainda está pendente.

---

### 2. Requisitos

#### REQ-01 Confirmação de e-mail com autenticação

- [x] **Confirmar e-mail e autenticar conta**

**Descrição:** Ao acessar o endpoint de confirmação de e-mail com um token válido, o sistema confirma o cadastro, cria a sessão do usuário e redireciona para a tela de confirmação de conta.

##### Regras de Negócio

- **Token válido:** O sistema deve enviar o token para confirmação de e-mail.
- **Sessão autenticada:** Em caso de sucesso, o sistema deve definir os cookies de `accessToken` e `refreshToken`.
- **Redirecionamento pós-confirmação:** Após confirmação bem-sucedida, o usuário deve ser redirecionado para `/auth/account-confirmation`.
- **Token inválido ou erro:** Em caso de falha, o usuário deve ser redirecionado para `/auth/sign-in` com a mensagem de erro em query param.

##### Regras de UI/UX

- **Feedback de erro:** Erros de confirmação são exibidos no fluxo de login por meio da mensagem recebida via query param.
- **Confiabilidade:** O usuário não deve seguir para a tela de confirmação de conta se a confirmação do e-mail falhar.

#### REQ-02 Aguardar criação do perfil do usuário

- [x] **Exibir estado pendente enquanto o perfil não existir**

**Descrição:** Após a autenticação, a tela de confirmação deve verificar se o perfil do usuário já foi criado. Enquanto o perfil não existir, deve exibir um estado de carregamento.

##### Regras de Negócio

- **Conta autenticada sem perfil:** Quando a conta está autenticada, mas o perfil ainda não existe, o usuário deve permanecer na tela de confirmação.
- **Escuta realtime:** A tela deve escutar eventos de criação de usuário.
- **Validação por e-mail:** O evento realtime só deve ser considerado válido quando o e-mail do usuário criado for igual ao e-mail da conta autenticada.
- **Refetch do usuário:** Ao receber o evento correto, o sistema deve buscar novamente os dados do usuário.

##### Regras de UI/UX

- **Estado de loading:** Enquanto o perfil não existir, a tela deve exibir um indicador de carregamento.
- **Mensagem rotativa:** O sistema deve exibir mensagens leves de espera, como "Aquecendo os motores 🚀" e outras variações.
- **Layout centralizado:** O conteúdo deve permanecer centralizado na tela.
- **Feedback contínuo:** A tela deve comunicar que o processo ainda está em andamento, evitando uma página vazia.

#### REQ-03 Conclusão da criação do perfil

- [x] **Exibir sucesso quando o perfil for criado**

**Descrição:** Quando o perfil do usuário estiver disponível, a tela deve exibir uma mensagem de boas-vindas e permitir que o usuário vá para a página principal.

##### Regras de Negócio

- **Perfil disponível:** Quando o usuário existir no contexto de autenticação, o estado pendente deve ser encerrado.
- **Acesso liberado:** O usuário só deve receber a ação de avançar quando o perfil estiver criado.
- **Destino principal:** A ação principal deve levar o usuário para `/space`.

##### Regras de UI/UX

- **Mensagem de sucesso:** A tela deve exibir o título "Bem-vindo(a) 👋".
- **Subtítulo:** A tela deve informar "Seu perfil foi criado com sucesso!".
- **CTA principal:** A tela deve exibir o botão "Ir para a página principal".
- **Animação de transição:** Ao clicar no botão, o sistema deve exibir a animação de foguete antes de navegar para a página principal.
- **Performance:** A transição deve respeitar o delay da animação antes do redirecionamento.

#### REQ-04 Retry manual da criação de perfil

- [x] **Permitir nova tentativa quando o perfil não for criado**

**Descrição:** Se o perfil continuar indisponível após um período de espera, o sistema deve permitir que o usuário tente novamente a criação do perfil.

##### Regras de Negócio

- **Delay para retry:** O botão de tentativa deve aparecer após 7 segundos sem perfil criado.
- **Retry manual:** Ao clicar em "Tentar novamente", o sistema deve executar a ação de retry de criação do usuário via `POST /auth/sign-up/retry` no server, que republica o evento de cadastro.
- **Loading do retry:** Enquanto a ação estiver em execução, o botão deve exibir estado de carregamento.
- **Erro no retry:** Se a ação falhar, o sistema deve exibir uma mensagem de erro via toast.
- **Sucesso no retry:** Após sucesso, a conclusão ainda depende da criação/refetch do perfil.

##### Regras de UI/UX

- **Botão tardio:** O botão "Tentar novamente" não deve aparecer imediatamente, evitando ansiedade em processos rápidos.
- **Estado carregando:** O botão deve comunicar que a tentativa está em andamento.
- **Feedback de falha:** Falhas devem ser comunicadas por toast.
- **Confiabilidade:** A tela deve continuar em estado pendente até o perfil ser efetivamente encontrado.

#### REQ-05 Proteção de rotas para conta sem perfil

- [x] **Redirecionar conta autenticada sem perfil para confirmação**

**Descrição:** Quando uma conta autenticada tenta acessar uma rota privada sem possuir perfil carregado, o sistema deve redirecionar para a tela de confirmação de conta.

##### Regras de Negócio

- **Conta autenticada:** A regra só se aplica a contas autenticadas.
- **Perfil ausente:** A regra só se aplica quando não há usuário/perfil disponível.
- **Rotas privadas:** O redirecionamento não deve ocorrer em rotas públicas.
- **Evitar loop:** O redirecionamento não deve ocorrer se o usuário já estiver em `/auth/account-confirmation`.

##### Regras de UI/UX

- **Continuidade do fluxo:** O usuário deve ser levado automaticamente à tela correta caso tente acessar uma área privada sem perfil.
- **Confiabilidade:** A experiência principal não deve ser acessada sem perfil criado.

#### REQ-06 Acesso direto à tela de confirmação

- [ ] **Tratar acesso direto à página de confirmação**

**Descrição:** Quando a página `/auth/account-confirmation` for acessada diretamente em uma condição não prevista, a implementação atual tende a manter o usuário no estado de espera/retry.

##### Regras de Negócio

- **Conta ausente:** 🚧 Em construção. Não há comportamento explícito confirmado para usuário sem conta autenticada acessando a página diretamente.
- **Perfil ausente:** Caso não exista perfil, a tela permanece no estado pendente e exibe retry após 7 segundos.
- **Perfil existente:** Caso o perfil exista, a tela exibe a mensagem de sucesso e permite avançar para `/space`.

##### Regras de UI/UX

- **Estado padrão:** A página exibe loading e mensagens de espera quando não há usuário carregado.
- **Retry:** O botão "Tentar novamente" aparece após o delay configurado.
- **Assunção:** O fluxo esperado de entrada nessa página é via confirmação bem-sucedida de e-mail ou redirecionamento interno por conta autenticada sem perfil.

---

### 3. Fluxo de Usuário (User Flow)

**Confirmação de e-mail com sucesso:** Fluxo principal após cadastro por e-mail.

1. O usuário recebe o e-mail de confirmação de cadastro.
2. O usuário acessa o link de confirmação.
3. O sistema valida o token:
   - **Sucesso:** Define cookies de sessão e redireciona para `/auth/account-confirmation`.
   - **Falha:** Redireciona para `/auth/sign-in?error={mensagem}`.
4. A tela de confirmação verifica se o perfil já existe.
5. O sistema valida a existência do perfil:
   - **Sucesso:** Exibe mensagem de boas-vindas.
   - **Falha:** Exibe loading e mensagem de criação pendente.
6. Quando o perfil é criado, o sistema atualiza os dados do usuário.
7. O usuário clica em "Ir para a página principal".
8. O sistema exibe a animação de foguete.
9. O sistema redireciona para `/space`.

**Perfil ainda não criado:** Fluxo de espera e retry.

1. O usuário chega em `/auth/account-confirmation`.
2. O sistema identifica que a conta está autenticada, mas o perfil ainda não existe.
3. A tela exibe loading e mensagens rotativas.
4. O sistema aguarda evento realtime de criação do perfil.
5. Após 7 segundos sem perfil criado, o botão "Tentar novamente" aparece.
6. O usuário clica em "Tentar novamente".
7. O sistema executa a tentativa de criação do usuário via `POST /auth/sign-up/retry`:
   - **Sucesso:** Continua aguardando perfil criado/refetch.
   - **Falha:** Exibe toast de erro.
8. Quando o perfil fica disponível, a tela exibe a mensagem de sucesso.

**Redirecionamento por acesso a rota privada:** Fluxo de proteção.

1. O usuário autenticado tenta acessar uma rota privada.
2. O sistema verifica que não há perfil carregado.
3. O sistema valida se a rota não é pública e não é a própria tela de confirmação.
4. O usuário é redirecionado para `/auth/account-confirmation`.
5. A tela segue o fluxo de espera ou sucesso conforme existência do perfil.

---

### 4. Fora do Escopo (Out of Scope)

- Reenvio de e-mail de confirmação pela tela `/auth/account-confirmation`.
- Recuperação ou troca de senha.
- Cadastro social, exceto pela reutilização visual da mensagem de criação pendente.
- Edição de dados de perfil.
- Escolha manual de destino após confirmação.
- Definição formal de comportamento para acesso direto sem conta autenticada.
- Tela de erro definitiva após tempo máximo de espera.

---

### 5. Entregas Realizadas

- ✅ Suite Playwright completa com 10 cenários de integração cobrindo REQ-01 a REQ-05
- ✅ Migração do retry de criação de perfil para rota REST `POST /auth/sign-up/retry` no server
- ✅ Remoção do Inngest e RPC action do web — retry agora via REST
- ✅ Cobertura unitária e de integração do `RetryUserCreationController` no server
