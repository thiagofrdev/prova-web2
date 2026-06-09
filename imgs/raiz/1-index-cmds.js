/*
INICIO DO PROIJETO
    mkdir prova-web && cd prova-web
    npm init -y
    npm install express ejs body-parser @prisma/client
    npm install -D typescript @types/node @types/express tsx prisma
    npx tsc --init
    npx prisma init --datasource-provider mysql
    npx tsx watch server.ts

APÓS CRIAR TABELAS NO schema.prisma
    npx prisma migrate dev --name <nome_da_migration>

PARA GERAR O CLIENTE PRISMA
    npx prisma generate

PARA ABRIR O PRISMA STUDIO
    npx prisma studio

PARA RODAR O SERVIDOR
    npx tsx watch server.ts
*/


/* Para Win 8
# 1. Cria a pasta da prova e entra nela
mkdir prova-web && cd prova-web

# 2. Inicializa o projeto Node.js
npm init -y

# 3. Instala pacotes de produção em versões compatíveis com Node 16
npm install express@4 ejs@3 body-parser@1 @prisma/client@5

# 4. Instala ferramentas de desenvolvimento compatíveis
npm install -D typescript@4.9 @types/node@16 @types/express@4 prisma@5 tsx@3

# 5. Inicializa as configurações do TypeScript
npx tsc --init

# 6. Inicializa o Prisma configurado para MySQL
npx prisma init --datasource-provider mysql

====================
Caso de falcha no :

Alternativa A:
# Se o tsx falhar, instale o ts-node:
npm install -D ts-node

# E execute o servidor com:
npx ts-node server.ts


Alternativa B:
# 1. Compila o TypeScript gerando arquivos JavaScript puros
npx tsc

# 2. Roda o arquivo JavaScript gerado usando o Node nativo
node server.js
*/