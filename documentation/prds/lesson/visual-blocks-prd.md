---
title: Blocos visuais — imagens e Lotties
status: draft
source:
  - type: direct-request
    ref: Apresentação de imagens, Lotties e cenas nas histórias aprovada em 2026-10-11
  - type: direct-request
    ref: Destaque somente com Lotties e sem controles de reprodução aprovado em 2026-10-31
  - type: direct-request
    ref: Efeito sonoro opcional do Lottie e vídeos de planeta fora dos blocos visuais aprovados em 2026-11-13
last_updated_at: 2026-11-14
---

# PRD — Blocos visuais — imagens e Lotties

Disponibiliza para: lesson, apresentação de imagens e animações nas histórias; atividades, cenas que reagem a eventos de execução; Histórias interativas, estado visual de consulta preservado na tentativa da conta.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

Blocos visuais apresentam Lotties e imagens estáticas que apoiam a compreensão de conceitos nas histórias do Stardust. Todo visual em destaque é um Lottie; imagens estáticas ficam restritas às cenas de atividades. Os Lotties aparecem em destaque e depois integram o histórico, conforme o progresso da história.

Lotties narrativos começam automaticamente quando apresentados e são reproduzidos uma única vez, sem controles de pausa ou reprodução. A animação não é uma condição para avançar. Ao terminar, fica parada no último quadro, também depois de sair do destaque.

O estado visual de consulta acompanha a tentativa da conta entre dispositivos, sem exigir retomada no segundo exato. A preferência por movimento reduzido apresenta o Lottie parado em seu estado final e adapta as transições. Falhas preservam o bloco, sua descrição e uma ação de nova tentativa.

Este PRD cobre o consumo dos visuais pelo aluno. Autoria, editor de animações, infraestrutura de armazenamento, adoção de Remotion e alterações nos avaliadores ficam fora do escopo.

## 2. Problema e Oportunidade

Imagens e animações podem relacionar a narrativa a conceitos de programação e tornar os efeitos de uma atividade visíveis. Essa apresentação precisa manter o contexto dos blocos anteriores, sem prender o aluno à duração de uma animação ou iniciar várias reproduções automáticas no histórico.

O destaque temporário concentra a atenção no visual pertinente ao trecho atual, enquanto o estado de consulta preservado permite revisar o que foi apresentado. Cenas por evento aproximam a execução do programa de seus efeitos visuais. Descrição acessível, movimento reduzido e recuperação de carregamento permitem acompanhar a história em diferentes condições de uso.

Este documento é prospectivo e não afirma que todas as regras já estejam implementadas. Pesquisa competitiva não é necessária para as decisões de funcionamento aprovadas neste escopo.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | Este PRD canônico, revisão de 2026-10-11 | Autoridade versionada para consumo de imagens, Lotties e cenas nas histórias. |
| S2 | Pedido e decisões de produto aprovados em 2026-10-11 | Define reprodução, avanço, histórico, legenda, retomada, movimento reduzido e recuperação. |
| S3 | [Histórias interativas](lesson-page-prd.md), revisão de 2026-10-11 | Define blocos, sequência, histórico rolável, destaque sticky, transições e continuidade da tentativa. |
| S4 | [Programação em blocos](block-programming-prd.md), revisão de 2026-10-11 | Define cenas associadas à atividade, eventos de execução, restauração inicial e composição responsiva das questões. |
| S5 | [Seleção e Gestão de Imagens de Lição](lesson-image-selection-and-management-prd.md) | Contexto de seleção e gerenciamento de arquivos; autoria e infraestrutura não pertencem ao consumo definido neste PRD. |
| S6 | Decisão de produto aprovada em 2026-10-31 | Define que todo visual em destaque é um Lottie, reproduzido uma única vez e sem controles de pausa e reprodução. |
| S7 | Decisões de produto aprovadas em 2026-11-13 | Definem o efeito sonoro opcional de um Lottie, mantêm as cenas por evento onde já existem e situam os vídeos de planeta em Trilha e Galáxia. |

## 3. Público-alvo

O público principal é o aluno autenticado que acompanha histórias e atividades do Stardust em desktop ou mobile. O contexto inclui consulta ao histórico, sessões interrompidas, troca de dispositivo e preferência por movimento reduzido.

Como público secundário, o aluno em revisão consulta os estados visuais da história já percorrida. Autores, administradores e editores de animações não são o público deste fluxo.

Jobs to Be Done:

- Quando aprender um conceito, quero observar sua representação visual junto à narrativa, para relacionar a explicação ao exemplo.
- Quando executar uma atividade com cena, quero observar seus efeitos visuais, para compreender o comportamento do programa.
- Quando revisar um trecho, quero consultar o estado visual apresentado, para recuperar o contexto da explicação.
- Quando preferir menos movimento, quero acompanhar o conteúdo sem animação, para estudar de forma confortável.
- Quando um visual não carregar, quero entender sua descrição e tentar novamente, para continuar a leitura ou recuperar uma atividade que depende dele.

## 4. Objetivos e Métricas de Sucesso

| Objetivo do produto | Métrica aprovada | Significado da medição |
| --- | --- | --- |
| Apoiar a compreensão sem bloquear a leitura | Nenhuma meta numérica aprovada | Verificar que o aluno pode continuar sem esperar a animação terminar. |
| Preservar o contexto visual no histórico | Nenhuma meta numérica aprovada | Verificar saída do destaque e estado estático de consulta, sem nova reprodução. |
| Relacionar cenas à execução | Nenhuma meta numérica aprovada | Verificar reação aos eventos da atividade e restauração inicial a cada execução. |
| Permitir retomada entre dispositivos | Nenhuma meta numérica aprovada | Verificar preservação do estado visual de consulta na tentativa da conta. |
| Respeitar acessibilidade e recuperar falhas | Nenhuma meta numérica aprovada | Verificar descrição, movimento reduzido, nova tentativa e ausência de penalidade por falha visual. |

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Reprodução narrativa e cena de atividade possuem gatilhos diferentes. | Não iniciar uma cena por evento como se fosse apenas uma animação narrativa automática. |
| A animação não determina a conclusão de um bloco. | Não exigir seu término para liberar o avanço da leitura. |
| O histórico deve preservar o último estado apresentado. | Validar consulta estática e retomada sem exigir sincronização do instante exato de reprodução. |
| Movimento reduzido altera a apresentação padrão. | Validar estado estático, descrição e transições adaptadas. |
| Todo visual em destaque é um Lottie. | Validar que o destaque não apresenta imagens estáticas e que nenhum Lottie oferece controles de reprodução. |
| Uma questão pode depender de seu visual. | Quando o visual estiver indisponível e for indispensável, aguardar recuperação antes de avaliar, sem consumir vidas. |
| Conteúdo e eventos são fornecidos ao consumo. | A validação não inclui ferramentas de autoria nem definição da infraestrutura de arquivos. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Bloco visual | Lottie apresentado na história, com possibilidade de destaque temporário. |
| Imagem estática | Ilustração usada somente como estado visual de uma cena de atividade; não aparece no destaque. |
| Lottie narrativo | Animação explicativa apresentada como bloco da história, com reprodução automática por padrão. |
| Cena por evento | Visual associado a uma atividade, cujos estados ou animações reagem aos eventos da execução. |
| Destaque | Apresentação temporária sticky, conforme Histórias interativas; não cria uma sequência separada de falas. |
| Estado visual de consulta | Estado apresentado ao aluno e preservado para consulta no histórico e retomada, sem sincronização do segundo exato. |
| Legenda | Texto opcional abaixo do visual para identificação ou contextualização. |
| Efeito sonoro do visual | Som curto e opcional, definido pelo conteúdo, reproduzido uma vez quando o Lottie narrativo é revelado, conforme Histórias interativas. |
| Descrição acessível | Representação textual do visual, distinta da legenda opcional e disponível para acessibilidade e recuperação. |
| Visual indispensável | Visual necessário para responder uma questão; sua indisponibilidade impede a avaliação até recuperação, sem penalidade. |

#### RP-01 — Apresentar imagens e Lotties no contexto da história

Necessidades do usuário:

- Como aluno, quero consultar o visual associado à explicação, para relacionar a narrativa ao conceito apresentado.

Resultado: Lotties aparecem como blocos da história; imagens e Lotties podem compor cenas de atividades.

Atores: aluno autenticado.

##### Regras de Negócio

- Todo visual apresentado em destaque deve ser um Lottie.
- Imagens estáticas devem ficar restritas às cenas associadas às atividades.
- Visuais podem representar conceitos ou compor cenas associadas às atividades.
- O conteúdo deve fornecer o visual, sua descrição e a configuração aplicável de reprodução ou eventos.
- As falas devem continuar pertencendo ao histórico da história, sem formar uma sequência separada do visual.

##### Regras de Experiência

- O visual deve permanecer legível e utilizável em desktop e mobile.
- A apresentação não deve substituir os blocos de texto que explicam o conceito.
- Cores da interface ao redor do visual devem usar os tokens canônicos do projeto.

#### RP-02 — Entrar e sair do destaque

Necessidades do usuário:

- Como aluno, quero manter o visual pertinente à vista enquanto leio, para acompanhar sua relação com o trecho atual da história.

Resultado: o visual permanece em destaque durante o trecho definido e depois integra o histórico normal.

Atores: aluno autenticado.

##### Regras de Negócio

- O ponto de entrada e saída do destaque deve ser determinado pela progressão da história.
- O visual em destaque deve seguir as regras de Histórias interativas.
- Ao sair do destaque, deve passar a integrar o histórico como bloco normal.
- Nenhuma fala deve ser fixada fora do histórico rolável.

##### Regras de Experiência

- No desktop, o visual deve ficar sticky ao lado do histórico; a composição pode alternar os lados conforme a história.
- No mobile, deve ficar sticky no topo abaixo do cabeçalho, com altura limitada para preservar espaço de leitura.
- As transições devem seguir a entrada com opacidade zero definida em Histórias interativas, respeitando a preferência por movimento reduzido descrita em RP-07.

#### RP-03 — Reproduzir Lotties narrativos sem controles e sem exigir seu término

Necessidades do usuário:

- Como aluno, quero assistir à animação explicativa sem precisar interagir com ela, para manter a atenção na história.

Resultado: o Lottie narrativo reproduz automaticamente, sem controles de pausa ou reprodução e sem bloquear Continuar.

Atores: aluno autenticado.

##### Regras de Negócio

- O Lottie narrativo deve começar automaticamente quando seu bloco for apresentado, exceto conforme movimento reduzido.
- O Lottie deve ser reproduzido uma única vez e permanecer parado no último quadro ao terminar.
- Não devem ser oferecidos controles de pausa, retomada ou nova reprodução.
- O término da animação não deve ser obrigatório para avançar.
- Um Lottie narrativo pode possuir um efeito sonoro opcional, reproduzido uma única vez quando o bloco é revelado, conforme [Histórias interativas](lesson-page-prd.md).
- O efeito sonoro depende da preferência de som, não da preferência por movimento reduzido: com movimento reduzido, o Lottie aparece parado e o efeito segue a preferência de som.
- Cenas por evento devem seguir RP-05, não a regra de reprodução narrativa automática.

##### Regras de Experiência

- O destaque deve apresentar apenas o Lottie e sua legenda opcional, sem barra de controles.
- Continuar deve permanecer disponível conforme a progressão da história, independentemente da duração da animação narrativa.

#### RP-04 — Consultar o visual no histórico

Necessidades do usuário:

- Como aluno, quero consultar o visual já apresentado, para recuperar o contexto de um trecho anterior.

Resultado: o visual integra o histórico; animações permanecem paradas no último estado apresentado.

Atores: aluno autenticado.

##### Regras de Negócio

- Ao sair do destaque, a animação deve ficar parada no último estado apresentado.
- A entrada no histórico não deve iniciar nova reprodução automática, da animação ou de seu efeito sonoro.
- O histórico não deve oferecer ação de reproduzir novamente.
- A consulta deve seguir as regras de leitura do histórico, sem criar uma nova tentativa de avaliação.
- A representação do visual deve preservar o contexto do bloco percorrido.

##### Regras de Experiência

- O estado estático deve permanecer consultável durante a rolagem do histórico.
- A apresentação no histórico pode ser menor que a apresentação em destaque, mantendo legibilidade.

#### RP-05 — Reagir aos eventos de uma atividade

Necessidades do usuário:

- Como aluno, quero observar os efeitos do programa na cena, para compreender o comportamento da minha execução.

Resultado: imagens ou Lotties associados à atividade reagem aos eventos definidos para sua execução.

Atores: aluno autenticado.

##### Regras de Negócio

- A cena pode representar estados por imagens estáticas ou animações Lottie.
- A configuração da atividade deve definir os eventos aos quais a cena reage.
- Cada nova execução deve começar com a cena restaurada ao estado inicial.
- O visual deve corresponder à execução da atividade, sem substituir suas regras de avaliação.
- O contrato de interação e execução da atividade deve permanecer sob seu PRD próprio.

##### Regras de Experiência

- A composição da cena deve seguir o contexto da atividade.
- Em questões de programação em blocos, a cena deve ficar à esquerda no desktop e entre enunciado e editor no mobile, conforme Programação em blocos.
- A atualização visual deve apoiar a compreensão da execução sem exigir comandos de animação adicionais do aluno.

#### RP-06 — Preservar o estado visual de consulta

Necessidades do usuário:

- Como aluno, quero retomar o estado visual apresentado, para revisar a história em outra sessão ou dispositivo.

Resultado: o estado visual de consulta acompanha a tentativa da conta.

Atores: aluno autenticado.

##### Regras de Negócio

- O estado visual de consulta deve ser preservado ao recarregar ou trocar de dispositivo, vinculado à tentativa da história.
- A retomada não deve exigir sincronizar ou continuar a animação no segundo exato em que foi interrompida.
- Preservar o estado de consulta não deve impedir que uma nova execução restaure a cena de atividade ao estado inicial.
- Reinício integral da tentativa deve seguir Histórias interativas.

##### Regras de Experiência

- O histórico retomado deve apresentar o estado visual de consulta preservado.
- A retomada de um visual no histórico não deve iniciar reprodução automática.

#### RP-07 — Oferecer descrição, legenda e movimento reduzido

Necessidades do usuário:

- Como aluno, quero acompanhar o conteúdo visual com descrição e controle de movimento, para estudar conforme minhas necessidades de acesso.

Resultado: visuais possuem descrição acessível, podem ter legenda e respeitam a preferência por movimento reduzido apresentando o estado final parado.

Atores: aluno autenticado.

##### Regras de Negócio

- Imagens e Lotties devem possuir descrição acessível.
- A legenda abaixo do visual deve ser opcional.
- A legenda deve identificar ou contextualizar o visual; a explicação narrativa deve permanecer nos blocos de texto.
- Com movimento reduzido, o Lottie deve ser apresentado parado em seu estado final, sem reprodução.
- A preferência deve adaptar também as transições de layout, preservando o acesso ao conteúdo.

##### Regras de Experiência

- A descrição deve permitir compreender o conteúdo sem depender exclusivamente de movimento ou de som.
- Legendas devem permanecer legíveis em desktop e mobile.
- Como não há controles de reprodução, a descrição acessível deve transmitir o que a animação mostra.

#### RP-08 — Recuperar falhas de carregamento

Necessidades do usuário:

- Como aluno, quero recuperar um visual indisponível sem perder meu progresso, para continuar a leitura ou responder à atividade após sua recuperação.

Resultado: uma falha mantém o bloco e sua descrição, oferece nova tentativa e não consome vidas.

Atores: aluno autenticado.

##### Regras de Negócio

- Se uma imagem ou Lottie não carregar, o bloco deve ser preservado com sua descrição textual.
- Deve ser possível tentar carregar novamente.
- A leitura deve poder continuar sem exigir recuperação de um visual narrativo indisponível.
- Quando o visual for indispensável para responder uma questão, a avaliação deve aguardar sua recuperação.
- A falha de carregamento ou a espera pela recuperação não deve consumir vidas nem reprovar a resposta.
- Recuperar o visual não deve reiniciar a história ou apagar o trabalho da atividade.

##### Regras de Experiência

- A falha deve apresentar a descrição e a ação Tentar novamente no contexto do bloco.
- Em uma questão dependente do visual, a interface deve explicar por que a avaliação está aguardando recuperação.
- Não deve ser apresentado um visual indisponível como se seu carregamento tivesse sido concluído.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| Conteúdo visual | Blocos visuais | Fornecer o Lottie do destaque (ou imagem e Lottie das cenas), descrição, legenda opcional e configuração aplicável; autoria fica fora deste PRD. |
| Histórias interativas | Blocos visuais | Fornecer posição na sequência, destaque, histórico, transições e tentativa da conta. |
| Atividade executável | Cena associada | Fornecer eventos da execução e restaurar o estado inicial a cada nova execução. |
| Blocos visuais | Histórico e continuidade da história | Fornecer o estado visual de consulta, preservado entre sessões e dispositivos. |
| Preferência de movimento reduzido | Blocos visuais e transições | Orientar a apresentação do estado final parado e a adaptação das transições. |
| Carregamento do visual | Leitura e atividade dependente | Informar disponibilidade ou falha, permitir recuperação e impedir avaliação quando o visual for indispensável e estiver indisponível. |

O grafo identifica responsabilidades de produto, não uma ordem de implementação.

## 7. Jornadas

#### JN-01 — Acompanhar um visual em destaque

1. A história apresenta um bloco Lottie e o coloca em destaque no ponto definido.
2. O visual permanece sticky conforme o layout desktop ou mobile, enquanto todas as falas pertencem ao histórico rolável.
3. O aluno acompanha o conteúdo e avança pela história.
4. No ponto de encerramento do destaque, o visual passa a integrar o histórico normal.

#### JN-02 — Assistir a uma animação narrativa

1. Um Lottie narrativo aparece e começa a reproduzir automaticamente, salvo preferência por movimento reduzido.
2. A animação é reproduzida uma única vez e para no último quadro, sem controles de pausa ou reprodução.
3. O aluno pode continuar a história sem esperar o término da animação.
4. Ao sair do destaque, a animação fica parada no último estado apresentado no histórico.

#### JN-03 — Executar uma atividade com cena

1. A atividade apresenta sua cena associada.
2. Ao executar o programa, a cena é restaurada ao estado inicial.
3. Imagens ou Lotties reagem aos eventos definidos pela atividade.
4. A avaliação segue o PRD da atividade, sem ser substituída pela reação visual.
5. Ao executar novamente, a cena volta ao estado inicial antes da nova execução.

#### JN-04 — Consultar e retomar o histórico

1. O aluno consulta um visual que já saiu do destaque.
2. Encontra a animação parada no estado apresentado, sem ação de nova reprodução.
3. Ao recarregar ou retomar em outro dispositivo, encontra o estado visual de consulta preservado na tentativa da conta.
4. O sistema não exige retomada no segundo exato da reprodução e não inicia automaticamente os visuais do histórico.

#### JN-05 — Usar movimento reduzido

1. O aluno acompanha a história com a preferência por movimento reduzido ativada.
2. O Lottie aparece parado em seu estado final, com descrição; as transições de layout são adaptadas.
3. O aluno consulta a descrição e continua a história.

#### JN-06 — Recuperar um visual narrativo indisponível

1. Um Lottie narrativo não carrega.
2. O sistema preserva o bloco, apresenta sua descrição e Tentar novamente.
3. O aluno pode tentar recuperar o visual ou continuar a leitura.
4. A falha não consome vidas nem apaga o progresso da história.

#### JN-07 — Recuperar um visual indispensável à questão

1. A questão depende de um visual que não carregou.
2. O sistema apresenta a descrição, Tentar novamente e informa que a avaliação aguarda recuperação.
3. O trabalho da atividade é preservado, sem perda de vidas ou reprovação por essa falha.
4. O aluno tenta carregar novamente.
5. Após recuperação, a atividade pode ser avaliada conforme seu PRD próprio.

## 8. Fora do Escopo

| Área | Exclusão explícita desta versão |
| --- | --- |
| Autoria | Cadastro, edição e publicação dos blocos, legendas, descrições e configurações de eventos. |
| Editor de animações | Ferramentas para criar ou alterar animações Lottie. |
| Remotion | Adoção de Remotion como dependência ou requisito desta experiência. |
| Vídeos de planeta | Vídeos de apresentação dos planetas e de encerramento da trilha. São arquivos pré-renderizados reproduzidos na Galáxia, definidos em [Trilha e Galáxia](../space/galaxy-page-prd.md), e não são blocos visuais da história. |
| Infraestrutura | Estratégia de armazenamento, CDN e contratos técnicos de arquivos e eventos. |
| Avaliadores | Mudanças na avaliação determinística ou pelo Jev; os visuais não substituem a avaliação da atividade. |
| Reprodução sincronizada | Retomada entre dispositivos no segundo exato de uma animação. |

### Decisões descartadas durante a definição

| Alternativa considerada | Regra final |
| --- | --- |
| Exigir término da animação para avançar | Permitir continuar sem esperar sua conclusão. |
| Manter animações reproduzindo automaticamente no histórico | Apresentar o último estado parado, sem nova reprodução. |
| Oferecer controles de pausa e reprodução | Sem controles; o Lottie reproduz automaticamente uma única vez. |
| Repetir a animação conforme configuração do bloco | Reproduzir uma única vez e parar no último quadro. |
| Usar imagens estáticas no destaque | Todo visual em destaque é um Lottie; imagens estáticas ficam nas cenas de atividades. |
| Retomar a animação no instante exato entre dispositivos | Preservar o estado visual de consulta, sem sincronizar o segundo exato. |
| Manter a cena do programa anterior ao executar novamente | Restaurar a cena ao estado inicial a cada execução. |
| Bloquear toda leitura quando faltar um visual | Preservar bloco e descrição, oferecer recuperação e permitir continuar a leitura. |
| Avaliar uma questão dependente de visual indisponível | Aguardar recuperação sem consumir vidas. |
| Exigir legenda em todos os visuais | Legenda opcional e descrição acessível. |
| Reproduzir automaticamente mesmo com movimento reduzido | Mostrar o estado final parado, sem reprodução. |
| Adotar Remotion para a experiência | Consumir Lotties no destaque e imagens ou Lotties nas cenas por evento; Remotion não é requisito. Os vídeos de planeta, que podem ser produzidos com essa ferramenta, chegam à aplicação já renderizados e pertencem a Trilha e Galáxia. |
| Estender a cena por evento à escrita de código e aos exemplos executáveis | Cenas por evento permanecem nas atividades que já as possuem; após a escrita de código, a consequência é um Lottie em destaque. |
| Efeito sonoro apenas em Lotties | Qualquer bloco da história pode possuir um efeito sonoro opcional, conforme Histórias interativas. |
