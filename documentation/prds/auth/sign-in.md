# PRD — Sign In

- **Módulo:** `auth`
- **Milestone:** [#20 — Sign In](https://github.com/JohnPetros/stardust/milestone/20)
- **Status:** open
- **Atualizado em:** 2026-08-30T21:35:00Z

## Definição do produto

### 1. Visão Geral

- A funcionalidade permite que o usuário acesse sua conta no StarDust por e-mail e senha ou por provedores sociais.
- Ela resolve o problema de entrada na plataforma, oferecendo autenticação tradicional e social em um mesmo ponto de acesso.
- O objetivo principal é autenticar o usuário e direcioná-lo para a experiência principal da plataforma, incluindo o tratamento específico para contas sociais recém-criadas e para accounts sem perfil interno provisionado.

---

### 2. Requisitos

#### REQ-01 [Autenticar com e-mail e senha]

- [x] **Autenticar com e-mail e senha**

**Descrição:** O sistema deve permitir login com credenciais informadas manualmente na página de entrada.

##### Regras de Negócio

- **Campos obrigatórios:** O login deve exigir e-mail e senha.
- **Validação de formato:** O e-mail e a senha devem respeitar as validações definidas pelo formulário antes do envio.
- **Autenticação bem-sucedida:** Quando as credenciais forem válidas, o sistema deve autenticar a conta do usuário.
- **Perfil ausente após autenticação:** Quando as credenciais forem válidas mas o perfil interno do usuário não existir, o sistema deve autenticar a sessão e redirecionar para a page dedicada de criação de perfil.
- **Destino após login:** Após login com sucesso e perfil existente, o sistema deve redirecionar para `nextRoute` quando esse parâmetro estiver presente; caso contrário, deve redirecionar para a página principal da experiência autenticada.
- **Falha de autenticação:** Quando as credenciais forem inválidas, o sistema deve impedir o avanço do fluxo e informar o erro ao usuário.

##### Regras de UI/UX

- **Feedback de envio:** O formulário deve exibir estado de carregamento durante a tentativa de autenticação.
- **Feedback de erro:** O formulário deve exibir mensagens de erro de validação e de autenticação quando houver falha.

#### REQ-02 [Autenticar com conta social]

- [x] **Autenticar com conta social**

**Descrição:** O sistema deve permitir login usando provedores sociais suportados na página de entrada.

##### Regras de Negócio

- **Provedores disponíveis:** O login social deve estar disponível para Google e GitHub.
- **Início do fluxo:** Ao selecionar um provedor social, o usuário deve ser enviado ao fluxo de autenticação do provedor escolhido.
- **Retorno do provedor:** Após autenticação no provedor, o sistema deve concluir o retorno para a página de confirmação de conta social.
- **Conta social existente:** Quando a conta social já corresponder a um usuário previamente provisionado, o sistema deve autenticar a conta e seguir automaticamente para a página principal da experiência autenticada.
- **Conta social nova:** Quando a conta social representar um novo cadastro, o sistema deve seguir para o fluxo de confirmação e aguardar a criação do perfil antes de liberar a entrada do usuário.

##### Regras de UI/UX

- **Ação por provedor:** Cada provedor disponível deve ser acionável individualmente a partir da página de login.
- **Continuidade do fluxo:** O usuário não deve precisar reinserir credenciais locais após retornar do provedor social.

#### REQ-03 [Confirmar liberação de nova conta social]

- [x] **Confirmar liberação de nova conta social**

**Descrição:** O sistema deve tratar separadamente a primeira entrada de usuários autenticados por conta social quando o perfil ainda estiver sendo criado.

##### Regras de Negócio

- **Aguardar provisionamento:** Para uma nova conta social, o sistema deve aguardar a criação do perfil interno do usuário antes de concluir a entrada.
- **Confirmação de criação:** Quando a criação do perfil for concluída, o sistema deve informar que o perfil foi criado com sucesso.
- **Liberação manual do avanço:** Após a confirmação de sucesso, o usuário deve acionar a entrada para seguir à página principal da experiência autenticada.
- **Consistência do onboarding:** O fluxo deve garantir que a conta social nova receba o mesmo provisionamento inicial esperado para novos usuários da plataforma.

##### Regras de UI/UX

- **Estado pendente:** Enquanto o perfil estiver sendo criado, a interface deve manter um estado de espera visível.
- **Mensagem de sucesso:** Após a criação do perfil, a interface deve exibir uma confirmação clara de boas-vindas.
- **Ação final:** A interface deve oferecer uma ação explícita para entrar na página principal após a confirmação.

#### REQ-04 [Oferecer navegação auxiliar na entrada]

- [x] **Oferecer navegação auxiliar na entrada**

**Descrição:** A página de login deve permitir que o usuário siga para fluxos relacionados quando ainda não puder ou não quiser entrar com a conta atual.

##### Regras de Negócio

- **Recuperação de acesso:** O usuário deve conseguir acessar o fluxo de redefinição de senha a partir da página de login.
- **Criação de conta:** O usuário deve conseguir acessar o fluxo de cadastro a partir da página de login.
- **Disponibilidade contínua:** Os atalhos auxiliares devem permanecer disponíveis como alternativas ao login por credenciais.

---

### 3. Fluxo de Usuário (User Flow)

**Login com e-mail e senha:** Fluxo principal para usuários que já possuem credenciais locais.

1. O usuário acessa a página de login.
2. O usuário informa e-mail e senha.
3. O sistema valida as credenciais:
   - **Sucesso com perfil existente:** O usuário é autenticado e segue para `nextRoute`, quando existir, ou para a página principal autenticada.
   - **Sucesso com perfil ausente:** O sistema autentica a sessão e redireciona para a page dedicada de criação de perfil.
   - **Falha:** O sistema bloqueia a entrada e exibe a mensagem de erro correspondente.

**Login social com conta existente:** Fluxo para usuários que já possuem conta social associada e perfil disponível.

1. O usuário acessa a página de login.
2. O usuário escolhe Google ou GitHub.
3. O sistema valida o retorno da autenticação social:
   - **Sucesso:** A conta é autenticada e o usuário segue automaticamente para a página principal autenticada.
   - **Falha:** Assunção: o usuário não conclui a entrada e permanece dependente do tratamento de erro do fluxo de autenticação social.

**Login social com nova conta:** Fluxo para usuários cuja conta social ainda precisa concluir o provisionamento inicial.

1. O usuário acessa a página de login.
2. O usuário escolhe Google ou GitHub.
3. O sistema valida se a conta social corresponde a um novo cadastro:
   - **Sucesso:** O sistema aguarda a criação do perfil, confirma a liberação da conta e permite que o usuário siga para a página principal autenticada.
   - **Falha:** Assunção: a entrada não é concluída até que o provisionamento necessário da conta seja finalizado.

**Navegação auxiliar a partir da entrada:** Fluxo alternativo para usuários que precisam recuperar acesso ou criar conta.

1. O usuário acessa a página de login.
2. O usuário seleciona criar conta ou redefinir senha.
3. O sistema valida a opção escolhida:
   - **Sucesso:** O usuário é levado ao fluxo correspondente.
   - **Falha:** 🚧 Em construção.

---

### 4. Fora do Escopo (Out of Scope)

- Cadastro completo de nova conta por e-mail e senha.
- Execução do fluxo de redefinição de senha em si.
- Execução do fluxo de criação de perfil em si (tratado na page dedicada).
- Conexão ou desconexão de contas sociais para usuários já autenticados em área logada.
- Suporte a provedores sociais além de Google e GitHub.

#### Descartado durante a implementação

- Nenhum item descartado foi confirmado durante o levantamento retrospectivo.

---

### 5. Atualizacao da entrega (2026-06-17)

- A jornada publicada de entrada por e-mail e senha em `/auth/sign-in` passou a ter validacao automatizada de navegador para renderizacao inicial, validacao de formulario, sucesso de autenticacao, falha de autenticacao e navegacao auxiliar.
- Os contratos publicos dos acessos sociais Google e GitHub ficaram protegidos por teste automatizado, reduzindo risco de regressao no direcionamento para a confirmacao de conta social.
- O redirecionamento de usuario ja autenticado ao acessar a entrada com `nextRoute` ficou coberto de forma deterministica, reduzindo risco de regressao no retorno para a experiencia correta apos autenticacao.
- Nenhuma divergencia de produto foi identificada em relacao ao comportamento esperado do milestone; a entrega desta etapa consolidou cobertura e confiabilidade do fluxo ja especificado.
