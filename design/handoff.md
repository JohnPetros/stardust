# Handoff — migração Drizzle/SSE do onboarding

Contrato offline da revisão 6 de `documentation/features/global/supabase-replacement-with-drizzle/spec.md`, Issue #602. Autoria em 2026-10-01; nenhuma UI foi implementada ou validada no navegador nesta etapa.

## Fonte e precedência

`design/stardust.pen` existe. Pencil falhou ao enumerar nodes; nenhum Node ID, nome de frame, dimensão de node ou screenshot canônico foi verificado. Inventário de nodes: **nenhum validado**. A ausência foi aprovada no grilling (D-06). Não inventar nodes nem substituir a UI por uma aproximação. Para esta entrega, preservar a implementação existente das três Views de auth e os componentes/tokens que elas consomem.

Fonte/decisões aprovadas, Architecture/Rules alinhadas e Spec prevalecem sobre este handoff. Este documento não autoriza produto ou redesenho. Pencil indisponível não comprova alinhamento visual; browser futuro deve confirmar a preservação nos viewports abaixo. Se surgir referência Pencil divergente, requer decisão/amendment antes de alterar o contrato.

## Superfícies, receitas e tokens

| Surface | Composição atual a preservar | Crosswalk e comportamento |
| --- | --- | --- |
| Cadastro | Shell `h-screen`, fundo fixo `z-[-5]` com `brightness-[0.25]`; AnimatedOpacity delay0.5 envolve Animation rocket-exploring, size full, loop. Main flex centralizado, w/h full. Bloco formulário w24rem, pt12, título centralizado; link login mt6. | Reutilizar Title, SignUpForm, Link, Button e componentes globais. Inputs progressivos e validação existentes. AnimatedOpacity delay2 nas alternativas formulário/sucesso. Não recriar campos ou tema. |
| Sucesso cadastro | Coluna centralizada ocupando altura, texto verde400, font-medium, text-lg/text-md, text-center; Button resend mt6 com loading atual. | Mesmo texto e `sign-up-success-message`; não transformar API signup201 em sucesso visual sem perfil. EventSource é invisível. |
| Confirmação email | RocketAnimation com ref/isVisible; AnimatePresence; main flex h/w full items/justify-center. Sucesso AppMessage com título/subtítulo existentes e botão w72 para /space. | Button go-to-space-button; enquanto pendente Loading + UserCreationPendingMessage, retry mt8/w72 após7s. Não alterar JSX, ícones ou sequência visual para trocar transporte. |
| Confirmação social | Mesmo RocketAnimation/AnimatePresence e main centralizado. Nova conta com perfil pronto usa AppMessage/CTA w72; existente mantém auto redirect. | Loading/pending/retry existentes. Hash tokens tratados uma vez; sucesso novo depende de perfil refetched. |
| Pending existente | UserCreationPendingMessage usa BlurText de quote; delay200; text-center, text-lg, text-gray500; animação completa atual controla quote. | Reutilizar componente inteiro sem novas quotes/assets. Retomada signup o coloca no shell atual com Loading, sem mostrar campos de senha restaurados. |

Tokens Tailwind `green-400`, `gray-500`, `font-medium`, `text-lg`, `text-md`, `w-72`, `mt-6`, `mt-8`, `pt-12`, `brightness-[0.25]` mantêm o significado atual no tema. Fontes, borders, radius, estados de Button/inputs, cores de fundo e elevação vêm dos componentes globais existentes, sem valores alternativos locais. Ícones/assets: rocket do Title, rocket-exploring e RocketAnimation atuais; não gerar nem substituir arte. Componentes são as receitas canônicas, não cópias de markup.

Responsividade: viewports de validação390×844 e1440×900. Manter centralização/hierarquia; w24rem do formulário deve caber no viewport com margens atuais, sem overflow. Adaptação semântica/reflow é permitida sem alterar densidade/composição. Preservar labels, input types, data-testid, foco/teclado e mensagens acessíveis existentes; não colocar segredo/estado de transporte em texto visível. Loading e pending seguem os componentes atuais; não criar novo sistema de layout/tema.

## Matriz offline de referências

| Referência / Node | Estado e variante | Viewport / rota | Dimensões/anchors | Evidência e vínculo |
| --- | --- | --- | --- | --- |
| SignUpPage atual; sem node validado | Formulário email; pending novo/retomado; sucesso | 390×844 /1440×900; /auth/sign-up | Shell full viewport; formulário24rem, pt12; sucesso centralizado; não há dimensão Pencil conhecida. | Pencil/screenshot de fonte: indisponível. Browser futuro screenshots caminho feliz; retomada/renderização em cobertura automatizada; RF-07/RF-11, CA-14/21, VM-01, EV-07/11. |
| AccountConfirmation atual; sem node validado | Email: espera, welcome/CTA | Mesmos viewports; /auth/account-confirmation | Main full centralizado; CTA/retry18rem; RocketAnimation atual. | Pencil: indisponível. Browser futuro screenshot welcome e navegação /space; RF-08/RF-11, CA-16/21, VM-02, EV-08/11. |
| SocialAccountConfirmation atual; sem node validado | Nova conta: espera→welcome; existente: redirect | Mesmos viewports; /auth/social-account-confirmation | Main full centralizado; CTA/retry18rem; RocketAnimation atual. | Pencil: indisponível. Playwright automatizado com ServerMock captura screenshot do sucesso novo e URL protegida existente; RF-08/RF-11, CA-17/21, EV-08. Sem smoke manual social conforme D-07. |

Nenhum screenshot runtime existe nesta autoria. Screenshots futuros são evidência Web, não substitutos de nodes Pencil. Para fontes sem node validado, comparação esperada é preservação dessas receitas/componentes; não registrar comparação Pencil fictícia.

## Extensão aprovada e estados sem referência

Retomada de tentativa válida após reload é estado novo aprovado: usar Loading e UserCreationPendingMessage já existentes no shell signup; não re-enviar signup, nem persistir/restaurar senha. Tentativa já concluída usa sucesso atual. Expiração volta ao formulário, sem cancelar conta/email. Erros/loading/retry/reconexão são cobertos automatizadamente; smoke manual exercita somente o caminho feliz, conforme AGENTS. Não criar texto, modal ou novo frame de erro sem amendment.

A implementação mantém Entry Point/View/Hook: Entry Point injeta Auth/Onboarding/Toast; Hook resolve estado e habilita port ProfileChannel; View renderiza props. SignUpForm e Views de confirmação permanecem inalterados. Contextos Rest/Realtime são composition roots não visuais; o port não carrega estado de widget.

## Validação futura

Playwright CLI com Web3000/Server3334 e variáveis exportadas da .env.local raiz. Em VM-01/02, observar resultado principal, screenshots da UI alterada e endpoints essenciais2xx, sem logs de payload/credenciais. Não explorar manualmente erro/loading/recovery. /space deve demonstrar sessão persistida com /auth/account200 e /space/planets2xx. Testes automatizados mantêm o ambiente testing3100 separado.

Revisão 2: por solicitação expressa do usuário, cadastro/confirmação social não exige validação manual; renderização/transições permanecem nos testes automatizados. VM-03 retirada, sem renumerar os demais IDs. VM-02 usa o Mailpit local: abrir a mensagem enviada pelo Supabase Auth, seguir o link de confirmação na Web local e navegar para /space com sessão válida. Não registrar OTP/token, link completo ou corpo da mensagem. Testes Server obtêm link/token hash pela API local do Mailpit; a suíte Web testing3100 continua usando ServerMock.

Revisão 3: retomada/saída/reload são verificadas automaticamente em EV-07; VM-01 exercita somente o cadastro feliz e VM-02 segue a mesma jornada pelo Mailpit. Nenhuma inspeção de erro/recovery é adicionada ao smoke manual.

Revisão 4: reorganização interna Drizzle conforme referência Scoops adaptada a StarDust; nenhum amendment visual ou de interação. Viewports, receitas, Mailpit e cobertura manual/automatizada permanecem os mesmos.

Revisão 5: consulta de prontidão por UsersRepository/DrizzleUsersRepository existentes, sem Reader separado; nenhuma alteração visual ou de interação.

Revisão 6: discriminante de DatabaseAccess renomeado para user, mantendo accountId; nenhuma alteração visual ou de interação.
