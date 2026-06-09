// ==========================================
// 1. IMPORTAÇÕES E CONFIGURAÇÕES INICIAIS
// ==========================================
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from './database.js';

// Correção para usar __dirname no formato ES Modules (necessário por causa do "type": "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Configuração do EJS para renderizar as páginas HTML/Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ==========================================
// 2. MIDDLEWARES OBRIGATÓRIOS
// ==========================================

// Configura o body-parser para conseguir ler formulários POST (padrão urlencoded)
app.use(bodyParser.urlencoded({ extended: true }));

// Serve arquivos estáticos da pasta 'public' (onde vão ficar seus formulários HTML puros)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de Log exigido: registra Data, Horário e Recurso requisitado no console
app.use((req, res, next) => {
    const dataHorario = new Date().toLocaleString('pt-BR');
    console.log(`[${dataHorario}] Recurso requisitado: ${req.method} ${req.url}`);
    next(); // Nunca esqueça o next(), senão o navegador trava!
});

// ==========================================
// 3. ROTAS DE TESTE INICIAIS
// ==========================================

// Rota GET simples para testar se o servidor está vivo
app.get('/', (req, res) => {
    res.send('Servidor do Thiago rodando perfeitamente!');
});

// Inicializa o servidor na porta 3000
app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});

// ==========================================
// 4. ROTAS DO PROGRAMA
// ==========================================

// Rota para processar a inserção da vacina
app.post('/vacinas/nova', async (req, res) => {
    try {
        // Captura os dados vindos do formulário (graças ao body-parser)
        const { nome, dosesNormal, dosesReforco } = req.body;

        // Insere no banco usando o Prisma Client
        await prisma.vacina.create({
            data: {
                nome: nome,
                quantidadeDosesNormal: parseInt(dosesNormal),   // Converte string para número
                quantidadeDosesReforco: parseInt(dosesReforco)  // Converte string para número
            }
        });

        // Após salvar com sucesso, redireciona para a rota de listagem
        res.redirect('/vacinas');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao cadastrar a vacina. Verifique se o nome já existe.");
    }
});

app.post('/criancas/nova', async (req, res) => {
    const { nomeCompleto, dataNascFormulario } = req.body;

    await prisma.crianca.create({
        data: {
            nomeCompleto: nomeCompleto,
            // O macete: basta passar a string do input date para dentro de new Date()
            dataNascimento: new Date(dataNascFormulario), 
            
            // Outros campos obrigatórios aqui...
            nomePai: "...", nomeMae: "...", sexo: "M", certidaoNascimento: "..."
        }
    });
    res.redirect('/criancas');
});

// Rota de listagem de vacinas empregando template engine (EJS)
app.get('/vacinas', async (req, res) => {
    // Busca todas as vacinas cadastradas no banco
    const todasVacinas = await prisma.vacina.findMany({
        orderBy: {
            nome: 'asc' // O professor exige listagens ordenadas!
        }
    });

    // Renderiza o arquivo 'lista-vacinas.ejs' passando o array de vacinas para dentro dele
    res.render('lista-vacinas', { vacinas: todasVacinas });
});

// Rota de listagem de aplicações (Exigência de relacionamentos)
app.get('/aplicacoes', async (req, res) => {
    const todasAplicacoes = await prisma.aplicacao.findMany({
        // O include funciona como o "JOIN" do SQL ou "Include" do Entity Framework
        include: {
            crianca: true, // Traz os dados da criança vinculada
            vacina: true   // Traz os dados da vacina vinculada
        }
    });

    res.render('lista-aplicacoes', { aplicacoes: todasAplicacoes });
});