# PRD — Criação de Usuário no Perfil

---

### 1. Visão Geral

- A funcionalidade cria o perfil interno de um novo usuário após a criação da conta.
- Ela resolve o problema de existir uma conta autenticada sem o estado inicial necessário para uso da plataforma gamificada.
- O objetivo principal é garantir que todo novo usuário comece com um perfil utilizável, já vinculado ao tier inicial, à primeira estrela desbloqueada e aos itens padrão obrigatórios.

---

### 2. Requisitos

#### REQ-01 [Criar perfil base do usuário]

- **Criar perfil base do usuário**

**Descrição:** O sistema deve criar um perfil de usuário no módulo `profile` a partir dos dados da conta recém-criada.

##### Regras de Negócio

- **Gatilho de criação:** A criação do perfil deve ocorrer após a conclusão do cadastro da conta.
- **Dados obrigatórios:** O perfil deve ser criado com identificador, nome e email do usuário.
- **Estado inicial do perfil:** O perfil deve nascer já associado ao tier inicial, ao avatar padrão selecionado e ao foguete padrão selecionado.
- **Persistência do perfil:** O perfil deve ser salvo como a referência principal do usuário dentro do módulo `profile`.

#### REQ-02 [Validar unicidade do perfil]

- **Validar unicidade do perfil**

**Descrição:** O sistema deve impedir a criação de perfis duplicados com os mesmos dados de identificação do usuário.

##### Regras de Negócio

- **Nome único:** O sistema não deve criar o perfil se já existir outro usuário com o mesmo nome.
- **Email único:** O sistema não deve criar o perfil se já existir outro usuário com o mesmo email.
- **Bloqueio da criação:** Em caso de conflito de nome ou email, a criação do perfil deve ser interrompida.

#### REQ-03 [Liberar progresso inicial]

- **Liberar progresso inicial**

**Descrição:** O sistema deve iniciar a jornada do usuário com progresso mínimo liberado para acesso ao conteúdo inicial.

##### Regras de Negócio

- **Primeira estrela:** O sistema deve desbloquear a primeira estrela disponível para o novo usuário.
- **Associação ao usuário:** O desbloqueio deve ser registrado no perfil do usuário recém-criado.
- **Sem duplicidade:** Se a primeira estrela já estiver desbloqueada para o usuário, o sistema não deve duplicar esse vínculo.

#### REQ-04 [Conceder itens padrão iniciais]

- **Conceder itens padrão iniciais**

**Descrição:** O sistema deve entregar ao novo usuário os itens cosméticos definidos como padrão para início de jornada.

##### Regras de Negócio

- **Itens adquiridos por padrão:** O sistema deve conceder todos os avatares e foguetes marcados como itens iniciais do usuário.
- **Custo inicial:** Os itens padrão devem ser concedidos sem custo para o usuário.
- **Item equipado no nascimento do perfil:** O avatar padrão selecionado e o foguete padrão selecionado devem permanecer como itens ativos do perfil inicial.

#### REQ-05 [Aplicar o mesmo onboarding a todo novo cadastro]

- **Aplicar o mesmo onboarding a todo novo cadastro**

**Descrição:** O provisionamento inicial do perfil deve acontecer independentemente da origem do cadastro da conta.

##### Regras de Negócio

- **Cadastro tradicional:** O fluxo deve criar o perfil quando a conta for criada por email e senha.
- **Cadastro social:** O fluxo deve criar o perfil quando a conta for criada por provedor social.
- **Consistência funcional:** Ambos os tipos de cadastro devem resultar no mesmo conjunto de dados iniciais no perfil.

---

### 3. Fluxo de Usuário (User Flow)

**Provisionamento inicial do perfil:** Fluxo principal para transformar uma conta recém-criada em um perfil jogável dentro da plataforma.

1. O usuário conclui o cadastro de conta por email e senha ou por login social.
2. O sistema recebe os dados básicos do novo usuário.
3. O sistema valida a criação do perfil:
   - **Sucesso:** O perfil é criado com tier inicial, avatar padrão, foguete padrão, primeira estrela desbloqueada e itens iniciais concedidos.
   - **Falha:** A criação do perfil é interrompida por conflito de nome/email ou por dependência inicial ausente.

**Disponibilização do perfil:** Fluxo de consumo do estado inicial do usuário após o cadastro.

1. O usuário finaliza o cadastro e tenta acessar a experiência principal da plataforma.
2. O sistema conclui a preparação do perfil inicial.
3. O sistema valida a disponibilidade do perfil:
   - **Sucesso:** O usuário encontra seu perfil já preparado para iniciar a jornada.
   - **Falha:** O perfil pode permanecer temporariamente indisponível ate a conclusao do provisionamento. Assunção: esse comportamento reflete a consistencia eventual observada na implementacao atual.

---

### 4. Fora do Escopo (Out of Scope)

- Escolha manual de avatar ou foguete durante o cadastro.
- Compra de itens pagos como parte do onboarding inicial.
- Definicao manual do tier inicial ou da estrela inicial por operador ou pelo usuario.
- Recuperacao automatica de provisionamento parcial como parte desta versao documentada.
