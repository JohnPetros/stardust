export const ERRORS = {
  auth: {
    userNotFound: 'Usuário não encontrado.',
  },
  rewards: {
    payloadNotFound: 'Premiações não processadas.',
  },
  challenges: {
    failedFetching: 'Erro ao carregar desafio.',
  },
  categories: {
    failedFetching: 'Erro ao buscar categorias.',
  },
  comments: {
    failedlistFetching: 'Erro ao carregar lista de comentários.',
    failedEdition: 'Não foi possível atualizar esse comentário',
    failedPost: 'Não foi possível postar esse comentário',
    failedReply: 'Não foi possível responder esse comentário',
    failedDeletion: 'Não foi possível deletar esse comentário',
    failedUpvoting: 'Não foi possível dar um upvote nesse comentário',
    failedDesupvoting: 'Não foi possível remover o upvote desse comentário',
    failedrepliesFetching: 'Erro ao carregar as resposta para esse comentário.',
  },
  mdx: {
    failedCompiling: 'Não foi possível carregar o conteúdo de texto.',
  },
  documentation: {
    failedDocsFetching: 'Não foi possível carregar o dicionário',
    failedDocUnlocking:
      'Não foi possível desbloquear o tópico do dicionário referente a esse desafio',
  },
  playgrounds: {
    failedFetching: 'Não foi possível carregar sua lista de códigos',
    failedTitleEdition: 'Não deu para editar o título desse código',
    failedDeletion: 'Não deu para deletar esse código',
    failedCoying: 'Não deu para gerar a url para compartilhar esse playground',
  },
}
