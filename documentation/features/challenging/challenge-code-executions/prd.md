# PRD — Execuções de Código em Desafios

**Referência de produto:** Conversa atual, screenshot da aba de execuções/submissions e exemplo de milestone fornecido pelo usuário: https://github.com/JohnPetros/stardust/milestone/38
**Modo:** Prospectivo.
**Assunção:** O estudante deve conseguir acompanhar o histórico das tentativas feitas em um desafio.

---

### 1. Visão Geral

A feature **Execuções de Código em Desafios** adiciona uma nova aba na página de desafio para listar as tentativas de execução feitas pelo estudante. Cada tentativa deve mostrar quando aconteceu, qual foi o resultado, permitir revisar o código enviado e, quando houver erro, permitir consultar a mensagem de erro.

**Objetivo:** dar mais clareza ao estudante sobre sua evolução durante a resolução do desafio e tornar o fluxo de tentativa, correção e conclusão mais transparente.

**Problema resolvido:** hoje o estudante vê principalmente o resultado atual da execução, mas não tem uma visão organizada das tentativas anteriores. Isso dificulta revisar o que foi tentado, comparar erros recorrentes e entender por que o desafio ainda não pode ser concluído.

**Valor entregue:** o estudante passa a ter histórico, rastreabilidade e feedback mais claro sobre suas tentativas. A experiência de desafio fica mais previsível, especialmente quando há erros, casos de teste falhando ou mudanças no código depois de uma tentativa bem-sucedida.

---

### 2. Requisitos

#### RF-01 Histórico de Execuções

- [ ] **Histórico de Execuções**

**Descrição:** A página de desafio deve manter uma lista das tentativas de execução feitas pelo estudante no desafio atual.

##### Regras de Produto

- **Registro de tentativa:** cada vez que o estudante executar o código, uma nova tentativa deve aparecer no histórico.
- **Histórico preservado:** tentativas anteriores devem continuar disponíveis durante a resolução do desafio.
- **Ordem da lista:** as tentativas devem aparecer da mais recente para a mais antiga.
- **Contexto correto:** o histórico deve exibir apenas tentativas do estudante no desafio atual.
- **Estado vazio:** quando ainda não houver tentativas, a aba deve informar isso de forma simples.

---

#### RF-02 Status da Tentativa

- [ ] **Status da Tentativa**

**Descrição:** Cada tentativa deve ter um status que explique rapidamente o que aconteceu.

##### Regras de Produto

- **Sucesso:** quando todos os testes passarem, a tentativa deve indicar sucesso.
- **Resposta incorreta:** quando algum teste falhar, a tentativa deve indicar que ainda há correções a fazer.
- **Erro no código:** quando o código não puder ser executado corretamente, a tentativa deve indicar erro.
- **Falha da plataforma:** quando a tentativa falhar por um problema da plataforma, isso deve ser diferenciado de erro do estudante.
- **Resumo dos testes:** quando aplicável, a tentativa deve mostrar quantos testes passaram.

##### Regras de UI/UX

- **Leitura rápida:** o status deve ser fácil de identificar visualmente.
- **Texto claro:** os textos devem ser compreensíveis para estudantes, evitando linguagem interna.
- **Consistência:** os mesmos status devem aparecer de forma consistente na aba de execuções e na aba de resultado.

---

#### RF-03 Nova Aba de Execuções

- [ ] **Aba de Execuções**

**Descrição:** A navegação da página de desafio deve incluir uma nova aba chamada `Execuções`.

##### Regras de Produto

- **Localização:** a aba deve aparecer junto das abas atuais do desafio, como `Descrição`, `Resultado`, `Comentários` e `Soluções`.
- **Itens da lista:** cada item deve mostrar status, data/hora da tentativa e resumo dos testes.
- **Ações disponíveis:** cada item deve permitir visualizar o código enviado naquela tentativa.
- **Erro disponível:** quando a tentativa tiver erro, o item deve permitir visualizar a mensagem de erro.
- **Carregamento:** a aba deve ter estado de carregamento.
- **Falha ao carregar:** se não for possível carregar o histórico, a aba deve permitir tentar novamente.

##### Regras de UI/UX

- **Escaneabilidade:** a lista deve facilitar comparação entre tentativas recentes.
- **Responsividade:** a aba deve funcionar bem em desktop e mobile.
- **Sem poluição visual:** detalhes longos, como código e erro, não devem ocupar espaço permanente na lista.

---

#### RF-04 Visualização do Código

- [ ] **Visualização do Código da Tentativa**

**Descrição:** O estudante deve conseguir abrir o código usado em uma tentativa específica.

##### Regras de Produto

- **Código exato:** a visualização deve mostrar o código enviado naquela tentativa.
- **Somente leitura:** o código histórico não deve ser editável nessa visualização.
- **Sem nova execução:** a visualização do histórico não deve executar o código novamente.

##### Regras de UI/UX

- **Abertura em dialog:** o código deve abrir em uma janela sobre a página atual.
- **Leitura confortável:** códigos maiores devem ser fáceis de navegar.
- **Fechamento previsível:** o estudante deve conseguir fechar a janela de forma clara.

---

#### RF-05 Visualização de Erro

- [ ] **Visualização do Erro da Tentativa**

**Descrição:** Tentativas com erro devem permitir que o estudante consulte os detalhes do erro.

##### Regras de Produto

- **Ação condicional:** a ação de visualizar erro só deve aparecer quando existir erro.
- **Mensagem clara:** o estudante deve ver a mensagem principal do erro.
- **Localização do erro:** quando disponível, a visualização deve informar onde o erro ocorreu.
- **Tipo de erro:** a visualização deve deixar claro se o problema foi no código ou na plataforma.

##### Regras de UI/UX

- **Abertura em dialog:** o erro deve abrir em uma janela sobre a página atual.
- **Separação visual:** mensagem, localização e tipo de erro devem ser fáceis de distinguir.
- **Acessibilidade:** a ação e a janela de erro devem ter textos claros para navegação assistiva.

---

#### RF-06 Botão de Executar

- [ ] **Estado de Loading ao Executar**

**Descrição:** O botão de executar deve comunicar claramente quando uma tentativa está em andamento.

##### Regras de Produto

- **Loading visível:** ao iniciar uma execução, o botão deve indicar carregamento.
- **Evitar duplicidade:** enquanto uma tentativa estiver em andamento, o estudante não deve iniciar outra execução acidentalmente.
- **Fim da execução:** quando a tentativa terminar, o botão deve voltar ao estado normal.

##### Regras de UI/UX

- **Feedback imediato:** o estudante deve perceber rapidamente que a ação foi recebida.
- **Bloqueio temporário:** o botão pode ficar indisponível enquanto a tentativa está em andamento.

---

#### RF-07 Botão de Verificar

- [ ] **Bloqueio do Botão de Verificar**

**Descrição:** O estudante só deve conseguir verificar/concluir o desafio quando a tentativa atual estiver correta.

##### Regras de Produto

- **Testes falhando:** se houver pelo menos um teste falhando, o botão de verificar deve permanecer bloqueado.
- **Tentativa em andamento:** enquanto uma execução estiver em andamento, o botão de verificar deve permanecer bloqueado.
- **Código alterado:** se o estudante alterar o código depois de uma tentativa correta, deve executar novamente antes de verificar.
- **Conclusão liberada:** quando todos os testes passarem para o código atual, o botão de verificar deve ficar disponível.

##### Regras de UI/UX

- **Motivo claro:** quando o botão estiver bloqueado, a interface deve deixar claro o que falta para prosseguir.
- **Fluxo natural:** após uma tentativa correta, o estudante deve conseguir avançar sem passos desnecessários.
- **Sem feedback enganoso:** uma tentativa com erro ou teste falhando não deve parecer uma tentativa de conclusão do desafio.

---

#### RF-08 Acurácia e Recompensa

- [ ] **Acurácia Coerente com as Tentativas**

**Descrição:** A acurácia exibida na recompensa deve refletir as tentativas feitas pelo estudante no desafio.

##### Regras de Produto

- **Tentativas incorretas:** tentativas com testes falhando ou erro do estudante devem impactar a acurácia.
- **Falhas da plataforma:** problemas da plataforma não devem prejudicar o estudante.
- **Consistência:** a acurácia exibida na recompensa deve ser compatível com o histórico de execuções.

##### Regras de UI/UX

- **Transparência:** a recompensa deve continuar explicando a acurácia de forma simples.
- **Previsibilidade:** o estudante não deve ver uma acurácia que contradiz o histórico da aba de execuções.

---

### 3. Fluxo de Usuário

**Fluxo A — Tentativa correta**

1. O estudante acessa um desafio.
2. O estudante escreve ou ajusta o código.
3. O estudante clica em `Executar`.
4. O botão mostra carregamento.
5. A tentativa termina com todos os testes passando.
6. A aba `Resultado` mostra sucesso.
7. A aba `Execuções` passa a listar a nova tentativa.
8. O botão `Verificar` fica disponível.
9. O estudante conclui o desafio.

**Fluxo B — Tentativa com testes falhando**

1. O estudante executa o código.
2. Um ou mais testes falham.
3. A aba `Resultado` mostra quais casos precisam de correção.
4. A aba `Execuções` registra a tentativa com status de resposta incorreta.
5. O botão `Verificar` permanece bloqueado.
6. O estudante corrige o código e executa novamente.

**Fluxo C — Consulta ao histórico**

1. O estudante abre a aba `Execuções`.
2. O estudante vê a lista de tentativas do desafio atual.
3. O estudante identifica status, data/hora e resumo dos testes.
4. O estudante abre o código de uma tentativa.
5. O sistema mostra o código em modo de leitura.

**Fluxo D — Consulta a erro**

1. O estudante abre a aba `Execuções`.
2. Uma tentativa com erro exibe uma ação para ver detalhes.
3. O estudante abre os detalhes do erro.
4. O sistema mostra a mensagem e, quando disponível, onde o problema ocorreu.
5. O estudante fecha a janela e volta ao editor.

**Fluxo E — Código alterado após tentativa correta**

1. O estudante executa um código que passa em todos os testes.
2. O botão `Verificar` fica disponível.
3. O estudante altera o código.
4. O botão `Verificar` volta a ficar bloqueado.
5. O estudante executa novamente para validar o código atualizado.

---

### 4. Fora do Escopo

- Suporte a múltiplas linguagens.
- Análise automática de complexidade.
- Ranking por performance ou tempo de execução.
- Comparação visual entre duas tentativas.
- Edição do código pela visualização de histórico.
- Exclusão manual de tentativas pelo estudante.
- Compartilhamento público de uma tentativa.
- Execução passo a passo ou debugger visual.
- Histórico global fora da página do desafio.
