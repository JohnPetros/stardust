# Introdução

A arquitetura de uma aplicação StarDust segue os princípios da arquitetura limpa, que consiste em dividir a aplicação em camadas, de forma a proteger as regras negócio de serviços e ferramentas externas.

Uma vez que todas as regras de negócio do StarDust estão concentradas no pacote `core`, as aplicações servem como uma casca para que usuários e serviços possam interagir com essas regras, garantindo que elas sejam o coração do StarDust e que tudo ao redor seja facilmente substituível. Logo, todas as aplicações dependem do `core`, mas o contrário nunca pode acontecer.

# Camadas

Cada aplicação é dividida em camadas, que é uma parte da estrutura de um sistema que tem uma responsabilidade bem definida e que consegue comunica com outras camadas de forma organizada e padronizada. Cada camada é especializada em uma tarefa e se comunica com as outras de forma organizada e padronizada. A quantidade e o tipo de camadas variam conforme a complexidade e as necessidades da aplicação.

Uma camada pode conter elementos, como `gateways`, `handlers` e `protocol`, que são definidos por interfaces dentro do domínio.

Handler: é uma função ou classe responsável por receber uma requisição, processá-la e retornar uma resposta. É como um operador que executa uma tarefa com base em uma solicitação.

Protocol: é um objeto que define como o handler se comunica, oferecendo métodos e estruturas que ajudam o `handler` a entender a requisição e formatar a resposta da forma correta — tudo de acordo com o contexto da camada onde estão inseridos.

> Por exemplo: Na camada de API REST, o `handler` é chamado de controller, e o protocolo usado é o HTTP. Ambos são geralmente definidos por interfaces para garantir desacoplamento e facilitar testes e manutenções.

Gateway: é uma função ou classe responsável por intermediar a comunicação com serviços externos. Normalmente, utiliza um objeto chamado client para realizar as requisições.

> Por exemplo, um gateway que precisa realizar requisições HTTP pode usar a biblioteca [axios](https://axios-http.com/ptbr/docs/intro) como client para enviar chamadas à API. Já um gateway de banco de dados pode utilizar o ORM [prisma](https://www.prisma.io/) como client para executar consultas no banco.


## 🌐 Camada de API Rest (rest)

A camada `rest` é responsável por receber requisições web via protocolo HTTP. Ela atua como a porta de entrada da aplicação, permitindo que usuários (ou outros sistemas) interajam com o sistema.

### Controller

É o `handler` que recebe e trata de requisições HTTP.

### Service

É o `gateway` capaz de realizar uma requisição http e que deve receber um `rest client` como dependência que efetivamente configurar os cabeçalhos necessários para cada tipo de requisição necessária.

### Http

É o `protocol` que fornece acesso aos dados da requisição (headers, body, query, etc.) e métodos para retornar a resposta adequada (status code, JSON, etc.), ou ainda redirecionar o usuário para outra rota ou alterar cookies.

## 📟 Camada de RPC (rpc)

A camada `rpc` é responsável por lidar com chamadas de funções que são executadas em um ambiente diferente daquele em que foram invocadas — geralmente o servidor. No contexto do Next.js, por exemplo, há funções que rodam no cliente e outras que rodam exclusivamente no servidor. Essas últimas se comportam como uma API RPC, onde o cliente chama diretamente uma função que é executada do outro lado (no server).

### Action

Action é o `handler` responsável por processar essa função remota. Assim como qualquer função comum, ela pode ou não receber parâmetros e pode ou não retornar algo.

### Call

Call é o `protocol` que fornece à `action` acesso ao contexto do servidor, incluindo leitura e escrita de cookies, obtenção de dados do usuário autenticado, redirecionamentos e outras interações típicas do lado server.

## 🎞️ Camada de Fila (queue)

A camada `queue` é responsável por todo o processamento assíncrono da aplicação, como execução de jobs em background, cron jobs, webhooks, filas de mensagens e fluxos automatizados (workflows).

### Job

Job é o `handler` responsável em processar as mensagens recebidas pela fila. Um `job` nem sempre precisa retornar algo, mas pode retornar dependendo da necessidade ou da ferramenta utilizada.

### Amqp

Amqp é o `protocol` que fornece acesso aos dados do `job` e métodos para controlar o fluxo de execução, como aplicar delay, retry, falha intencional, etc. Também pode publicar eventos de domínio, embora essa funcionalidade ainda esteja sendo avaliada para manter ou substituir.

## 🧰 Camada de Provision (prov)

A camada de `prov` em prover recursos que dependem necessariamente de um serviço ou uma biblioteca externa para realizar uma funcionalidade específica sem necessariamente com o protocolo HTTP, como envio de e-mail, armazenar/recuperar arquivos estáticos em storage, processar pagamentos, lidar com arquivos PDF, CSV etc. Portanto, essa comada só possui gateways.

### Provider

Um provider é um gateway que encapsula a biblioteca ou SDK responsável por prover determinada funcionalidade externa 

> Exemplos: `StorageProvider`, `PaymentProvider`, `PdfProvider`, `EmailProvider`.

## 💾 Camada de Banco de Dados (db)
A camada de database `db` cuida da persistência de dados. Ela não possui handlers, mas sim gateways, chamados aqui de repositories.

Repository: é responsável por salvar, buscar e atualizar dados relacionados a uma única entidade ou objeto de valor, mantendo as operações de banco desacopladas do restante do sistema.

## 🖥️ Camada de Interface de Usuário (ui)
A camada ui é a responsável por fornecer a interface gráfica e a lógica de interação com o usuário, seja em uma página web ou em uma tela mobile. Ela é diferente das demais porque não possui handlers nem protocols, mas sim widgets — blocos reutilizáveis que combinam visual com lógica de interface.

### Widget
Um widget é composto por:

- View: a parte visual do componente, sendo um template html ou [jsx](https://react.dev/learn/writing-markup-with-jsx).

- Lógica: uma função ou classe que controla o estado e comportamento da interface. Em projetos com React, convenciona-se usar um hook (useAlgo) para representar essa lógica.

Exemplo: o widget LoginPage poderia ser composto por LoginPageView (interface) e useLoginPage (lógica).

Esse padrão segue a arquitetura [MVVM (Model-View-ViewModel)](https://learn.microsoft.com/pt-br/dotnet/architecture/maui/mvvm), muito comum em apps frontend modernos e mais complexos.

# Portas e Adaptadores
O StarDust segue os princípios da arquitetura hexagonal, o que significa que a lógica de negócio da aplicação (núcleo) está totalmente isolada dos detalhes de infraestrutura. O núcleo não sabe como os dados são armazenados, exibidos ou enviados — ele só sabe o que precisa ser feito.

Por isso, toda comunicação entre camadas acontece por meio de interfaces (portas). Os adaptadores (implementações) são conectados a essas interfaces para permitir que o sistema funcione com diferentes tecnologias.

💡 Importante: as camadas podem se comunicar livremente desde que isso ocorra por meio de interfaces. Não há uma hierarquia rígida entre as camadas (exceto pelo core, que é o centro do domínio e nunca deve depender de nenhuma outra camada).

![image](https://github.com/user-attachments/assets/54254271-5dac-433f-a1ff-1044de9a4051)