#!/bin/bash

# Define o arquivo CHANGELOG
CHANGELOG_FILE="CHANGELOG.md"

# Obtém a data atual
CURRENT_DATE=$(date +%Y-%m-%d)

# Obtém a última versão do package.json para usar como título da nova seção
# Verifica se o package.json existe e lê a versão, caso contrário, usa uma versão padrão
if [ -f "package.json" ]; then
    VERSION=$(node -p "require('./package.json').version")
else
    echo "Aviso: package.json não encontrado. Usando '0.0.0' como versão padrão."
    VERSION="0.0.0" # Versão padrão se package.json não existir
fi

# --- Função para obter commits ---
# Esta função pega os commits desde o último commit do tipo "🔖 release".
# Se não houver commit de release, usa o comportamento de fallback com tags ou últimos commits.
get_commits_for_changelog() {
    # Procura pelo último commit do tipo "🔖 release"
    LAST_RELEASE_COMMIT=$(git log --grep="🔖 release" -n 1 --pretty=format:"%H" 2>/dev/null)
    
    if [ -n "$LAST_RELEASE_COMMIT" ]; then
        # Pega todos os commits desde o último commit de release (excluindo o próprio commit de release)
        # Primeiro tentamos com o range padrão, depois com --all se necessário
        COMMITS=$(git log "$LAST_RELEASE_COMMIT"..HEAD --pretty=format:"* %s (%h)" --no-merges 2>/dev/null)
        
        # Se não encontrou commits com HEAD, tenta com a branch atual
        if [ -z "$COMMITS" ]; then
            CURRENT_BRANCH=$(git branch --show-current)
            COMMITS=$(git log "$LAST_RELEASE_COMMIT".."$CURRENT_BRANCH" --pretty=format:"* %s (%h)" --no-merges 2>/dev/null)
        fi
        
        # Se ainda não encontrou, tenta buscar todos os commits após o release
        if [ -z "$COMMITS" ]; then
            COMMITS=$(git log --all --since="$(git log -1 --pretty=format:%ci "$LAST_RELEASE_COMMIT")" --pretty=format:"* %s (%h)" --no-merges | grep -v "🔖 release")
        fi
        
        echo "$COMMITS"
    else
        # Fallback: comportamento anterior baseado em tags ou número fixo de commits
        if git rev-parse --verify --quiet HEAD~1 >/dev/null; then
            LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null)
            if [ -n "$LAST_TAG" ]; then
                # Pega os commits desde a última tag até HEAD
                git log "$LAST_TAG"..HEAD --pretty=format:"* %s (%h)" --no-merges
            else
                # Se não houver tags, pega os últimos 20 commits
                git log -20 --pretty=format:"* %s (%h)" --no-merges
            fi
        else
            # Se não houver commits suficientes para uma tag, ou se for um repo novo, pegue todos
            git log --pretty=format:"* %s (%h)" --no-merges
        fi
    fi
}

# Obtém a lista formatada de commits
COMMITS_LIST=$(get_commits_for_changelog)

# Verifica se a lista de commits está vazia
if [ -z "$COMMITS_LIST" ]; then
    echo "Nenhum novo commit encontrado desde o último release para a versão $VERSION. CHANGELOG não atualizado."
    exit 0
fi

# Formata a nova entrada do CHANGELOG
# Adiciona linhas em branco para melhor separação visual no Markdown
# Usamos "printf %b" para interpretar sequências de escape como \n
NEW_CHANGELOG_ENTRY=$(printf "%b" "\n## $VERSION ($CURRENT_DATE)\n\n$COMMITS_LIST\n")

# Verifica se o arquivo CHANGELOG existe
if [ ! -f "$CHANGELOG_FILE" ]; then
    echo "# Changelog" > "$CHANGELOG_FILE"
    echo "Arquivo $CHANGELOG_FILE criado com cabeçalho inicial."
fi

# Usa um arquivo temporário para maior compatibilidade e segurança
# Isso evita problemas com 'sed -i' entre Linux e macOS
TEMP_CHANGELOG=$(mktemp)

# Copia a primeira linha (o título)
head -n 1 "$CHANGELOG_FILE" > "$TEMP_CHANGELOG"

# Adiciona a nova entrada abaixo do título
echo -e "$NEW_CHANGELOG_ENTRY" >> "$TEMP_CHANGELOG"

# Adiciona o restante do arquivo original (do 2º parágrafo em diante)
tail -n +2 "$CHANGELOG_FILE" >> "$TEMP_CHANGELOG"

# Substitui o arquivo original pelo temporário
mv "$TEMP_CHANGELOG" "$CHANGELOG_FILE"

echo "CHANGELOG.md atualizado com a versão $VERSION e commits desde o último release."
echo -e "$NEW_CHANGELOG_ENTRY"