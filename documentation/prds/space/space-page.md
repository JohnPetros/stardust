---
title: Trilha e Espaço
status: draft
source:
  - type: direct-request
    ref: Sessão de reformulação da trilha do Stardust; entendimento confirmado em 2026-10-11.
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/11
last_updated_at: 2026-10-11
---

# PRD — Trilha e Espaço

Disponibiliza para: space, lesson e challenging; organização da trilha, estados de progresso, ponto de continuidade e acesso autorizado ao conteúdo das estrelas.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

O Espaço é a página de progressão da trilha de aprendizagem do Stardust para alunos autenticados. Cada planeta representa um tema e cada estrela representa uma história ou um desafio de código. A conclusão segue a ordem da trilha: uma estrela libera a seguinte e a conclusão de um planeta libera o próximo.

A experiência deve mostrar onde continuar, o que já foi concluído e o que ainda está bloqueado. O aluno deve poder consultar detalhes, abrir conteúdo liberado e voltar ao ponto atual sem percorrer novamente todo o mapa.

Esta revisão é prospectiva: substitui a descrição anterior da Página de Espaço por regras para a reformulação aprovada. Preserva o caminho canônico e os IDs RP-01 a RP-07, com atualização explícita de seus comportamentos. Não declara que os novos desenhos ou regras já estejam implementados.

O MVP inclui mapa, progressão, estados, detalhes e navegação desktop/mobile. Autoria no Studio, funcionamento interno das histórias, avaliação das questões, recompensas e novos roteiros pedagógicos ficam fora desta entrega.

## 2. Problema e Oportunidade

A descrição anterior orientava o aluno pela última estrela desbloqueada e encaminhava ao conteúdo diretamente pelo clique. A reformulação precisa distinguir disponibilidade de conclusão, expor o tipo de conteúdo e permitir consultar detalhes antes de entrar na história ou no desafio.

A oportunidade é tornar a sequência pedagógica compreensível: identificar o próximo conteúdo, entender os bloqueios e revisar o que já foi concluído. O valor está na orientação de continuidade, sem personalizar a ordem da trilha.

Pesquisa competitiva não é material para esta revisão: as decisões decorrem da experiência atual e das escolhas confirmadas na sessão. Não são feitas afirmações de mercado.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | documentation/prds/space/space-page.md, revisão de 2026-10-11 | Autoridade canônica versionada; esta revisão substitui o conteúdo anterior de 2026-02-28. |
| S2 | Pedido direto e decisões registradas em 2026-10-11 | Regras de progressão, hover desktop, painel inferior mobile e recuperação de falha. |
| S3 | [Consolidação da sessão](../../../design/trilha-consolidacao.md) | Registro auxiliar das decisões e fronteiras entre PRDs. |
| S4 | [Sistema de design](../../design.md) | Tokens e convenções visuais. |
| S5 | [Gerenciamento do Espaço](space-management-planets-and-stars.md) e [Página de Lição](../lesson/lesson-page.md) | Contexto administrativo e de conteúdo; não ampliam o escopo. |
| S6 | SpacePage, StarView, useStar, SpaceContext, UnlockStarUseCase e GetNextStarUseCase, consultados via CodeGraph | Evidência auxiliar do comportamento existente; não substitui as decisões prospectivas. |

Esta revisão não define a lista final de planetas, roteiros, valores de recompensas ou quantidade obrigatória de estrelas.

## 3. Público-alvo

- **Principal:** alunos autenticados que estudam programação pela trilha do Stardust.
- **Secundário:** alunos que retornam para consultar conteúdo concluído.
- **Não público desta entrega:** autores e administradores configurando o catálogo, visitantes sem sessão e usuários de desafios independentes fora da trilha.
- **Contexto:** primeira visita, retomada dos estudos e retorno após concluir uma história ou desafio; uso em desktop e mobile.

Jobs to Be Done:

- Quando volto a estudar, quero encontrar a próxima estrela, para continuar sem procurar manualmente meu ponto de progresso.
- Quando consulto o mapa, quero distinguir histórias, desafios e bloqueios, para entender a sequência de aprendizagem.
- Quando preciso revisar um conceito, quero acessar uma estrela concluída, para consultar seu conteúdo sem alterar minha progressão.

## 4. Objetivos e Métricas de Sucesso

| Objetivo do produto | Métrica aprovada | Significado da medição |
| --- | --- | --- |
| Apoiar a progressão da aprendizagem | Taxa de conclusão de estrelas e planetas, preservada como KPI do PRD anterior; sem meta numérica aprovada | Acompanhar conclusão, sem atribuir causalidade ao redesenho sem análise adicional. |
| Tornar o ponto de continuidade identificável | Nenhuma meta quantitativa adicional aprovada | Validar que entrada, destaque e FAB apontam para a mesma estrela. |
| Permitir acesso e revisão sem violar bloqueios | Nenhuma meta quantitativa adicional aprovada | Validar navegação liberada, revisão e impedimento de acesso bloqueado. |

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Revisão prospectiva; desenhos não comprovam implementação | A futura Spec deve validar comportamento real e comparação visual. |
| Desbloqueada não significa concluída | Usar conclusão confirmada, não apenas acesso liberado, nos estados e contadores. |
| Catálogo e progresso vêm das áreas responsáveis | A página não cria conclusões nem atribui recompensas por interação visual. |
| Não foi aprovado reset de progresso ou migração de catálogo | Alterações de dados e reestruturação de conteúdo exigem escopo próprio. |
| Não há metas numéricas novas | Não inventar metas ou exigir novos eventos de analytics nesta entrega. |
| Detalhes mobile apresentados em painel inferior | A experiência mobile não deve usar expansão dos detalhes abaixo da estrela. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Planeta | Tema da trilha; contém estrelas em ordem. |
| Estrela | Unidade de progressão; contém uma história ou um desafio de código. |
| Bloqueada | Não pode ser iniciada; falta cumprir o requisito de progressão. |
| Disponível | Pode ser iniciada e ainda não está concluída. |
| Concluída | Tem conclusão confirmada e permanece acessível para revisão. |
| Estrela atual | Primeira estrela ainda não concluída na ordem da trilha, respeitando o acesso liberado. |
| Detalhes | Consulta contextual; não conclui nem desbloqueia uma estrela. |
| Conclusão de planeta | Todas as suas estrelas foram concluídas; libera o próximo planeta. |

#### RP-01 — Carregamento da trilha e recuperação

Necessidades do usuário:

- Como aluno, quero carregar o mapa e meu progresso, para saber onde continuar.

Resultado: catálogo e progresso apresentados com estados de carregamento, vazio e falha distinguíveis.

Atores: aluno autenticado.

##### Regras de Negócio

- A página deve apresentar o catálogo destinado ao aluno na ordem oficial de planetas e estrelas, junto ao progresso confirmado da conta.
- A apresentação do mapa não pode depender da existência de uma referência de estrela atual.
- Falha ao obter catálogo ou progresso não pode ser interpretada como trilha vazia, progresso zerado ou conclusão total.
- Sem conteúdo no catálogo, deve ser apresentado um estado vazio, sem destino de continuidade nem início de conteúdo inexistente.
- Uma falha deve permitir tentar novamente a consulta, sem modificar progresso.

##### Regras de Experiência

- Durante o carregamento, a página deve indicar que os dados estão sendo obtidos.
- Falhas devem exibir mensagem compreensível e “Tentar novamente”.
- O estado vazio deve informar que não há conteúdo disponível na trilha.
- Erros não devem expor detalhes internos da aplicação ao aluno.

#### RP-02 — Identificação do ponto de continuidade

Necessidades do usuário:

- Como aluno, quero reconhecer a primeira estrela ainda não concluída, para retomar a sequência correta.

Resultado: referência de continuidade coerente com a ordem e o progresso.

Atores: aluno autenticado.

##### Regras de Negócio

- A referência deve ser a primeira estrela ainda não concluída na ordem de planetas e estrelas, e não a última desbloqueada por definição.
- A referência não pode liberar uma estrela bloqueada pelo progresso.
- Para um aluno sem conclusões, a referência deve ser a primeira estrela da trilha.
- Se todas as estrelas estiverem concluídas, não deve existir indicação de conteúdo pendente; aplica-se RP-06.
- Sem referência válida, a página não deve executar reposicionamento para elemento inexistente nem inventar progresso.

##### Regras de Experiência

- A estrela atual deve ser reconhecível pelo destaque e pelos estados do mapa.
- A distinção entre estrela atual e estrela consultada para revisão deve permanecer clara.
- O foguete indicador de posição deve preservar a identidade atual da aplicação.

#### RP-03 — Entrada orientada e FAB de reposicionamento

Necessidades do usuário:

- Como aluno, quero voltar rapidamente à estrela atual, para continuar depois de explorar o mapa.

Resultado: entrada e reposicionamento orientados pela referência de RP-02.

Atores: aluno autenticado.

##### Regras de Negócio

- Ao entrar no Espaço, a visualização deve se posicionar na estrela atual quando existir referência válida e acessível.
- O aluno deve poder explorar o mapa sem reposicionamento automático contínuo.
- O FAB existente deve retornar à estrela atual e permanecer oculto enquanto ela estiver visível; ao sair da área visível, deve permitir reposicionamento.
- A direção do ícone deve corresponder à posição relativa do destino, preservando o comportamento contextual existente.
- Revisar uma estrela anterior não deve mudar a referência de continuidade.

##### Regras de Experiência

- O FAB deve manter a aparência atual; não deve existir um segundo botão “Minha posição”.
- O rótulo acessível deve identificar a ação de voltar à estrela atual.
- Scroll e reposicionamento devem permanecer utilizáveis sem depender de animação.
- O FAB não deve impedir o uso das ações do painel de detalhes no mobile.

#### RP-04 — Acesso autorizado e revisão de conteúdo

Necessidades do usuário:

- Como aluno, quero abrir conteúdo liberado e revisar conteúdo concluído, para estudar respeitando a progressão.

Resultado: navegação para a história ou desafio correto, com acesso validado.

Atores: aluno autenticado.

##### Regras de Negócio

- Estrelas disponíveis e concluídas devem permitir acesso ao conteúdo.
- Estrelas bloqueadas não devem permitir navegação, inclusive por acesso direto à URL.
- O destino deve corresponder ao tipo real da estrela: história ou desafio de código.
- Falha ao resolver o destino não deve trocar silenciosamente o tipo do conteúdo nem ser tratada como conclusão; o aluno deve poder repetir a tentativa.
- Abrir detalhes ou conteúdo não deve marcar a estrela como concluída.
- Revisão não deve apagar progresso nem desbloquear estrelas adicionais.
- Recompensas e critérios de conclusão pertencem às áreas responsáveis, não à consulta do mapa.

##### Regras de Experiência

- A ação deve corresponder ao conteúdo e estado: começar história ou desafio, ou revisar uma estrela concluída.
- Bloqueios devem mostrar a condição de liberação no mapa, sem depender apenas da cor.
- Feedback de navegação não deve simular sucesso quando o conteúdo não puder ser aberto.

#### RP-05 — Mapa, identidade visual e estados de progresso

Necessidades do usuário:

- Como aluno, quero distinguir planetas, estrelas e estados, para compreender o que concluí e o que vem a seguir.

Resultado: mapa legível com tipo, ordem e estado de cada estrela.

Atores: aluno autenticado.

##### Regras de Negócio

- A interface deve usar “planeta” e “estrela”.
- Cada estrela deve mostrar nome, numeração, tipo e estado: disponível, concluída ou bloqueada.
- Cada planeta deve mostrar estrelas concluídas em relação ao total; uma estrela apenas liberada não deve contar como concluída.
- Estrelas recém-liberadas podem preservar a indicação existente de novidade, sem substituir os estados de progressão.

##### Regras de Experiência

- O mapa deve apresentar sequência vertical e trilha pontilhada, com trecho desbloqueado amarelo e bloqueado cinza.
- Devem ser preservados o Lottie atual `unlocked-star`, a numeração central e o desenho atual da estrela bloqueada, que usa SVG.
- Planeta bloqueado deve manter sua ilustração com opacidade reduzida, conforme o design, em vez de ser substituído por círculo com cadeado.
- Rótulos devem distinguir tipo e estado com ícones e texto: concluída em verde, disponível com destaque amarelo e bloqueada com aparência discreta e legível.
- A sidebar deve preservar o componente atual; ícones inativos permanecem legíveis e o item ativo recebe destaque verde.
- Tokens canônicos devem orientar os componentes; assets mantêm suas cores originais.

#### RP-06 — Encerramento da trilha concluída

Necessidades do usuário:

- Como aluno que concluiu a trilha, quero reconhecer a conquista e manter acesso ao conteúdo, para consultar o que aprendi.

Resultado: trilha concluída sem indicação falsa de próxima estrela pendente.

Atores: aluno autenticado com conclusão total confirmada.

##### Regras de Negócio

- Conclusão total deve depender da conclusão confirmada de todas as estrelas, não de scroll, seleção ou visita à última estrela.
- Estrelas concluídas devem continuar acessíveis para revisão.
- Deve ser preservado o acesso existente ao encerramento/agradecimentos.
- Sem estrela pendente, o FAB não deve apontar para uma próxima estrela inexistente.

##### Regras de Experiência

- Conclusão total deve ser comunicada de forma compreensível no mapa.
- O encerramento deve permanecer distinguível das ações de revisão.
- Celebrações de conclusão de história, streak e nível pertencem à área de resultado e não são redesenhadas por este requisito.

#### RP-07 — Qualidade, responsividade e acessibilidade

Necessidades do usuário:

- Como aluno, quero utilizar o mapa no meu dispositivo e com recursos de acessibilidade, para navegar sem depender de mouse ou animações.

Resultado: navegação e estados compreensíveis em desktop e mobile.

Atores: aluno autenticado usando mouse, toque, teclado ou tecnologia assistiva.

##### Regras de Negócio

- Desktop e mobile devem usar as mesmas regras de progresso e acesso.
- A ordem pedagógica não pode mudar conforme o dispositivo.
- A página não deve adicionar integrações externas de recomendação ou novas regras de recompensa.

##### Regras de Experiência

- Mapa e detalhes devem caber na largura disponível sem scroll horizontal necessário para leitura ou ações.
- Ações habilitadas devem permitir teclado, foco visível e nomes acessíveis; bloqueios e progresso devem ser comunicados além da cor.
- Animações de entrada devem começar em `opacity: 0` e terminar visíveis, sem manter conteúdo oculto nem atrasar desnecessariamente o acesso.
- Preferência por movimento reduzido deve permitir o mesmo resultado sem exigir animação.
- Scroll, carregamento e interação devem permanecer responsivos nos navegadores suportados; limites técnicos e verificações pertencem à futura Spec.

#### RP-08 — Progressão ordenada entre estrelas e planetas

Necessidades do usuário:

- Como aluno, quero avançar em uma sequência de conceitos, para construir conhecimento antes do conteúdo seguinte.

Resultado: liberação sequencial baseada em conclusões confirmadas.

Atores: aluno autenticado; áreas de histórias e desafios que confirmam conclusão.

##### Regras de Negócio

- Cada estrela deve conter uma história ou um desafio de código; quizzes independentes não integram a nova organização.
- A primeira estrela do primeiro planeta deve iniciar a sequência acessível.
- Concluir uma estrela deve liberar a seguinte no mesmo planeta.
- Concluir todas as estrelas de um planeta deve liberar o seguinte e sua primeira estrela, quando existir conteúdo seguinte.
- Visitar, selecionar ou revisar uma estrela não deve liberar conteúdo novo.
- Repetir uma confirmação de conclusão não deve produzir um segundo avanço para além da estrela seguinte.
- Ao retornar ao Espaço após conclusão confirmada, estados e ponto de continuidade devem refletir o progresso atualizado.
- Esta revisão não autoriza apagar progresso nem executar migração de catálogo; mudanças assim exigem escopo próprio.

##### Regras de Experiência

- Conclusão confirmada deve atualizar o estado da estrela e o contador do planeta.
- A condição de bloqueio deve informar que é necessário concluir o conteúdo anterior.
- O retorno ao Espaço não deve abrir automaticamente a próxima estrela.

#### RP-09 — Consulta de detalhes no desktop e mobile

Necessidades do usuário:

- Como aluno, quero consultar uma estrela antes de abri-la, para decidir entre continuar ou revisar.

Resultado: detalhes contextuais acessíveis, sem concluir conteúdo por consulta.

Atores: aluno autenticado.

##### Regras de Negócio

- Estrelas disponíveis e concluídas devem permitir consulta de detalhes.
- Os detalhes devem identificar estrela, tipo, descrição e ação compatível com o estado. Recompensas exibidas devem vir da área responsável; este PRD não define seus valores.
- Estrela consultada e estrela atual devem permanecer conceitos distintos.
- Bloqueadas devem informar sua condição no mapa, sem abrir fluxo de conteúdo ou revisão.

##### Regras de Experiência

- No desktop, hover sobre estrela habilitada deve apresentar detalhes ao lado do mapa; foco por teclado deve oferecer consulta equivalente.
- A passagem do ponteiro entre estrela e painel não deve impedir acesso à ação; o painel não pode desaparecer antes de ser utilizado.
- No mobile, tocar estrela habilitada deve apresentar os detalhes em um painel inferior, com fundo atenuado e ação acessível.
- Fechar o painel deve retornar ao mapa preservando progresso e posição; o foco deve voltar ao elemento que o abriu quando aplicável.
- O mobile não deve usar a expansão de detalhes abaixo da estrela, descartada pelo usuário.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| Catálogo de space | Trilha e Espaço | Fornecer planetas, estrelas, ordem, identidade e tipo de conteúdo destinado ao aluno. |
| Auth/profile | Espaço e destinos de conteúdo | Fornecer identidade autenticada, progresso confirmado e autorização. |
| Histórias interativas / lesson | Progressão da trilha | Confirmar conclusão pelas regras da história; questões, vidas e reinício pertencem à área de histórias. |
| Desafios de código / challenging | Progressão da trilha | Confirmar conclusão pela avaliação existente; este PRD não introduz Blockly ou Jev nos desafios. |
| Progressão da trilha | Mapa, histórias e desafios | Informar acesso liberado, conclusão e ponto de continuidade. |
| Conclusão e recompensas | Detalhes e retorno ao Espaço | Fornecer informações de recompensa e concluir seu fluxo antes do retorno; concessão, streak e resultado pertencem a outro PRD. |
| Design e shell da aplicação | Trilha e Espaço | Fornecer tokens, sidebar, assets e padrões acessíveis. |

Os PRDs separados de histórias, modalidades de questão e conclusão são responsáveis pelos seus comportamentos. Esta tabela não define ordem de implementação. Gerenciamento no Studio fornece contexto do catálogo, sem receber alterações administrativas nesta entrega.

## 7. Jornadas

#### JN-01 — Entrar ou retomar a trilha

Atores: aluno autenticado. Requisitos: RP-01, RP-02, RP-03, RP-05 e RP-08.

1. O aluno abre o Espaço, inclusive após retornar de um conteúdo.
2. A página obtém catálogo e progresso e indica carregamento.
3. Com dados válidos, apresenta estados e progresso dos planetas.
4. Havendo conteúdo pendente e acessível, posiciona o mapa na primeira estrela não concluída. Para aluno novo, é a primeira estrela.
5. O aluno explora o mapa; quando a estrela atual sai da área visível, pode usar o FAB para retornar sem modificar progresso.
6. Falha segue JN-05; catálogo vazio segue JN-06; conclusão total segue JN-07.

#### JN-02 — Consultar e iniciar uma estrela disponível

Atores: aluno autenticado. Requisitos: RP-04, RP-07 e RP-09.

1. No desktop, o aluno passa o mouse ou move o foco para a estrela; no mobile, toca a estrela.
2. A página apresenta detalhes ao lado ou no painel inferior.
3. O aluno aciona o início da história ou desafio.
4. O sistema valida existência, tipo e acesso.
5. Sucesso abre o destino correto. Falha não altera progresso nem abre outro tipo de conteúdo silenciosamente e permite repetir a tentativa.
6. Consultar ou abrir conteúdo não conclui a estrela.

#### JN-03 — Revisar uma estrela concluída

Atores: aluno autenticado. Requisitos: RP-02, RP-04 e RP-09.

1. O aluno consulta uma estrela concluída por hover/foco ou toque.
2. Os detalhes oferecem revisão correspondente ao conteúdo.
3. O aluno abre o conteúdo autorizado no fluxo de revisão.
4. O Espaço preserva progresso e referência de continuidade; a consulta não concede recompensas nem libera conteúdo adicional.
5. Fechar detalhes mobile mantém a posição do mapa.

#### JN-04 — Reconhecer bloqueio e avançar após conclusão

Atores: aluno autenticado; área que confirma conclusão. Requisitos: RP-04, RP-05 e RP-08.

1. O aluno encontra estrela ou planeta bloqueado e vê a condição de liberação.
2. A estrela bloqueada não permite iniciar conteúdo. Acesso direto também respeita a validação.
3. O aluno conclui a estrela atual no fluxo de história ou desafio.
4. A área responsável confirma a conclusão; apenas essa confirmação permite avanço.
5. No retorno ao Espaço, o mapa mostra a estrela concluída e a próxima liberada.
6. Na última estrela do planeta, o seguinte é liberado; no fim da trilha, segue JN-07.

#### JN-05 — Recuperar falha de carregamento

Atores: aluno autenticado. Requisito: RP-01.

1. A obtenção de catálogo ou progresso falha.
2. A página comunica a falha e oferece “Tentar novamente”, sem apresentar progresso inventado ou vazio como dados válidos.
3. O aluno aciona nova tentativa.
4. Sucesso retorna à jornada normal. Falha persistente mantém feedback e possibilidade de tentar novamente.

#### JN-06 — Consultar uma trilha sem conteúdo

Atores: aluno autenticado. Requisitos: RP-01 e RP-02.

1. Uma consulta bem-sucedida retorna catálogo sem conteúdo para a trilha.
2. A página apresenta o estado vazio.
3. Não executa scroll para estrela inexistente nem mostra FAB de continuidade, início de conteúdo ou celebração de conclusão total.

#### JN-07 — Retornar após concluir toda a trilha

Atores: aluno autenticado com conclusão total confirmada. Requisitos: RP-02 e RP-06.

1. O aluno retorna após a confirmação da última conclusão.
2. O mapa apresenta a trilha concluída, sem próxima estrela pendente.
3. O aluno pode revisar estrelas ou acessar o encerramento/agradecimentos existente.
4. Não há FAB direcionado a conteúdo pendente inexistente.

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP |
| --- | --- |
| Autoria e Studio | Cadastro, edição, ordenação ou exclusão de planetas, estrelas, blocos e questões. |
| Conteúdo pedagógico | Lista definitiva de planetas, roteiros e produção de novas atividades. |
| Histórias interativas | Histórico, destaque de blocos, falas, vidas, retomada interna e reinício da história. |
| Modalidades de questão | Blockly, geração de Delégua, múltipla escolha, escrita de código e versões de leitura. |
| Avaliação | Regras de aceitação, Jev, execução e critérios das atividades. |
| Desafios | Mudança da avaliação por testes, inclusão de Blockly/Jev e redesenho do editor. |
| Conclusão e recompensas | Valores ou fórmula de XP/StarCoins, concessão, celebrações, streak e página de resultado. |
| Dados e catálogo | Reset de progresso, migração de alunos e substituição ou reordenação do catálogo existente. |
| Personalização | Trilhas adaptativas, ordem individual, atalhos que ignoram pré-requisitos ou recomendação automática. |
| Integrações | Novos serviços externos, dashboards ou instrumentação avançada de analytics. |

### Decisões descartadas durante a definição

| Alternativa considerada | Regra final |
| --- | --- |
| Planetas sem ordem obrigatória | Conclusão sequencial de planetas e estrelas. |
| “Tema” e “etapa” na interface | “Planeta” e “estrela”. |
| Quizzes como estrelas independentes | Histórias ou desafios; questões integram histórias. |
| Última estrela desbloqueada como ponto atual | Primeira estrela ainda não concluída, respeitando liberação. |
| Detalhes desktop apenas após clique | Hover, com equivalente por foco de teclado. |
| Mobile com detalhes abaixo da estrela | Detalhes em painel inferior. |
| Botão adicional “Minha posição” | FAB existente. |
| Conexão contínua entre estrelas | Trilha pontilhada. |
| Planeta bloqueado como círculo com cadeado | Ilustração com opacidade reduzida. |
| Ícones inativos com aparência desabilitada | Ícones legíveis; destaque verde apenas no item ativo. |
| Falha tratada apenas como erro de rota | Feedback com “Tentar novamente”, separado do vazio. |
