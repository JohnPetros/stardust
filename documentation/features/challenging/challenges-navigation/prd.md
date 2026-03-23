# PRD - Navegacao entre desafios

## Objetivo

Permitir que a pessoa usuaria avance ou retorne entre desafios livres diretamente da pagina de execucao, reduzindo atrito para continuar a pratica sem voltar para a listagem.

## Valor entregue

- [x] Navegacao sequencial `Anterior` e `Proximo` na pagina de desafio para desafios livres.
- [x] Estados desabilitados quando o desafio atual esta no inicio ou no fim da sequencia.
- [x] Indicacao visual de que a navegacao segue a ordem global e ignora filtros de outras telas.
- [x] Confirmacao antes da troca de desafio quando existe codigo nao salvo.
- [x] Descarte do rascunho local ao confirmar a navegacao.
- [x] Carregamento server-side da navegacao adjacente apenas para desafios sem vinculo com estrela.

## Fora do escopo nesta entrega

- [ ] Navegacao sequencial para desafios do tipo `star`.
- [ ] Sidebar de desafios.
- [ ] Busca e filtros na pagina de execucao.
- [ ] Contador de progresso dos desafios.
- [ ] Navegacao aleatoria.

## O que mudou em relacao ao planejamento original

O escopo foi refinado para limitar a navegacao sequencial aos desafios livres (`star_id = null`). Desafios vinculados a estrela continuam acessiveis pela trilha espacial, sem hidratar navegacao `Anterior` e `Proximo` nesta entrega.
