---
title: Histórias interativas
status: draft
source:
  - type: direct-request
    ref: Reformulação das histórias aprovada em 2026-10-11
  - type: issue
    ref: https://github.com/JohnPetros/stardust/milestone/23
last_updated_at: 2026-10-31
---

# PRD — Histórias interativas

Disponibiliza para: lesson, experiência de consumo de uma história vinculada a uma estrela; Trilha e Espaço, continuidade e conclusão da estrela; resultado, encaminhamento da conclusão.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

Histórias interativas são sequências de blocos que combinam narrativa, apresentação de conceitos e questões durante o aprendizado de programação no Stardust. O aluno autenticado acessa uma estrela de história, acompanha as explicações e pratica dentro da mesma sequência, sem um estágio separado de quiz.

A página deve oferecer progressão guiada, histórico consultável, elementos visuais em destaque e retomada da tentativa vinculada à conta. Questões exigem acerto para avançar; uma nova tentativa começa com dez vidas.

Este PRD define a experiência comum da história. A interação e a avaliação específicas de cada tipo de questão, suas versões de leitura, a autoria do conteúdo e a apresentação das recompensas pertencem a documentos próprios.

## 2. Problema e Oportunidade

A experiência anterior separa a história do quiz e mantém uma composição visual pouco variável. Sair da lição reinicia seu estado, dificultando a continuidade de uma sessão incompleta.

A reformulação aproxima explicações e atividades, permite praticar após conhecer um conceito e mantém os blocos anteriores disponíveis para consulta. O destaque visual acompanha o contexto da narrativa, enquanto a retomada permite continuar em outra sessão ou dispositivo.

A revisão é prospectiva: descreve o comportamento aprovado para a reformulação, sem afirmar que ele já existe na implementação. Pesquisa competitiva não é necessária para as decisões de funcionamento aprovadas neste escopo.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | Este PRD canônico, revisão de 2026-10-11 | Autoridade versionada para a experiência comum das histórias interativas. Substitui a revisão de Página de Lição de 2026-07-06. |
| S2 | Pedido e decisões de produto aprovados em 2026-10-11 | Define blocos, destaque, questões integradas, dez vidas, reinício integral e retomada vinculada à conta. |
| S3 | [Trilha e Espaço](../space/space-page.md) | Define planetas, estrelas, sequência, acesso e navegação pelo Espaço. |
| S4 | [Milestone 23](https://github.com/JohnPetros/stardust/milestone/23) | Contexto legado de história estruturada e consumo de narração persistida. |
| S5 | Fluxos existentes de Lesson, StoryStage e QuizStage na Web App | Evidência auxiliar do comportamento anterior e do diálogo de vidas esgotadas; não substitui as decisões desta revisão. |

## 3. Público-alvo

O público principal é o aluno autenticado que aprende programação pela trilha do Stardust. O contexto de uso inclui desktop, mobile, sessões interrompidas e alternância entre dispositivos.

Como público secundário, o aluno que retorna a uma história concluída pode consultar seu conteúdo conforme as regras de revisão da trilha. Autores de conteúdo e administradores não são o público deste fluxo; suas ferramentas ficam fora do escopo.

Jobs to Be Done:

- Quando estiver aprendendo um conceito, quero acompanhar explicações e praticar na mesma sequência, para verificar meu entendimento antes de continuar.
- Quando precisar consultar uma explicação anterior, quero encontrar os blocos já percorridos, para relacioná-los à atividade atual.
- Quando interromper uma história, quero retomar meu progresso e minhas vidas, para continuar em outra sessão ou dispositivo.

## 4. Objetivos e Métricas de Sucesso

| Objetivo do produto | Métrica aprovada | Significado da medição |
| --- | --- | --- |
| Integrar aprendizado e prática | Nenhuma meta numérica aprovada | Verificar se explicações, exemplos e questões pertencem à mesma sequência. |
| Manter o histórico consultável | Nenhuma meta numérica aprovada | Verificar a consulta dos blocos anteriores e das respostas aprovadas após o avanço. |
| Permitir continuidade entre sessões e dispositivos | Nenhuma meta numérica aprovada | Verificar a retomada do ponto de continuidade, respostas aprovadas e vidas restantes. |
| Tornar o avanço compreensível | Nenhuma meta numérica aprovada | Verificar que a questão bloqueia o avanço até o acerto e que o feedback precede Continuar. |

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| A revisão define comportamento futuro, diferente do fluxo anterior História → Quiz → Resultado. | A implementação atual não comprova os novos requisitos. |
| O destaque mobile deve preservar espaço para leitura. | Validar a altura limitada e a consulta do histórico em telas estreitas. |
| A tentativa acompanha a conta. | Validar a continuidade entre sessões e dispositivos, não apenas o estado local da página. |
| Cada atividade terá um PRD próprio. | Este documento valida o contrato comum de progressão, sem especificar algoritmos de avaliação. |
| Não foram aprovadas metas numéricas. | Não inferir metas de aprendizagem, conversão ou retenção a partir deste documento. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Planeta | Tema da trilha, conforme Trilha e Espaço. |
| Estrela | Unidade ordenada da trilha; pode conter uma história ou um desafio de código. |
| História | Sequência de blocos de narrativa, apresentação de conceitos e questões. |
| Bloco da história | Item da sequência: texto, Lottie, exemplo de código, exemplo de programação em blocos ou questão. Imagens estáticas aparecem apenas em cenas de atividades. |
| Bloco de texto | Possui personagem, tipo e avatar próprios. O avatar pode variar entre blocos do mesmo personagem. |
| Histórico | Conjunto consultável dos blocos percorridos, incluindo falas e respostas aprovadas após o avanço. |
| Destaque | Apresentação temporária de um elemento visual, até um ponto definido da progressão. Não constitui uma sequência separada. |
| Questão | Atividade inserida na história que exige resposta aprovada para liberar o avanço. |
| Exemplo de leitura | Apresentação somente leitura; sua execução, quando disponível, é opcional. |
| Tentativa | Progresso de uma história e suas vidas, preservados na conta até conclusão ou reinício integral. |

#### RP-01 — Acesso à história

Necessidades do usuário:

- Como aluno, quero acessar a história da estrela escolhida, para estudar seu conteúdo.

Resultado: a história vinculada à estrela é apresentada ao aluno autorizado.

Atores: aluno autenticado.

##### Regras de Negócio

- A história deve pertencer a uma estrela e respeitar as regras de acesso, desbloqueio e revisão de Trilha e Espaço.
- O acesso deve identificar a estrela e carregar a sequência da história.
- Uma tentativa incompleta deve ser apresentada conforme RP-08.

##### Regras de Experiência

- O cabeçalho deve identificar o progresso e as vidas restantes, além de permitir sair.
- O conteúdo deve identificar a história e sua estrela.
- A entrada deve usar uma transição que comece com opacidade zero e revele o conteúdo.

#### RP-02 — Sequência de blocos

Necessidades do usuário:

- Como aluno, quero acompanhar os blocos em ordem, para aprender e praticar em uma sequência guiada.

Resultado: o aluno percorre uma única sequência de narrativa, exemplos e questões.

Atores: aluno autenticado.

##### Regras de Negócio

- A história pode conter texto, Lottie, exemplos de código Delégua e de programação em blocos, além de questões de múltipla escolha, programação em blocos e escrita de código. Todo visual em destaque deve ser um Lottie, conforme Blocos visuais.
- Continuar deve permitir percorrer os blocos na ordem da história, respeitando o bloqueio de questões descrito em RP-04.
- Exemplos devem ser somente leitura. Quando executáveis, sua execução deve ser opcional para avançar.
- Não deve existir uma passagem para um estágio separado de quiz.

##### Regras de Experiência

- Cada bloco de texto deve usar seu personagem, tipo e avatar, permitindo imagens diferentes para o mesmo personagem.
- As cores dos blocos de texto devem ser fixas por personagem ou tipo, independentemente do tema atual.
- Não deve haver um rótulo redundante com o nome Panda nos blocos de fala desse personagem.
- Continuar deve permanecer no rodapé e ser operável por teclado.
- Os blocos percorridos devem permanecer consultáveis no histórico.

#### RP-03 — Narração disponível

Necessidades do usuário:

- Como aluno, quero ouvir a narração disponível, para acompanhar a explicação também por áudio.

Resultado: blocos elegíveis oferecem narração quando seu arquivo está disponível.

Atores: aluno autenticado.

##### Regras de Negócio

- A história deve consumir áudio previamente gerado e persistido.
- O player deve ser disponibilizado somente quando o áudio estiver concluído e a existência do arquivo estiver confirmada.
- Não deve haver geração de voz em tempo real como fallback.
- A ausência de áudio ou a falha na confirmação do arquivo não deve impedir a leitura do bloco.

##### Regras de Experiência

- Blocos sem áudio disponível devem ser apresentados normalmente, sem player indisponível.
- A narração não deve substituir o conteúdo textual.

#### RP-04 — Questões integradas à história

Necessidades do usuário:

- Como aluno, quero responder questões durante a história e receber feedback, para verificar meu entendimento antes de avançar.

Resultado: a resposta aprovada libera Continuar; a resposta incorreta permite nova tentativa enquanto houver vidas.

Atores: aluno autenticado.

##### Regras de Negócio

- Cada questão deve ocupar um ponto da sequência da história.
- O aluno deve acertar a questão antes de avançar.
- Uma resposta incorreta deve permitir nova tentativa, respeitando RP-05.
- Após a aprovação, o próximo bloco não deve aparecer automaticamente: o aluno deve acionar Continuar.
- A interação, a avaliação e o feedback específicos de cada tipo devem ser definidos em PRDs próprios.

##### Regras de Experiência

- A questão deve apresentar o enunciado como bloco de texto acima da atividade.
- Durante a questão, o histórico não deve ser exibido simultaneamente à atividade.
- O feedback deve permanecer disponível antes de Continuar.
- Após o avanço, a questão e sua resposta aprovada devem permanecer disponíveis para consulta no histórico.
- Acerto e erro devem ser compreensíveis por texto ou indicação visual além da cor.

#### RP-05 — Vidas e reinício integral

Necessidades do usuário:

- Como aluno, quero entender minhas vidas e como recomeçar, para continuar aprendendo após erros.

Resultado: a tentativa inicia com dez vidas e pode ser reiniciada integralmente quando elas acabam.

Atores: aluno autenticado.

##### Regras de Negócio

- Uma nova tentativa deve começar com dez vidas.
- Cada resposta enviada e considerada incorreta deve custar uma vida.
- Executar exemplos ou experimentar código não deve custar vidas.
- Ao zerar as vidas, o aluno não deve continuar a tentativa atual.
- Recomeçar história deve limpar toda a tentativa anterior e restaurar dez vidas, reiniciando a história inteira, não apenas a questão.
- Sair deve retornar ao Espaço. Essa ação não deve restaurar vidas nem reiniciar a tentativa.

##### Regras de Experiência

- O cabeçalho deve apresentar as vidas restantes.
- O diálogo existente de vidas esgotadas deve oferecer Recomeçar história e Sair.
- O diálogo deve deixar claro que recomeçar reinicia toda a história.

#### RP-06 — Progresso único da história

Necessidades do usuário:

- Como aluno, quero acompanhar meu progresso na história, para saber quanto falta concluir.

Resultado: uma única barra representa os blocos concluídos da sequência completa.

Atores: aluno autenticado.

##### Regras de Negócio

- O progresso deve considerar os blocos concluídos em relação ao total de blocos da história, incluindo textos, exemplos e questões.
- Uma questão não deve contar como concluída antes da aprovação de sua resposta.
- O progresso deve chegar a 100% somente ao concluir a história.
- Executar um exemplo não deve ser requisito de conclusão do bloco.

##### Regras de Experiência

- A barra deve permanecer no cabeçalho e representar a mesma sequência durante leitura e questões.
- Não deve haver uma barra separada para quiz.

#### RP-07 — Conclusão e encaminhamento ao resultado

Necessidades do usuário:

- Como aluno, quero concluir a história e visualizar seu resultado, para reconhecer o avanço na trilha.

Resultado: concluir todos os blocos encaminha o aluno à experiência de resultado da estrela.

Atores: aluno autenticado.

##### Regras de Negócio

- A história deve ser concluída somente após percorrer a sequência e aprovar suas questões.
- A conclusão deve identificar a estrela e ser fornecida às áreas responsáveis por progresso e resultado.
- Cálculo de XP e moedas, apresentação de recompensas e streak devem pertencer ao PRD de resultado.
- Tempo e quantidade de erros não devem compor o cálculo da recompensa neste fluxo.

##### Regras de Experiência

- Ao terminar a sequência, o aluno deve ser encaminhado à experiência de resultado.
- Não deve existir uma confirmação intermediária para entrar em um quiz.

#### RP-08 — Saída e retomada vinculada à conta

Necessidades do usuário:

- Como aluno, quero interromper e retomar uma história, para continuar em outra sessão ou dispositivo.

Resultado: a tentativa incompleta é retomada com seu ponto de continuidade e suas vidas preservados.

Atores: aluno autenticado.

##### Regras de Negócio

- Sair ou recarregar uma história incompleta deve preservar o ponto de continuidade, os blocos percorridos, as respostas aprovadas e as vidas restantes.
- A tentativa deve acompanhar a conta entre dispositivos, não ficar restrita ao dispositivo usado anteriormente.
- Sair deve retornar ao Espaço sem reiniciar a tentativa.
- O reinício integral deve ocorrer pela ação Recomeçar história descrita em RP-05.

##### Regras de Experiência

- Ao retornar, o aluno deve continuar do ponto preservado, com o histórico correspondente disponível.
- A retomada não deve exigir repetir questões já aprovadas na mesma tentativa.

#### RP-09 — Histórico, destaque e composição responsiva

Necessidades do usuário:

- Como aluno, quero consultar as falas anteriores enquanto observo o elemento em destaque, para relacionar a narrativa ao exemplo apresentado.

Resultado: o destaque permanece visível durante seu trecho da história, enquanto todas as falas pertencem ao histórico rolável.

Atores: aluno autenticado.

##### Regras de Negócio

- Um elemento visual pode permanecer em destaque até um ponto definido da progressão.
- Ao atingir esse ponto, o elemento deve sair do destaque e passar a integrar o histórico como bloco normal.
- Nenhuma fala deve ficar sticky; todas devem fazer parte do histórico rolável.
- A apresentação de questões deve seguir RP-04, sem histórico simultâneo.

##### Regras de Experiência

- No desktop, o elemento em destaque deve ficar sticky ao lado do histórico; a composição pode alternar os lados durante a história.
- No mobile, o elemento em destaque deve ficar sticky no topo, abaixo do cabeçalho, com altura limitada para preservar espaço de leitura. As falas devem rolar abaixo.
- O topo da área rolável do histórico deve apresentar sombreamento de overflow.
- Mudanças de composição devem ser animadas; a entrada dos elementos deve começar com opacidade zero.
- A composição deve permitir consultar os blocos anteriores sem fixar uma fala fora da área de rolagem.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| Trilha e Espaço | Histórias interativas | Fornecer identidade da estrela, ordem, desbloqueio e regras de acesso e revisão. |
| Conteúdo da história | Histórias interativas | Fornecer a sequência de blocos, personagens, avatares, tipos e pontos de encerramento do destaque; a autoria fica fora deste PRD. |
| Histórias interativas | Questões e exemplos de leitura | Fornecer o contexto da sequência e aplicar o contrato comum de progressão, vidas e histórico. |
| Múltipla escolha, programação em blocos e escrita de código | Histórias interativas | Fornecer interação, avaliação e feedback específicos por meio de PRDs próprios. |
| Conta do aluno | Histórias interativas | Preservar e disponibilizar a continuidade da tentativa entre sessões e dispositivos. |
| Áudio persistido | Histórias interativas | Fornecer arquivos disponíveis para os blocos elegíveis, sem geração em tempo real. |
| Histórias interativas | Trilha e Espaço; resultado e recompensas | Fornecer a conclusão da estrela para progressão e apresentação do resultado. |

O grafo identifica responsabilidades de produto, não uma ordem de implementação.

## 7. Jornadas

#### JN-01 — Percorrer uma história

1. O aluno acessa uma estrela de história autorizada pela trilha.
2. O sistema apresenta a sequência, o progresso e as vidas da tentativa.
3. O aluno acompanha os blocos usando Continuar.
4. Quando houver narração disponível, pode ouvi-la; sem áudio, continua lendo normalmente.
5. Quando houver exemplo executável, pode executá-lo ou continuar sem executar.
6. Ao encontrar uma questão, segue JN-02; ao terminar a sequência, segue JN-06.

#### JN-02 — Responder uma questão

1. O sistema apresenta o enunciado acima da atividade, sem o histórico simultâneo.
2. O aluno responde e envia sua resposta para avaliação.
3. Se a resposta estiver incorreta, perde uma vida, recebe a indicação de erro definida pelo PRD do tipo de questão e pode tentar novamente enquanto houver vidas.
4. Se a resposta estiver aprovada, recebe feedback e pode acionar Continuar.
5. Após Continuar, a sequência prossegue e a resposta aprovada permanece consultável no histórico.
6. Se as vidas acabarem, segue JN-05.

#### JN-03 — Consultar o histórico e acompanhar o destaque

1. A história apresenta um elemento visual em destaque.
2. No desktop, o elemento permanece ao lado do histórico; no mobile, permanece no topo abaixo do cabeçalho.
3. O aluno rola todas as falas e os blocos anteriores na área do histórico.
4. Ao atingir o ponto definido da progressão, o elemento sai do destaque e passa a integrar o histórico normalmente.
5. A história prossegue com a composição correspondente ao próximo conteúdo.

#### JN-04 — Interromper e retomar

1. O aluno sai ou recarrega uma história incompleta.
2. O ponto de continuidade, os blocos percorridos, as respostas aprovadas e as vidas restantes são preservados na conta.
3. Ao sair, o aluno retorna ao Espaço.
4. Ao abrir novamente a história, na mesma sessão ou em outro dispositivo, retoma o ponto preservado.
5. O aluno consulta seu histórico e continua sem repetir questões já aprovadas na tentativa.

#### JN-05 — Ficar sem vidas

1. Uma resposta incorreta consome a última vida da tentativa.
2. O sistema impede o avanço e apresenta o diálogo de vidas esgotadas.
3. O aluno escolhe uma ação:
   - Recomeçar história: toda a tentativa anterior é limpa; a história reinicia com dez vidas.
   - Sair: o aluno retorna ao Espaço, sem restaurar as vidas da tentativa esgotada.
4. A ação Recomeçar história não preserva apenas a questão atual nem as respostas aprovadas da tentativa anterior.

#### JN-06 — Concluir a história

1. O aluno percorre todos os blocos e aprova as questões da sequência.
2. A barra chega a 100% e a conclusão identifica a estrela correspondente.
3. O sistema encaminha o aluno à experiência de resultado.
4. O resultado e o retorno ao Espaço seguem seus PRDs próprios.

## 8. Fora do Escopo

| Área | Exclusão explícita do MVP deste PRD |
| --- | --- |
| Autoria | Cadastro, edição e publicação de planetas, estrelas, histórias, questões, soluções e cenas. |
| Atividades | Algoritmos e regras específicos de avaliação, incluindo avaliação determinística e Jev; interfaces específicas e versões de leitura serão documentadas separadamente. |
| Desafios | Funcionamento das estrelas de desafio independente de código. |
| Resultado e recompensas | Cálculo de XP e moedas, apresentação do resultado e streak. |
| Áudio | Geração, cancelamento ou gerenciamento de arquivos e novas vozes. |
| Implementação | Contratos de armazenamento, sincronização, concorrência entre dispositivos e infraestrutura de execução. |

### Decisões descartadas durante a definição

| Alternativa considerada | Regra final |
| --- | --- |
| História seguida de um estágio separado de quiz | Questões integram a própria sequência da história. |
| Cinco vidas iniciais | Uma nova tentativa começa com dez vidas. |
| Reiniciar apenas a questão após esgotar vidas | Recomeçar reinicia toda a história e restaura dez vidas. |
| Reiniciar o estado ao sair | A tentativa incompleta é preservada na conta. |
| Retomada restrita ao dispositivo | A tentativa acompanha a conta entre dispositivos. |
| Avançar automaticamente após o acerto | O aluno lê o feedback e aciona Continuar. |
| Exigir execução dos exemplos para avançar | Exemplos são somente leitura e sua execução é opcional quando disponível. |
| Fixar uma fala fora do histórico rolável | Todas as falas pertencem ao histórico; somente o elemento visual fica sticky. |
| No mobile, o destaque acompanhar a rolagem | O destaque fica sticky no topo abaixo do cabeçalho, com altura limitada. |
| Usar tempo e erros para compor a recompensa | Tempo e quantidade de erros não compõem o cálculo da recompensa deste fluxo. |
| Gerar narração em tempo real quando faltar arquivo | Consumir apenas áudio previamente gerado e disponível. |
