---
title: Blocos de texto e narração
status: draft
source:
  - type: direct-request
    ref: Personagens, tipos de texto e consumo de narração aprovados em 2026-10-11
  - type: direct-request
    ref: Efeito sonoro opcional do bloco e dicas na voz de Faísca aprovados em 2026-11-13
  - type: direct-request
    ref: Preferência de reprodução automática ajustável pelo diálogo de controles de áudio aprovada em 2026-11-13
last_updated_at: 2026-11-13
---

# PRD — Blocos de texto e narração

Disponibiliza para: lesson, apresentação dos blocos de texto e consumo de narração nas histórias e nos enunciados; conta do aluno, preferência de reprodução automática entre sessões e dispositivos.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

Blocos de texto e narração apresentam falas, explicações, dicas, avisos e informações dentro das histórias do Stardust. Cada bloco possui personagem e tipo, além de um avatar específico quando disponível. O aluno também é um personagem; não constitui um tipo de bloco.

Os tipos são padrão, dica, aviso e informação. A aparência depende do personagem ou do tipo e permanece independente do planeta atual. Todas as falas pertencem ao histórico rolável, sem ficar sticky.

A narração é opcional para leitura e avanço, sempre consumida de arquivos pré-gerados e confirmados. A reprodução é manual por padrão; o aluno pode ativar reprodução automática de novos blocos, com preferência vinculada à conta. Ao retomar uma história, o bloco retomado aguarda reprodução explícita.

Este PRD cobre a apresentação e o consumo pelo aluno. Autoria, geração e gerenciamento de áudio, TTS em tempo real, blocos próprios de imagem ou Lottie e avaliação das questões ficam fora do escopo.

## 2. Problema e Oportunidade

A reformulação da história precisa separar a identidade de quem fala da finalidade do bloco. Tratar o aluno como personagem e definir tipos estáveis permite apresentar falas e informações sem depender do tema atual ou confundir personagem com estilo de conteúdo.

O avatar específico por bloco permite variar a imagem ou expressão de um personagem. A formatação organiza explicações, enquanto a narração pré-gerada oferece outra forma de acompanhar o conteúdo sem tornar áudio obrigatório. Uma preferência de reprodução vinculada à conta mantém o controle do aluno entre dispositivos.

Esta revisão é prospectiva e não afirma que as regras já estejam implementadas. Pesquisa competitiva não é necessária para as decisões de funcionamento deste escopo.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | Este PRD canônico, revisão de 2026-10-11 | Autoridade versionada para apresentação dos textos e consumo de narração nas histórias. |
| S2 | Pedido e decisões de produto aprovados em 2026-10-11 | Define tipos, personagens, cores, avatar omitido, formatação, reprodução, preferência e retomada. |
| S3 | [Histórias interativas](lesson-page.md), revisão de 2026-10-11 | Define sequência, histórico, avanço, narração disponível e continuidade da tentativa. |
| S4 | [Geração automática de áudio em blocos de texto](automatic-audio-generation-in-text-blocks.md) | Contexto de produção dos arquivos; o consumo deste PRD não inclui geração ou gerenciamento. |
| S5 | Fluxos existentes de verificação de arquivos de história e reprodução pelo Speaker | Evidência auxiliar de consumo de arquivos confirmados e reprodução; não substitui as regras aprovadas desta revisão. |
| S6 | Decisões de produto aprovadas em 2026-11-13 | Definem o efeito sonoro opcional de um bloco, sua relação com a narração e a apresentação das dicas de questões como falas de Faísca. |

## 3. Público-alvo

O público principal é o aluno autenticado que acompanha histórias e enunciados de questões do Stardust em desktop ou mobile, por leitura e, quando disponível, narração.

Como público secundário, o aluno em consulta ao histórico pode ler e ouvir novamente blocos anteriores. Autores, administradores e operadores de geração de áudio não são o público deste fluxo.

Jobs to Be Done:

- Quando acompanhar uma história, quero reconhecer quem fala e a finalidade do bloco, para compreender seu contexto.
- Quando ler uma explicação, quero encontrar formatação clara e pequenos trechos de código, para acompanhar o conceito apresentado.
- Quando houver narração, quero escolher quando ouvi-la, para estudar no meu ritmo sem depender do áudio para avançar.
- Quando consultar o histórico, quero ouvir novamente uma fala anterior, para revisar a explicação.
- Quando trocar de dispositivo, quero manter minha preferência de narração, para continuar usando a experiência da mesma forma.

## 4. Objetivos e Métricas de Sucesso

| Objetivo do produto | Métrica aprovada | Significado da medição |
| --- | --- | --- |
| Distinguir personagem e tipo | Nenhuma meta numérica aprovada | Verificar os quatro tipos e a identidade do aluno como personagem. |
| Manter identidade visual consistente | Nenhuma meta numérica aprovada | Verificar cores fixas independentes do planeta e avatar específico ou omitido. |
| Organizar a leitura | Nenhuma meta numérica aprovada | Verificar formatação, código curto e presença de todas as falas no histórico rolável. |
| Dar controle sobre a narração | Nenhuma meta numérica aprovada | Verificar reprodução manual, preferência automática, interrupção ao avançar e uma narração por vez. |
| Preservar a preferência entre dispositivos | Nenhuma meta numérica aprovada | Verificar preferência vinculada à conta e ausência de reprodução automática do bloco retomado. |

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Personagem e tipo possuem responsabilidades distintas. | Não usar aluno como tipo de bloco nem inferir que tipos correspondem a personagens. |
| Avatar específico pode não existir ou falhar. | Validar omissão sem substituição pelo avatar padrão, mantendo leitura disponível. |
| Narração é sempre pré-gerada. | Não gerar áudio durante a leitura, inclusive nos enunciados. |
| Um arquivo declarado como concluído pode estar indisponível. | Exibir controle somente após confirmar disponibilidade e permitir leitura sem áudio. |
| Reprodução automática vale para novos blocos, não para retomada ou histórico. | Validar esses contextos separadamente. |
| Preferência acompanha a conta. | Não considerar estado apenas local suficiente para validar continuidade entre dispositivos. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Bloco de texto | Conteúdo da história ou enunciado, com personagem e tipo próprios. |
| Personagem | Identidade de quem fala, incluindo o aluno, distinta do tipo de apresentação. |
| Tipo padrão | Usa a identidade visual do personagem. |
| Tipo dica | Orientação apresentada com identidade amarela. |
| Tipo aviso | Aviso apresentado com identidade amarela. |
| Tipo informação | Informação apresentada com identidade azul. |
| Avatar do bloco | Imagem específica daquele bloco, podendo variar entre falas do mesmo personagem; se ausente ou indisponível, é omitida. |
| Narração disponível | Áudio pré-gerado de bloco elegível, com conclusão e existência do arquivo confirmadas. |
| Preferência automática | Opção vinculada à conta que reproduz os novos blocos revelados depois de Continuar; desativada por padrão. |
| Bloco retomado | Bloco atual reapresentado ao reabrir uma história incompleta, cujo áudio exige ação explícita. |
| Efeito sonoro do bloco | Som curto e opcional, definido pelo conteúdo, reproduzido uma vez quando o bloco é revelado. É distinto da narração e segue Histórias interativas. |

#### RP-01 — Separar personagem e tipo de bloco

Necessidades do usuário:

- Como aluno, quero distinguir quem fala e a finalidade do texto, para compreender sua função na história.

Resultado: cada bloco identifica personagem e um dos quatro tipos aprovados.

Atores: aluno autenticado.

##### Regras de Negócio

- Personagem e tipo devem pertencer ao mesmo bloco como informações distintas.
- Os tipos devem ser padrão, dica, aviso e informação.
- O aluno deve ser tratado como personagem, não como tipo de bloco.
- O bloco pode ser usado para falas, explicações e enunciados conforme seu contexto na história.
- A dica apresentada em uma questão deve usar o tipo dica e ter Faísca como personagem, conforme o PRD do tipo de questão.

##### Regras de Experiência

- O tipo padrão deve usar a identidade visual do personagem.
- Dica e aviso devem usar identidade amarela; informação deve usar identidade azul.
- As cores devem ser fixas por personagem ou tipo, independentemente do planeta atual.
- A fala padrão do Panda deve preservar sua identidade roxa, sem nome Panda redundante no balão.
- A finalidade do bloco deve ser compreensível além da cor.

#### RP-02 — Apresentar ou omitir o avatar específico

Necessidades do usuário:

- Como aluno, quero acompanhar a expressão de cada fala quando houver uma imagem, para reconhecer o contexto do personagem.

Resultado: o bloco usa seu avatar específico ou omite o avatar, mantendo o texto disponível.

Atores: aluno autenticado.

##### Regras de Negócio

- O avatar deve ser definido por bloco.
- Blocos do mesmo personagem podem usar imagens ou expressões diferentes.
- Se não houver avatar específico ou sua imagem falhar, o avatar deve ser omitido.
- Não deve haver substituição automática pelo avatar padrão do personagem.
- Ausência ou falha do avatar não deve impedir a leitura ou o avanço.

##### Regras de Experiência

- O texto deve permanecer legível com ou sem avatar.
- A interface não deve apresentar uma imagem quebrada como avatar válido.

#### RP-03 — Formatar o texto e preservar seu histórico

Necessidades do usuário:

- Como aluno, quero ler explicações organizadas e consultar falas anteriores, para relacionar os conceitos durante a história.

Resultado: os blocos oferecem formatação aprovada e permanecem no histórico rolável.

Atores: aluno autenticado.

##### Regras de Negócio

- O texto deve permitir negrito, itálico, listas e pequenos trechos de código.
- Exemplos completos de código devem ser apresentados em blocos próprios, não como substitutos de pequenos trechos dentro do texto.
- Todas as falas devem pertencer ao histórico da história conforme sua progressão.
- Nenhuma fala deve ficar sticky ou fixada fora da área de rolagem.

##### Regras de Experiência

- A formatação deve manter leitura clara em desktop e mobile.
- O histórico deve seguir as regras de rolagem e sombreamento de overflow de Histórias interativas.
- Durante questões, o enunciado deve seguir a apresentação acima da atividade, sem histórico simultâneo.

#### RP-04 — Consumir somente narração pré-gerada disponível

Necessidades do usuário:

- Como aluno, quero ouvir a narração disponível sem depender dela para ler, para escolher como acompanhar o conteúdo.

Resultado: o player aparece somente quando o áudio pré-gerado está confirmado; a ausência de áudio mantém a leitura disponível.

Atores: aluno autenticado.

##### Regras de Negócio

- Toda narração deve ser pré-gerada, inclusive a de enunciados de questões.
- Falas, dicas, avisos, informações e enunciados podem possuir áudio previamente gerado.
- O controle de áudio deve aparecer apenas para blocos elegíveis cujo áudio esteja concluído e cujo arquivo tenha existência confirmada.
- Não deve haver geração de áudio durante a leitura nem fallback de TTS em tempo real.
- Ausência de áudio ou falha ao confirmar seu arquivo não deve impedir a leitura ou o avanço.
- A narração do enunciado não deve alterar avaliação, vidas ou condições de aprovação da questão.

##### Regras de Experiência

- Blocos sem áudio disponível devem ser apresentados normalmente, sem player indisponível.
- Narração não deve substituir o texto nem ser necessária para compreender as ações disponíveis.

#### RP-05 — Controlar reprodução e preferência automática

Necessidades do usuário:

- Como aluno, quero escolher entre reprodução manual e automática, para acompanhar a história no meu ritmo.

Resultado: a reprodução é manual por padrão e pode ser automática para novos blocos conforme preferência da conta.

Atores: aluno autenticado.

##### Regras de Negócio

- A reprodução deve ser manual por padrão.
- O aluno deve poder ativar ou desativar a reprodução automática dos novos blocos com áudio disponível.
- A preferência deve acompanhar a conta entre sessões e dispositivos.
- A reprodução automática deve se aplicar aos novos blocos revelados depois de Continuar.
- Se a reprodução automática não iniciar, a leitura deve continuar disponível e o aluno deve poder iniciar o áudio por ação explícita.

##### Regras de Experiência

- A opção de reprodução automática deve deixar compreensível seu estado ativo ou inativo.
- A opção deve estar disponível no diálogo de controles de áudio da história, conforme [Histórias interativas](lesson-page.md), como a mesma preferência da conta.
- O player deve oferecer ações de reproduzir e pausar, com nomes acessíveis e operação por teclado.
- A interface deve distinguir leitura de conteúdo e reprodução de áudio.

#### RP-06 — Interromper ao avançar e reproduzir uma narração por vez

Necessidades do usuário:

- Como aluno, quero evitar falas sobrepostas, para acompanhar o conteúdo que estou lendo ou ouvindo.

Resultado: Continuar interrompe a narração anterior e apenas um áudio narrado reproduz por vez.

Atores: aluno autenticado.

##### Regras de Negócio

- Continuar deve interromper o áudio do bloco anterior.
- O aluno não deve precisar esperar o término da narração para avançar.
- Iniciar outra narração deve interromper a narração anterior, mantendo apenas uma reprodução por vez.
- O efeito sonoro de um bloco não conta como narração: não deve interromper, atrasar nem substituir a narração do mesmo bloco ou de outro.
- O efeito sonoro do bloco deve seguir a preferência de som e as regras de reprodução de [Histórias interativas](lesson-page.md), e não a preferência de reprodução automática da narração.
- O áudio não deve liberar automaticamente uma questão nem substituir as condições de avanço da história.

##### Regras de Experiência

- O estado dos controles deve corresponder à narração que está reproduzindo.
- O avanço deve permanecer disponível conforme Histórias interativas, independentemente da duração do áudio.

#### RP-07 — Ouvir blocos anteriores pelo histórico

Necessidades do usuário:

- Como aluno, quero ouvir novamente uma fala anterior, para revisar o conceito sem sair da história.

Resultado: blocos anteriores com áudio disponível oferecem reprodução explícita no histórico.

Atores: aluno autenticado.

##### Regras de Negócio

- Qualquer bloco anterior com áudio disponível deve poder ser reproduzido novamente pelo histórico.
- A reprodução no histórico deve depender de ação explícita, mesmo com preferência automática ativada.
- Ouvir um bloco anterior deve respeitar uma narração por vez.
- A consulta e a reprodução não devem modificar respostas aprovadas, vidas ou progresso da tentativa.
- O efeito sonoro de um bloco não deve ser reproduzido nem oferecido para reprodução no histórico.

##### Regras de Experiência

- Os controles devem estar associados ao bloco correspondente no histórico rolável.
- Iniciar uma narração anterior não deve fixar sua fala fora da área de rolagem.

#### RP-08 — Retomar sem iniciar automaticamente o áudio atual

Necessidades do usuário:

- Como aluno, quero retomar a leitura sem áudio inesperado, para decidir quando ouvir o bloco atual.

Resultado: o bloco retomado aguarda reprodução explícita, preservando a preferência automática para os blocos seguintes.

Atores: aluno autenticado.

##### Regras de Negócio

- Ao reabrir uma história incompleta, o áudio do bloco retomado não deve começar automaticamente, mesmo com preferência automática ativa.
- O efeito sonoro do bloco retomado também não deve ser reproduzido.
- O aluno deve poder reproduzi-lo por ação explícita quando estiver disponível.
- A preferência automática deve continuar válida para os novos blocos revelados depois de Continuar.
- Retomada de progresso e vidas deve seguir Histórias interativas.

##### Regras de Experiência

- A retomada deve apresentar o texto e o controle disponível sem iniciar a narração.
- A interface não deve indicar preferência desativada apenas porque o bloco retomado exige reprodução explícita.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| Conteúdo da história e da questão | Blocos de texto | Fornecer texto, personagem, tipo, avatar específico quando houver e informação de áudio elegível. |
| Histórias interativas | Blocos de texto e narração | Fornecer sequência, histórico, avanço e contexto de retomada da tentativa. |
| Áudio previamente gerado | Narração | Fornecer arquivo concluído cuja existência possa ser confirmada; geração e gerenciamento ficam fora deste PRD. |
| Conta do aluno | Narração | Preservar a preferência de reprodução automática entre sessões e dispositivos. |
| Controle de narração | Blocos ativos e histórico | Reproduzir por ação explícita ou preferência aplicável, interromper ao avançar e manter uma narração por vez. |
| Histórias interativas | Efeito sonoro do bloco | Definir quando o efeito é reproduzido e qual preferência o controla. |
| Blocos de texto | Atividades | Apresentar enunciados e áudio disponível sem alterar as regras de avaliação. |

O grafo identifica responsabilidades de produto, não uma ordem de implementação.

## 7. Jornadas

#### JN-01 — Ler um bloco com personagem e tipo

1. A história apresenta um bloco com personagem e tipo padrão, dica, aviso ou informação.
2. O bloco usa a identidade visual correspondente, independentemente do planeta atual.
3. Quando houver avatar específico disponível, apresenta essa imagem; caso contrário, omite o avatar e mantém o texto.
4. O aluno lê o conteúdo com a formatação aprovada e continua a história.
5. A fala permanece no histórico rolável, sem ficar sticky.

#### JN-02 — Reproduzir uma narração manualmente

1. O bloco apresenta áudio pré-gerado concluído e com arquivo confirmado.
2. O aluno aciona reproduzir ou pausar conforme sua necessidade.
3. Pode continuar a história sem esperar o término do áudio.
4. Continuar interrompe a narração anterior.

#### JN-03 — Ativar narração automática

1. O aluno ativa a preferência de reprodução automática.
2. A opção permanece vinculada à conta entre sessões e dispositivos.
3. Ao usar Continuar, o áudio anterior é interrompido.
4. O novo bloco com áudio disponível é reproduzido automaticamente conforme a preferência.
5. Se o áudio automático não iniciar, a leitura continua e o aluno pode acionar reproduzir.

#### JN-04 — Ouvir um bloco anterior

1. O aluno rola o histórico até um bloco com áudio disponível.
2. Aciona reproduzir nesse bloco.
3. Outra narração em andamento é interrompida, mantendo apenas uma reprodução por vez.
4. A consulta não altera progresso, vidas ou respostas aprovadas.

#### JN-05 — Retomar uma história incompleta

1. O aluno reabre a história na mesma sessão ou em outro dispositivo.
2. Encontra o ponto de continuidade definido em Histórias interativas e sua preferência de narração preservada.
3. O áudio do bloco retomado não inicia automaticamente.
4. Pode reproduzi-lo por ação explícita.
5. Ao continuar, os novos blocos seguem a preferência automática quando houver áudio disponível.

#### JN-06 — Ler sem áudio disponível

1. O bloco não possui áudio elegível, seu arquivo está ausente ou a confirmação de existência falha.
2. O sistema apresenta o texto normalmente, sem player indisponível.
3. O aluno lê e continua conforme as condições da história ou da questão.
4. O sistema não gera áudio em tempo real como fallback.

#### JN-07 — Ouvir um enunciado de questão

1. A atividade apresenta seu enunciado como bloco de texto.
2. Se houver áudio pré-gerado confirmado, apresenta o controle de narração.
3. O aluno pode ouvir o enunciado ou apenas lê-lo.
4. A reprodução não altera a resposta, a avaliação, as vidas ou as condições de avanço da questão.

## 8. Fora do Escopo

| Área | Exclusão explícita desta versão |
| --- | --- |
| Autoria | Ferramentas de edição de texto, personagens, tipos, avatares e enunciados. |
| Produção de áudio | Geração, cancelamento, gerenciamento de arquivos e definição de novas vozes narrativas. |
| TTS em tempo real | Geração de áudio durante leitura ou reprodução como fallback. |
| Blocos visuais | Imagens e Lotties como blocos próprios e cenas por evento. |
| Avaliação | Correção das questões e alteração de suas regras de aprovação. |
| Recompensas | Cálculo e apresentação de XP, StarCoins e streak. |
| Efeitos e som ambiente | Biblioteca de efeitos sonoros, som ambiente do planeta, trocas de clima e suas preferências, definidos em Histórias interativas. |
| Diálogo de controles de áudio | Botão no cabeçalho e composição do diálogo, definidos em Histórias interativas; este PRD define apenas a preferência de reprodução automática. |

### Decisões descartadas durante a definição

| Alternativa considerada | Regra final |
| --- | --- |
| Usar aluno como tipo de bloco | Aluno é personagem; tipos são padrão, dica, aviso e informação. |
| Variar cores comuns conforme o planeta | Identidade fixa por personagem ou tipo. |
| Usar um único avatar fixo por personagem | Avatar específico por bloco, permitindo imagens diferentes do mesmo personagem. |
| Substituir avatar ausente ou com falha pelo padrão do personagem | Omitir o avatar e manter a leitura. |
| Repetir o nome Panda nos balões | Não exibir nome redundante no balão. |
| Fixar uma fala fora do histórico | Todas as falas pertencem ao histórico rolável. |
| Reprodução automática por padrão | Reprodução manual por padrão, com opção automática vinculada à conta. |
| Exigir o fim da narração para avançar | Continuar pode ser acionado sem esperar e interrompe o áudio anterior. |
| Reproduzir várias narrações simultaneamente | Manter uma narração por vez. |
| Reproduzir automaticamente blocos antigos ou retomados | Exigir ação explícita; preferência automática vale para novos blocos após Continuar. |
| Gerar narração durante a leitura | Consumir apenas arquivos pré-gerados e confirmados, inclusive em enunciados. |
| Tratar o efeito sonoro do bloco como parte da narração | Efeito e narração são independentes; o efeito não interrompe a narração nem segue sua preferência automática. |
| Dica de questão sem personagem | A dica é uma fala de Faísca, apresentada com o tipo dica. |
