'use client'

import { ReactNode } from 'react'
import { ArrowLeft, Lock } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { Button } from '../Button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../Dialog'
import { Loading } from '../Loading'
import { Mdx } from '../Mdx'

import { useDocsDialog } from './useDocsDialog'

type DocsDialogProps = {
  children: ReactNode
}

const mdx = `
## Condicionais

<Text>As condicionais permitem que no programa seja definido dseerentes blocos de código, que são executados ou não dependendo se uma determinada condição é verdadeira ou falsa</Text>

<Quote>Existem duas principais estruturas condicionais: *se/senao se/senao* e *escolha-caso*.</Quote>

### Se

<Text>Permite que um bloco de código seja executado se uma determinada condição for verdadeira.</Text>

<Code>
  se (verdadeiro) {
    escreva('sim')
  }

  // Resultado: sim
</Code>

Caso a condição não seja verdadeira o bloco de código do *se* não será executado.

<Code>
  se (falso) {
    escreva('sim')
  }

  // Resultado: Sem resultado
</Code>

É possível inserir na condição (que está entre parênteses) do *se* qualquer expressão que resulte em um valor do tipo *lógico*.

<Code>
  se (4 > 2) {
    escreva('sim')
  }

  se (5 == 5) {
    escreva('sim')
  }

  se (verdadeiro ou falso) {
    escreva('sim')
  }

</Code>

#### Senao

Se a condição do bloco do *se* não for verdadeira, escrevendo *senao*, é possível inserir um segundo bloco de código que será executado imediatamente caso isso ocorra.

<Code>
  var temperatura = 25

  se (temperatura > 30) {
    escreva("Tá muito quente aqui!")
  } senao {
    escreva("Até que o clima tá bom.")
  }

  // Resultado: Até que o clima tá bom.
</Code>

<Alert>Obs.: Só é possível insirir apenas um bloco *se* e um bloco *senao* por estrutura condicional.</Alert>

Logo, escrever dessa maneira é errado.

<Code>
  se (verdadeiro) {
    escreva(1)
  } se (falso) { // ❌
    escreva(2)
  } senao {
    escreva(3)
  }

se (verdadeiro) {
    escreva(1)
  } senao { 
    escreva(2)
  } senao { // ❌
    escreva(3)
  }

  // Resultado: Código inválido
</Code>

#### Senao Se 

Para contornar isso é possível inserir outras condições escrevendo *senao se*. Caso a condição do *se* não seja verdadeira, a condição de execução do bloco de código do *senao se* será verificada.

<Code>
  var pontuacao = 85

  se (pontuacao <= 50) {
    escreva("Podia ser melhor, né?")
  } senao se (pontuacao <= 90) {
    escreva("Excelente!")
  }

  // Resultado: Excelente!
</Code>

<Alert>Dessa forma é possível inserir múltiplos blocos de código com condicionais, em que, se a condição do bloco anterior não for verdadeira, o próximo bloco será verificado e assim sucessivamente.</Alert>

<Code>
  var animal = "cachorro"

  se (animal == "gato") {
      escreva("Miau!")
  } senao se (animal == "cachorro") {
      escreva("Au Au!")
  } senao se (animal == "elefante") {
      escreva("Tromba!")
  } senao {
      escreva("Não sei qual som esse animal faz.")
  }

  // Resultado: Au Au!
</Code>

<Alert>Nesse caso, o bloco do *se* deve sempre ficar no topo e bloco do *senao* deve sempre ficar como último bloco</Alert>

### Escolha Caso

<Text>É uma outra estrutura condicional que permite de forma eficiente encadear várias condições quando a comparação envolve uma variável e uma lista de valores possíveis.</Text>

Para escreve-la, primeiro é preciso escrever a palavra-chave *escolha* inserir entre seus parênteses um valor que será comparado a cada *caso*. Depois, escrever palavra-chave *caso*, o valor a ser comparado e o seu bloco de código. 

No início da *escolha*, o valor é comparado ao valor de cada expressão *caso*. Se os valores foram iguais, o bloco de código do *caso* em questão é executado.

<Code>
  var numero = 3

  escolha (numero) {
    caso 1:
      escreva("O número é o 1")
    caso 2:
      escreva("O número é o 2")
    caso 3:
      escreva("O número é o 3")
  }

  // Resultado: O número é o 3
</Code>

Sempre no final da estrutura é possível inserir um bloco *padrao* (sendo opcional) que será sempre executado quando nenhum *caso* for verdadeiro.

<Code>
var cor = "roxo"

escolha (cor) {
    caso "vermelho":
      escreva("O carro é vermelho, então é rápido!")
    caso "azul":
      escreva("O carro é azul, então é confiável!")
    caso "verde":
      escreva("O carro é verde, então é ecologicamente correto!")
    padrao:
      escreva("Desculpe, eu só conheço carros vermelhos, azuis e verdes.")
}

  // Resultado: Desculpe, eu só conheço carros vermelhos, azuis e verdes.
</Code>

<Alert>Dois ou mais *casos* podem ter o mesmo bloco de código.</Alert>

<Code>
  var alimento = "maçã"

  escolha (alimento) {
    caso "laranja":
    caso "uva":
    caso "maçã":
        escreva("Isso é uma fruta!")
    caso "brócolis":
    caso "espinafre":
        escreva("Isso é um legume!")
    caso "peixe":
        escreva("Isso é peixe!")
    padrao:
        escreva("Alimento desconhecido")
  }
</Code>

<Code>
  var idade = 20
  var temCarteira = verdadeiro

  se (idade >= 18) {
    escreva("Você tem idade suficiente para dirigir.")
    
    se (temCarteira) {
        escreva("Você tem carteira de motorista, então você pode dirigir.")
    } senao {
        escreva("Você não tem carteira de motorista, então você não pode dirigir.")
    }
  } senao {
      escreva("Você não tem idade suficiente para dirigir.")
  }

  /* Resultado:
    Você tem idade suficiente para dirigir.
    Você tem carteira de motorista, então você pode dirigir.
  */
</Code>

<Code>
  var dia = 'quarta'
  var hora = 15

  escolha (dia) {
    caso 'segunda':
    caso 'terça':
    caso 'quarta':
    caso 'quinta':
        se (hora < 12) {
            escreva('Bom dia!')
        } senao {
            escreva('Boa tarde!')
        }
    caso 'sexta':
        escreva('Hoje é SEXTAAAA!!!!')
    padrao:
        escreva('Dia da semana inválido.')
  }

  // Resultado: Boa tarde!
</Code>

### Escopo de Variável

<Text>Se uma variável for definida dentro de um bloco de código, ela só estará disponível dentro desse bloco, ou seja, ela terá um *escopo local*.</Text>

<Code>

se (falso) {
  var x = 1
  escreva(x) // 1
}

escreva(x) 

// Resultado: variável não definida: 'x'.
</Code>

Porém uma variável estará diponível no bloco de código que for definido dentro do bloco em que essa variável foi definida.


<Code>
se (verdadeiro) {
  var x = 1
  escreva(x) // 1

  se (verdadeiro) {
    escreva(x) // 1
  }
}


// Resultado: variável não definida
</Code>

A variável poderá ser acessada em qualquer bloco de código se ela for definida fora de qualquer outro bloco, nesse caso ela terá *escopo global*.

<Code>
  var x = 1

  se (falso) {
    escreva(x) // 1
  }

  escreva(x) // 1
</Code>`

export function DocsDialog({ children }: DocsDialogProps) {
  const {
    isLoading,
    content,
    docs,
    handleDialogOpen,
    handleDocButton,
    handleBackButton,
  } = useDocsDialog()

  return (
    <Dialog onOpenChange={handleDialogOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>Documentação</DialogHeader>
        <div className="mt-6 max-h-[32rem] overflow-auto">
          {content ? (
            <div>
              <button
                className="flex items-center gap-2 p-2 text-gray-100"
                onClick={handleBackButton}
              >
                <ArrowLeft
                  className="-translate-x-2 text-xl text-gray-100"
                  weight="bold"
                />
                Voltar
              </button>
              <div className="-mt-6 space-y-24">
                <Mdx>{mdx}</Mdx>
              </div>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="grid h-full w-full place-content-center">
                  <Loading />
                </div>
              ) : (
                <div className="grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-3">
                  {docs?.map((doc) => (
                    <div
                      key={doc.id}
                      className="w-full max-w-[12rem] cursor-not-allowed"
                    >
                      <Button
                        onClick={() => handleDocButton(doc.id)}
                        className={twMerge(
                          'text-sm text-gray-100',
                          doc.isUnlocked
                            ? 'bg-gray-600'
                            : 'pointer-events-none bg-gray-600 text-gray-400 opacity-70 focus:opacity-[1]'
                        )}
                      >
                        <div className="flex w-full items-center px-4">
                          {!doc.isUnlocked && (
                            <Lock className="text-lg text-gray-400" />
                          )}
                          <p className="flex-1">{doc.title}</p>
                        </div>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
      <DialogTrigger>{children}</DialogTrigger>
    </Dialog>
  )
}
