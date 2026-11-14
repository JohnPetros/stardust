---
title: Múltipla escolha
status: draft
source:
  - type: direct-request
    ref: Questões de múltipla escolha e consulta no histórico aprovadas em 2026-10-11
  - type: direct-request
    ref: Remoção do feedback explicativo após resposta incorreta aprovada em 2026-10-31
  - type: direct-request
    ref: Execução opcional do código de referência aprovada em 2026-10-31
  - type: direct-request
    ref: Dica por alternativa rejeitada e modo previsão aprovados em 2026-11-13
  - type: direct-request
    ref: Dica apresentada como fala de Faísca aprovada em 2026-11-13
last_updated_at: 2026-11-13
---

# PRD — Múltipla escolha

Disponibiliza para: lesson, questões de seleção única inseridas nas histórias; Histórias interativas, resposta aprovada, consequência da resposta incorreta e estado da questão para retomada e consulta no histórico.

Navegação: [Resumo](#1-resumo-executivo) · [Problema](#2-problema-e-oportunidade) · [Público](#3-público-alvo) · [Métricas](#4-objetivos-e-métricas-de-sucesso) · [Requisitos](#5-requisitos-de-produto) · [Dependências](#6-grafo-de-dependências-do-produto) · [Jornadas](#7-jornadas) · [Escopo](#8-fora-do-escopo)

## 1. Resumo Executivo

Múltipla escolha verifica interpretação e compreensão de conceitos durante as histórias do Stardust. O aluno autenticado seleciona uma alternativa por vez e envia sua resposta para avaliação determinística. Cada questão possui uma única alternativa correta.

Uma resposta incorreta consome uma vida, marca a alternativa rejeitada como incorreta e indisponível nas próximas tentativas e apresenta a dica dessa alternativa, sem revelar a alternativa correta. Uma resposta correta apresenta feedback e libera Continuar, sem avanço automático.

O enunciado pode conter código somente leitura, com execução opcional que não avalia a resposta. No modo previsão, a questão pede o resultado do código e a execução fica indisponível até a aprovação. A seleção em andamento, o acerto e as alternativas rejeitadas com suas dicas acompanham a tentativa da conta. Após aprovação e avanço, a questão permanece no histórico somente para consulta.

Este PRD não inclui seleção de várias respostas, embaralhamento, quiz independente, avaliação pela execução do código no enunciado ou ferramentas de autoria. Vidas, progressão, reinício integral e conclusão seguem Histórias interativas.

## 2. Problema e Oportunidade

As histórias precisam verificar compreensão e interpretação sem exigir escrita de código em toda atividade. Questões de múltipla escolha permitem trabalhar conceitos e leitura de código dentro da sequência narrativa.

Após um erro, a alternativa rejeitada fica marcada como incorreta e indisponível e apresenta uma dica sobre o engano que ela representa. Isso orienta a nova tentativa sem revelar a resposta e evita repetir a mesma escolha, enquanto o restante da questão permanece disponível. A consulta no histórico permite revisar a resposta aprovada após continuar a história.

Prever o resultado de um código antes de observá-lo exige que o aluno interprete o programa em vez de apenas assistir à saída. O modo previsão sustenta esse exercício ao adiar a execução até a aprovação.

O documento é prospectivo: descreve a experiência aprovada, sem afirmar que já está implementada. Pesquisa competitiva não é necessária para as decisões de funcionamento deste escopo.

### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | Este PRD canônico, revisão de 2026-11-13 | Autoridade versionada para múltipla escolha de seleção única nas histórias. |
| S2 | Pedido e decisões de produto aprovados em 2026-10-11 | Define seleção, feedback, desabilitação das alternativas rejeitadas, código somente leitura, ordem fixa e retomada. |
| S3 | [Histórias interativas](lesson-page-prd.md), revisão de 2026-10-11 | Define questões na sequência, vidas, Continuar, reinício integral, conta e histórico. |
| S4 | [Escrita de código](code-writing-prd.md), revisão de 2026-10-11 | Delimita a prática de escrita e execução como experiência própria. |
| S5 | Decisão de produto aprovada em 2026-10-31 | Removeu o feedback explicativo após resposta incorreta. Revista por S7. |
| S6 | [Bloco de Código](code-block-prd.md), revisão de 2026-11-13 | Mantém todas as ações do bloco visíveis e permite executar o código de referência sem editar, respeitando a indisponibilidade do modo previsão. |
| S7 | Decisões de produto aprovadas em 2026-11-13 | Restabelecem a orientação no erro por meio de uma dica por alternativa rejeitada e criam o modo previsão, em que a execução fica indisponível até a aprovação. |
| S8 | [Story Writing Rules](../../rules/story-writing-rules.md) | Define quando o conteúdo usa o modo previsão e como alternativas incorretas e dicas são escritas. |

## 3. Público-alvo

O público principal é o aluno autenticado que acompanha as histórias do Stardust em desktop ou mobile e precisa verificar sua compreensão antes de avançar.

Como público secundário, o aluno que retorna ao histórico pode consultar a questão e sua resposta aprovada. Autores e administradores não são o público deste fluxo; suas ferramentas ficam fora do escopo.

Jobs to Be Done:

- Quando estiver aprendendo um conceito, quero escolher uma resposta e verificar meu entendimento, para continuar a história com feedback.
- Quando errar, quero compreender o motivo sem receber imediatamente a resposta correta, para tentar novamente com orientação.
- Quando ler um trecho de código no enunciado, quero interpretá-lo e, se quiser, executá-lo, para exercitar minha compreensão do programa.
- Quando a questão pedir o resultado de um código, quero prever a saída antes de executá-lo, para conferir depois se meu raciocínio estava correto.
- Quando interromper a história, quero retomar o estado da questão, para não perder minha seleção e as tentativas já avaliadas.
- Quando revisar o histórico, quero consultar a resposta aprovada, para recordar o conceito apresentado.

## 4. Objetivos e Métricas de Sucesso

| Objetivo do produto | Métrica aprovada | Significado da medição |
| --- | --- | --- |
| Verificar compreensão durante a história | Nenhuma meta numérica aprovada | Verificar questões integradas à sequência e avaliação de uma única seleção. |
| Diferenciar seleção de avaliação | Nenhuma meta numérica aprovada | Verificar seleção neutra em azul antes do envio e estados próprios de acerto e erro após avaliação. |
| Orientar novas tentativas | Nenhuma meta numérica aprovada | Verificar alternativa rejeitada marcada como incorreta e desabilitada, com sua dica e sem revelação da resposta correta. |
| Exercitar a previsão | Nenhuma meta numérica aprovada | Verificar que, no modo previsão, a execução permanece indisponível até a aprovação e fica disponível depois dela. |
| Preservar continuidade | Nenhuma meta numérica aprovada | Verificar retomada da seleção, do acerto e das alternativas rejeitadas entre dispositivos. |
| Permitir revisão | Nenhuma meta numérica aprovada | Verificar consulta da questão aprovada no histórico sem nova tentativa nesse estado. |

### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| Cada questão possui uma única alternativa correta. | Não tratar a atividade como seleção de várias alternativas. |
| Resposta incorreta apresenta a dica da alternativa rejeitada e não revela a resposta correta. | Validar que cada alternativa rejeitada exibe a própria dica e que nenhuma dica identifica a alternativa correta. |
| Toda alternativa incorreta possui uma dica. | Tratar a ausência de dica como conteúdo incompleto, não como estado válido da questão. |
| No modo previsão, a execução fica indisponível até a aprovação. | Validar a indisponibilidade antes do acerto, inclusive após erros e na retomada, e a disponibilidade depois dele. |
| Explicar com IA permanece disponível no código de referência, inclusive no modo previsão, conforme Bloco de Código. | A explicação pode descrever a saída antes da resposta. A funcionalidade está prevista para ficar desabilitada no código por ora; rever esta regra antes de reabilitá-la. |
| Alternativas rejeitadas continuam visíveis, mas indisponíveis. | Validar que não podem ser selecionadas ou reenviadas, inclusive após retomada. |
| Ordem das alternativas é fixa. | Validar estabilidade nas tentativas, recarregamento, retomada e consulta. |
| Código é referência somente leitura. | Validar ausência de edição e que a execução, quando disponível, não avalia a resposta nem consome vidas. |
| A tentativa acompanha a conta. | Validar continuidade entre dispositivos, não apenas o estado local da página. |

## 5. Requisitos de Produto

### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| Questão de múltipla escolha | Atividade da história com uma única alternativa correta. |
| Alternativa disponível | Opção que pode ser selecionada antes de sua rejeição ou da aprovação da questão. |
| Seleção em andamento | Uma alternativa escolhida, ainda não enviada para avaliação. |
| Alternativa rejeitada | Resposta avaliada como incorreta, visível e desabilitada nas próximas tentativas da mesma questão. |
| Feedback de acerto | Explicação da resposta correta após aprovação. |
| Dica da alternativa | Orientação curta, própria de cada alternativa incorreta, apresentada quando essa alternativa é rejeitada. Aponta o engano que ela representa, sem revelar a alternativa correta. É uma fala de Faísca, do tipo dica. |
| Código no enunciado | Trecho de referência somente leitura, com execução opcional e sem avaliação. |
| Modo previsão | Configuração da questão que pede o resultado do código de referência e mantém a execução indisponível até a aprovação. |
| Questão aprovada no histórico | Apresentação para consulta da questão e da resposta correta, sem nova seleção ou tentativa nesse estado. |
| Estado retomável | Seleção em andamento, acerto com seu feedback e alternativas rejeitadas com suas dicas, vinculados à tentativa da conta. |

#### RP-01 — Apresentar a questão dentro da história

Necessidades do usuário:

- Como aluno, quero responder uma questão no contexto da explicação, para verificar minha compreensão antes de continuar.

Resultado: o enunciado e as alternativas aparecem como atividade da sequência da história.

Atores: aluno autenticado.

##### Regras de Negócio

- A questão deve fazer parte da história, sem constituir quiz independente.
- Cada questão deve possuir uma única alternativa correta.
- O acesso, as vidas e a progressão devem seguir Histórias interativas.

##### Regras de Experiência

- O enunciado deve ser apresentado como bloco de texto acima da atividade, conforme as regras de personagem, tipo e avatar da história.
- O histórico não deve ser exibido simultaneamente à questão em andamento.
- Alternativas não devem usar letras identificadoras como A, B, C ou D.
- Enunciado e alternativas devem permanecer legíveis e utilizáveis em desktop e mobile.

#### RP-02 — Selecionar uma alternativa por vez

Necessidades do usuário:

- Como aluno, quero selecionar uma resposta antes de enviar, para revisar minha escolha sem perder vidas.

Resultado: a questão mantém no máximo uma seleção em andamento entre as alternativas disponíveis.

Atores: aluno autenticado.

##### Regras de Negócio

- Apenas uma alternativa pode estar selecionada por vez.
- Escolher outra alternativa disponível antes do envio deve substituir a seleção em andamento.
- Selecionar ou alterar a seleção não deve avaliar a resposta nem consumir vidas.
- A verificação deve exigir uma alternativa disponível selecionada.
- A ordem das alternativas deve permanecer definida pelo conteúdo, sem embaralhamento nas novas tentativas ou na retomada.

##### Regras de Experiência

- A seleção ainda não avaliada deve usar marcação neutra em azul.
- A seleção deve ser identificável além da cor.
- Verificar resposta deve aguardar a seleção de uma alternativa disponível.
- Os controles de seleção devem ser operáveis por teclado.

#### RP-03 — Avaliar deterministicamente a resposta

Necessidades do usuário:

- Como aluno, quero verificar minha escolha, para saber se compreendi o conceito apresentado.

Resultado: a resposta enviada é avaliada como correta ou incorreta conforme a alternativa definida pela questão.

Atores: aluno autenticado.

##### Regras de Negócio

- A avaliação deve ocorrer por ação explícita de Verificar resposta.
- A resposta deve ser avaliada deterministicamente pela alternativa correta definida no conteúdo.
- Jev não deve participar da avaliação de múltipla escolha.
- A avaliação deve produzir o resultado da alternativa enviada, sem avaliar uma opção diferente da seleção atual.
- Resposta correta deve aprovar a questão e liberar Continuar.
- Não deve haver avanço automático após o acerto.

##### Regras de Experiência

- Acerto e erro devem possuir estados visuais próprios e indicações compreensíveis além da cor.
- O feedback de acerto deve explicar a resposta correta antes de o aluno continuar.
- Continuar deve seguir o padrão da página de história.

#### RP-04 — Orientar o erro e desabilitar a alternativa rejeitada

Necessidades do usuário:

- Como aluno, quero identificar a alternativa errada, entender o engano e escolher outra resposta, para continuar aprendendo com a tentativa.

Resultado: uma resposta incorreta consome uma vida, apresenta a dica da alternativa rejeitada e a torna indisponível nas próximas tentativas da questão.

Atores: aluno autenticado.

##### Regras de Negócio

- Cada resposta enviada e avaliada como incorreta deve consumir uma vida da tentativa da história.
- A alternativa rejeitada deve permanecer visível, mas desabilitada para seleção e novo envio.
- A desabilitação deve permanecer nas próximas tentativas e na retomada da mesma tentativa da história.
- O aluno deve selecionar outra alternativa disponível para verificar novamente.
- Cada alternativa incorreta deve possuir uma dica própria, fornecida pelo conteúdo.
- A resposta incorreta deve apresentar a dica da alternativa rejeitada. O erro também deve ser indicado pela alternativa rejeitada e pela vida consumida.
- A dica não deve revelar a alternativa correta nem permitir identificá-la por eliminação das demais.
- A dica deve permanecer associada à alternativa rejeitada nas próximas tentativas e na retomada da mesma tentativa da história.
- A dica deve ser uma fala de Faísca, com o tipo dica, conforme [Blocos de texto e narração](text-blocks-and-narration-prd.md) e [Narrativa e universo das histórias](story-narrative-prd.md).
- Novas tentativas devem ser permitidas enquanto houver vidas.
- Esgotamento de vidas e reinício integral devem seguir Histórias interativas; uma nova tentativa da história não deve herdar alternativas rejeitadas da tentativa anterior.

##### Regras de Experiência

- A alternativa rejeitada deve permanecer identificada como incorreta e indisponível, sem depender apenas de cor ou opacidade.
- A dica deve aparecer junto à alternativa rejeitada a que pertence e permanecer legível enquanto a questão estiver em andamento.
- A dica deve identificar Faísca como quem fala e usar a identidade amarela do tipo dica; o avatar segue a regra de avatar por bloco.
- A dica deve ser anunciada a leitores de tela quando apresentada.
- A interface deve orientar o aluno a escolher outra alternativa.
- As alternativas restantes não devem revelar antecipadamente qual é a correta.
- Verificar resposta deve permanecer indisponível até a seleção de outra alternativa disponível.

#### RP-05 — Apresentar código de referência executável

Necessidades do usuário:

- Como aluno, quero interpretar e, se quiser, executar o código do enunciado, para escolher uma resposta com base em sua leitura.

Resultado: o trecho de código pode ser consultado e executado, sem edição.

Atores: aluno autenticado.

##### Regras de Negócio

- O enunciado pode incluir um bloco de código de referência.
- Esse código deve ser somente leitura.
- Fora do modo previsão, o aluno pode executar o código do enunciado de forma opcional, quantas vezes quiser.
- No modo previsão, a execução deve seguir RP-08.
- Executar não deve avaliar a resposta, consumir vidas nem alterar a seleção.
- A avaliação deve continuar baseada na alternativa escolhida, não na execução de um programa.

##### Regras de Experiência

- O código deve aparecer antes das alternativas e manter a apresentação legível dos blocos de código do Stardust.
- O bloco de referência deve apresentar todas as ações do Bloco de Código: explicar com IA, restaurar, copiar e executar.
- A saída deve aparecer no terminal Saída integrado ao bloco, sem sobrepor as alternativas.
- Trechos extensos devem permanecer consultáveis em telas estreitas sem sobrepor as alternativas.

#### RP-06 — Retomar o estado da questão

Necessidades do usuário:

- Como aluno, quero retomar minha seleção e as alternativas já rejeitadas, para continuar a questão sem perder o contexto das tentativas anteriores.

Resultado: a questão preserva o estado vinculado à tentativa da conta entre sessões e dispositivos.

Atores: aluno autenticado.

##### Regras de Negócio

- A seleção ainda não enviada, o acerto com seu feedback e as alternativas rejeitadas com suas dicas devem ser preservados junto à tentativa da história.
- No modo previsão, a disponibilidade da execução deve acompanhar o estado preservado da questão: indisponível antes da aprovação e disponível depois dela.
- A retomada deve acompanhar a conta entre dispositivos.
- Uma seleção ainda não enviada não deve ser tratada como resposta já avaliada.
- Uma alternativa rejeitada não deve voltar a ficar disponível apenas por sair, recarregar ou trocar de dispositivo.
- A ordem das alternativas deve permanecer a mesma na retomada.
- Recomeçar história deve limpar esse estado conforme o reinício integral de Histórias interativas.

##### Regras de Experiência

- A seleção ainda não enviada deve retomar sua marcação neutra.
- Uma resposta já avaliada deve manter seu estado; o acerto mantém também seu feedback.
- Alternativas rejeitadas devem retomar sua indicação de indisponibilidade e sua dica.

#### RP-07 — Consultar a questão aprovada no histórico

Necessidades do usuário:

- Como aluno, quero revisar a resposta aprovada, para recordar o conceito depois de avançar.

Resultado: o histórico disponibiliza a questão e sua resposta correta somente para consulta.

Atores: aluno autenticado.

##### Regras de Negócio

- Após aprovação e avanço, a questão deve permanecer disponível no histórico da história.
- A apresentação deve permitir consultar enunciado, código quando houver, alternativas e resposta correta aprovada.
- Esse estado de consulta não deve permitir nova seleção ou tentativa de avaliação.
- Consultar a questão aprovada não deve consumir vidas nem modificar a aprovação.

##### Regras de Experiência

- A resposta correta deve permanecer identificada na consulta.
- A apresentação deve seguir o histórico rolável de Histórias interativas.
- Não deve haver um botão de verificação acionável no estado de consulta.

#### RP-08 — Prever o resultado antes de executar

Necessidades do usuário:

- Como aluno, quero prever o que um código faz antes de vê-lo executar, para testar minha leitura do programa.

Resultado: em uma questão no modo previsão, a execução do código de referência fica indisponível até a aprovação e disponível depois dela.

Atores: aluno autenticado.

##### Regras de Negócio

- O conteúdo deve poder marcar uma questão com código de referência como modo previsão.
- No modo previsão, executar o código de referência deve permanecer indisponível enquanto a questão não for aprovada, inclusive após respostas incorretas e na retomada.
- Após a aprovação, executar deve ficar disponível, de forma opcional, para o aluno conferir sua previsão.
- A avaliação deve continuar determinística e baseada na alternativa escolhida, não na execução.
- Questões que não estejam no modo previsão devem manter a execução opcional definida em RP-05.
- Restaurar e copiar devem permanecer disponíveis. Explicar com IA deve seguir Bloco de Código.

##### Regras de Experiência

- A ação de executar deve permanecer visível e ser apresentada como indisponível, sem ser ocultada.
- A indisponibilidade deve ser compreensível: a interface deve informar que a execução é liberada após a resposta correta.
- A liberação após o acerto deve ser perceptível sem depender apenas de cor.
- Na consulta pelo histórico, a questão aprovada deve apresentar a execução disponível.

## 6. Grafo de Dependências do Produto

| Produtor/área | Consumidor | Responsabilidade |
| --- | --- | --- |
| Histórias interativas | Múltipla escolha | Fornecer tentativa, posição da questão na sequência, vidas, progressão e regras de histórico e reinício. |
| Conteúdo da questão | Múltipla escolha | Fornecer enunciado, alternativas em ordem, única resposta correta, feedback de acerto, uma dica para cada alternativa incorreta, código de referência quando houver e a marcação de modo previsão. A autoria fica fora deste PRD. |
| Bloco de Código | Múltipla escolha | Apresentar as ações do código de referência e respeitar a indisponibilidade de executar no modo previsão. |
| Avaliação determinística | Múltipla escolha | Comparar a alternativa enviada com a resposta correta definida e produzir acerto ou erro. |
| Conta e tentativa da história | Múltipla escolha | Preservar seleção em andamento, acerto e alternativas rejeitadas com suas dicas para retomada entre dispositivos. |
| Múltipla escolha | Histórias interativas | Fornecer aprovação, consequência de resposta incorreta e estado consultável da questão após avanço. |

O grafo identifica responsabilidades de produto, não uma ordem de implementação.

## 7. Jornadas

#### JN-01 — Selecionar e aprovar uma resposta

1. A história apresenta o enunciado e as alternativas da questão.
2. O aluno seleciona uma alternativa disponível; a seleção recebe marcação neutra em azul.
3. Antes de enviar, pode substituir a seleção por outra alternativa disponível, sem perder vidas.
4. Aciona Verificar resposta.
5. Se a alternativa for correta, recebe feedback de acerto e a explicação da resposta.
6. O aluno lê o feedback e aciona Continuar.
7. A história prossegue e disponibiliza a questão aprovada no histórico.

#### JN-02 — Corrigir uma resposta incorreta

1. O aluno envia uma alternativa incorreta.
2. A atividade consome uma vida e apresenta a dica da alternativa rejeitada, sem revelar a resposta correta.
3. A alternativa rejeitada permanece visível, marcada como incorreta e desabilitada, com sua dica.
4. Enquanto houver vidas, o aluno seleciona outra alternativa disponível e aciona Verificar resposta.
5. Novos erros desabilitam as respectivas alternativas e apresentam suas dicas; o acerto libera Continuar.

#### JN-03 — Ficar sem vidas

1. Uma resposta incorreta consome a última vida da tentativa.
2. A história impede o avanço e apresenta seu diálogo de vidas esgotadas.
3. O aluno escolhe Sair ou Recomeçar história conforme Histórias interativas.
4. Sair não restaura vidas nem as alternativas rejeitadas da tentativa atual.
5. Recomeçar inicia toda a história com dez vidas e limpa o estado das questões da tentativa anterior.

#### JN-04 — Interpretar código no enunciado

1. A questão, fora do modo previsão, apresenta um enunciado com código antes das alternativas.
2. O aluno consulta o código somente leitura e pode executá-lo para ver a saída.
3. Interpreta o trecho e seleciona uma alternativa disponível; executar não avalia a resposta nem consome vidas.
4. A resposta segue a verificação determinística e o feedback das demais questões de múltipla escolha.

#### JN-05 — Retomar uma seleção ainda não enviada

1. O aluno seleciona uma alternativa, mas interrompe a história antes de verificar.
2. A seleção permanece vinculada à tentativa da conta.
3. Ao retomar na mesma sessão ou em outro dispositivo, encontra a alternativa selecionada com marcação neutra.
4. A ordem das alternativas permanece a mesma.
5. O aluno pode manter ou alterar a seleção disponível antes de enviar.

#### JN-06 — Retomar após uma resposta incorreta

1. O aluno envia uma resposta incorreta e interrompe a história.
2. As alternativas rejeitadas permanecem vinculadas à tentativa.
3. Ao retomar, as vidas seguem o estado preservado pela história e as alternativas rejeitadas continuam indisponíveis, com suas dicas.
4. Enquanto houver vidas, o aluno escolhe outra alternativa e tenta novamente.

#### JN-07 — Consultar a resposta aprovada

1. O aluno avança após aprovar a questão.
2. Retorna à questão pelo histórico rolável da história.
3. Consulta enunciado, código de referência quando houver, alternativas e resposta correta aprovada.
4. Não pode alterar a seleção ou enviar uma nova tentativa nesse estado de consulta.
5. A consulta não modifica vidas nem o progresso aprovado.

#### JN-08 — Prever o resultado de um código

1. A questão em modo previsão apresenta o código de referência e pergunta qual será seu resultado.
2. A ação de executar aparece indisponível, com a informação de que será liberada após a resposta correta.
3. O aluno interpreta o código, seleciona uma alternativa e aciona Verificar resposta.
4. Se errar, perde uma vida, recebe a dica da alternativa rejeitada e a execução continua indisponível.
5. Se acertar, recebe o feedback de acerto e a execução é liberada.
6. O aluno pode executar o código para conferir a previsão e aciona Continuar.

## 8. Fora do Escopo

| Área | Exclusão explícita desta versão |
| --- | --- |
| Respostas múltiplas | Seleção de várias alternativas corretas na mesma questão. |
| Ordem aleatória | Embaralhamento das alternativas entre apresentações, tentativas ou retomadas. |
| Quiz independente | Estrela ou estágio separado de quiz. |
| Avaliação por execução | Avaliar a resposta pela execução do código de referência da questão de múltipla escolha. |
| Autoria | Ferramentas para criar, editar ou publicar questões, alternativas e feedback. |
| Jev | Avaliação das respostas de múltipla escolha por modelo. |
| Outras atividades | Questões de programação em blocos e escrita de código. |
| Recompensas | Cálculo e apresentação de XP, moedas e streak. |

### Decisões descartadas durante a definição

| Alternativa considerada | Regra final |
| --- | --- |
| Permitir selecionar várias respostas | Uma única alternativa correta, com uma seleção por vez. |
| Identificar alternativas por letras | Alternativas sem letras identificadoras. |
| Usar marcação de acerto antes de avaliar | Seleção ainda não avaliada recebe marcação neutra em azul. |
| Revelar a resposta correta após erro | Não revelar a resposta correta após erro; explicar a resposta somente após o acerto. |
| Indicar o erro apenas pela alternativa rejeitada e pela vida consumida | Decisão de 2026-10-31 revista em 2026-11-13: cada alternativa rejeitada apresenta sua dica, sem revelar a alternativa correta. |
| Uma única dica por questão | Uma dica própria para cada alternativa incorreta. |
| Dica apresentada como texto da interface, sem personagem | A dica é uma fala de Faísca, do tipo dica. |
| Manter uma alternativa rejeitada selecionável | Desabilitar a alternativa rejeitada nas próximas tentativas da questão. |
| Impedir a execução do código do enunciado em todas as questões | Execução opcional desde 2026-10-31; revista em 2026-11-13 para ficar indisponível até a aprovação somente no modo previsão. |
| Pedir a previsão apenas por convenção de conteúdo, com a execução liberada | Modo previsão com execução indisponível até a aprovação. |
| Tornar explicar com IA indisponível ou removê-la no modo previsão | Mantida conforme Bloco de Código; a funcionalidade fica desabilitada no código por ora, e a regra deve ser revista antes de reabilitá-la. |
| Embaralhar alternativas | Manter a ordem definida no conteúdo, inclusive na retomada. |
| Preservar apenas questões já aprovadas | Preservar também seleção em andamento e alternativas rejeitadas. |
| Permitir nova tentativa na consulta do histórico | Apresentar questão aprovada somente para consulta nesse estado. |
| Avançar automaticamente após o acerto | Apresentar feedback e aguardar Continuar. |
