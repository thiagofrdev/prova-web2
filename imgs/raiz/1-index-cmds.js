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
