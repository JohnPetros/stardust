# PRD — Redefinição de Senha

- **Módulo:** `auth`
- **Milestone:** [#36 — Redefinição de Senha](https://github.com/JohnPetros/stardust/milestone/36)
- **Status:** open
- **Atualizado em:** 2026-06-24T00:14:04Z

## Definição do produto

### 1. Visão Geral

A funcionalidade de **Redefinição de Senha** permite que usuários recuperem o acesso à conta quando esquecem a senha.

O fluxo implementado permite que o usuário:

- Solicite um e-mail de redefinição informando seu e-mail cadastrado.
- Acesse o link recebido por e-mail.
- Confirme a autorização temporária para redefinir a senha.
- Defina uma nova senha.
- Seja redirecionado para login após a redefinição bem-sucedida.

O objetivo principal é oferecer um fluxo seguro e simples de recuperação de conta, evitando exposição indevida sobre existência de e-mails cadastrados.

---

### 2. Requisitos

#### REQ-01 Solicitar e-mail de redefinição

- [x] **Solicitar e-mail de redefinição**

**Descrição:** O usuário deve conseguir informar seu e-mail para receber um link de redefinição de senha.

##### Regras de Negócio

- **Validação de e-mail:** O sistema deve validar se o valor informado tem formato de e-mail válido.
- **Solicitação de reset:** Ao enviar um e-mail válido, o sistema deve solicitar o envio do link de redefinição.
- **Mensagem genérica de sucesso:** Quando a solicitação for processada com sucesso, o sistema deve exibir mensagem genérica: “Enviamos um e-mail para você redefinir sua senha (se seu e-mail estiver cadastrado, claro)”.
- **Proteção contra enumeração:** O sistema não deve confirmar explicitamente se o e-mail existe ou não na base.
- **Erro de envio:** Caso a solicitação falhe, o sistema deve exibir mensagem de erro: “Erro ao enviar e-mail de redefinição de senha”.

##### Regras de UI/UX

- **Tela inicial:** Quando o usuário não possui autorização temporária de reset, deve visualizar o formulário de solicitação de e-mail.
- **Campo de e-mail:** Deve apresentar label “E-mail”, placeholder `seu@email.com` e foco automático.
- **CTA:** O botão principal deve exibir “Enviar e-mail”.
- **Loading:** Durante o envio, o botão deve indicar carregamento.
- **Link auxiliar:** A tela deve oferecer link para login com o texto “Já tem uma conta? Faça login”.
- **Feedback:** Erros de validação devem aparecer junto ao campo de e-mail.

---

#### REQ-02 Confirmar autorização de redefinição

- [x] **Confirmar autorização de redefinição**

**Descrição:** O usuário deve acessar o link recebido por e-mail para receber permissão temporária de redefinição de senha.

##### Regras de Negócio

- **Token de confirmação:** O sistema deve confirmar o token recebido no link de redefinição.
- **Autorização temporária:** Após confirmação bem-sucedida, o sistema deve habilitar a redefinição de senha por tempo limitado.
- **Duração da permissão:** A permissão temporária observada na implementação dura 15 minutos.
- **Sessão temporária:** Após confirmação do token, o sistema mantém tokens necessários para executar a redefinição da senha.
- **Token inválido ou expirado:** Se a confirmação falhar, o sistema deve remover a permissão temporária e redirecionar o usuário para login com indicação de erro.

##### Regras de UI/UX

- **Redirecionamento com sucesso:** O usuário deve ser levado para a tela de redefinição de senha.
- **Redirecionamento com falha:** O usuário deve ser levado para a tela de login com erro.
- **Indexação:** A página de redefinição não deve ser indexada por mecanismos de busca.

---

#### REQ-03 Definir nova senha

- [x] **Definir nova senha**

**Descrição:** Quando autorizado, o usuário deve conseguir informar e confirmar uma nova senha.

##### Regras de Negócio

- **Acesso condicionado:** O formulário de nova senha só deve ser exibido quando houver permissão temporária de redefinição.
- **Senha obrigatória:** O usuário deve informar uma nova senha válida.
- **Confirmação obrigatória:** O usuário deve confirmar a nova senha.
- **Senhas iguais:** A confirmação deve ser igual à nova senha. Caso contrário, o sistema deve exibir: “as senhas devem ser iguais”.
- **Política de senha:** A nova senha deve seguir a política global de senha da aplicação. Assunção: os critérios específicos são definidos pela validação compartilhada do produto.
- **Tokens obrigatórios:** A redefinição depende dos tokens temporários gerados após a confirmação do link.
- **Erro ao redefinir:** Caso a redefinição falhe, o sistema deve exibir: “Erro de redefinição, escolha outra senha”.
- **Sucesso:** Após redefinir a senha com sucesso, o sistema deve encerrar a sessão temporária.

##### Regras de UI/UX

- **Estado autorizado:** Quando a permissão temporária existe, a tela deve exibir a mensagem “Você já pode redefinir sua senha 🚀!”.
- **CTA autorizado:** A tela deve exibir o botão “Redefinir senha”.
- **Diálogo de senha:** Ao clicar no botão, o usuário deve ver um diálogo com o título “Insira sua nova senha”.
- **Campos:** O formulário deve conter os campos “Nova senha” e “Confirme sua nova senha”.
- **Feedback de validação:** Erros devem aparecer junto aos campos correspondentes.
- **Loading:** Durante o envio da nova senha, o botão deve indicar carregamento.
- **Sucesso:** Após redefinição bem-sucedida, o sistema deve exibir mensagem de sucesso: “Você redefiniu sua senha com sucesso!”.
- **Próxima ação:** A mensagem de sucesso deve oferecer o botão “Fazer login”.

---

#### REQ-04 Finalizar fluxo e retornar ao login

- [x] **Finalizar fluxo e retornar ao login**

**Descrição:** Após concluir a redefinição, o usuário deve retornar ao login para acessar a conta com a nova senha.

##### Regras de Negócio

- **Limpeza de credenciais temporárias:** Ao finalizar o fluxo, o sistema deve remover tokens de acesso, refresh token e permissão temporária de redefinição.
- **Redirecionamento final:** Após a limpeza, o usuário deve ser redirecionado para a tela de login.
- **Fechamento do diálogo:** Se o diálogo de sucesso for fechado, o usuário também deve ser redirecionado para login.

##### Regras de UI/UX

- **Mensagem pós-sucesso:** O usuário deve ser informado que será redirecionado para fazer login com a nova senha.
- **CTA final:** O botão final deve comunicar claramente a próxima etapa: “Fazer login”.

---

### 3. Fluxo de Usuário

**Solicitação de redefinição:**

1. O usuário acessa a tela de redefinição de senha.
2. O sistema verifica se existe permissão temporária de redefinição.
3. Se não houver permissão, o sistema exibe o formulário de e-mail.
4. O usuário informa o e-mail cadastrado.
5. O usuário clica em “Enviar e-mail”.
6. O sistema valida o e-mail:
   - **Sucesso:** solicita o envio do link e exibe mensagem genérica de sucesso.
   - **Falha:** exibe erro de validação ou erro de envio.

**Confirmação do link:**

1. O usuário acessa o link recebido por e-mail.
2. O sistema valida o token de redefinição:
   - **Sucesso:** cria permissão temporária e redireciona para a tela de redefinição.
   - **Falha:** remove permissão temporária e redireciona para login com erro.

**Definição da nova senha:**

1. O usuário acessa a tela com permissão temporária ativa.
2. O sistema exibe mensagem indicando que a senha já pode ser redefinida.
3. O usuário clica em “Redefinir senha”.
4. O sistema abre o diálogo de nova senha.
5. O usuário informa a nova senha e a confirmação.
6. O sistema valida os dados:
   - **Sucesso:** redefine a senha, encerra a sessão temporária e exibe mensagem de sucesso.
   - **Falha:** exibe erro de validação ou erro de redefinição.

**Retorno ao login:**

1. Após sucesso, o usuário clica em “Fazer login” ou fecha o diálogo.
2. O sistema remove credenciais temporárias.
3. O sistema redireciona o usuário para login.

---

### 4. Fora do Escopo

- Alteração de senha para usuário já autenticado dentro da área logada.
- Login automático após redefinir a senha.
- Redefinição de senha por código digitado manualmente na tela.
- Reenvio automático do link de redefinição.
- Exibição detalhada da política de senha na interface.
- Confirmação explícita de que um e-mail está ou não cadastrado.
- Recuperação de conta por provedores sociais.
