#!/bin/bash

# Script para executar o processo de release
# Carrega GITHUB_TOKEN do .env.development, executa release-it e atualiza o changelog

# Carrega variáveis do arquivo .env.development
if [ -f .env.development ]; then
    export $(grep -v '^#' .env.development | grep 'GITHUB_TOKEN' | xargs)
else
    echo "Erro: Arquivo .env.development não encontrado"
    exit 1
fi

# Verifica se GITHUB_TOKEN foi carregado
if [ -z "$GITHUB_TOKEN" ]; then
    echo "Erro: GITHUB_TOKEN não encontrado no arquivo .env.development"
    exit 1
fi

# Executa o processo de release
release-it && ./scripts/update-changelog.sh

