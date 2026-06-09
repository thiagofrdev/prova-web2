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
    try {
        const { nomeCompleto, nomePai, nomeMae, sexo, dataNascimento, certidaoNascimento } = req.body;

        await prisma.crianca.create({
            data: {
                nomeCompleto,
                nomePai,
                nomeMae,
                sexo,
                dataNascimento: new Date(dataNascimento), // Conversão obrigatória!
                certidaoNascimento
            }
        });
        res.redirect('/criancas'); // Redireciona para a listagem
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao cadastrar. Verifique se a certidão já existe.");
    }
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

// Rota GET para RENDERIZAR o formulário EJS de aplicações
app.get('/aplicacoes/nova', async (req, res) => {
    const criancas = await prisma.crianca.findMany({ orderBy: { nomeCompleto: 'asc' } });
    const vacinas = await prisma.vacina.findMany({ orderBy: { nome: 'asc' } });
    res.render('cadastro-aplicacao', { criancas, vacinas });
});

// Rota POST para SALVAR a aplicação no banco
app.post('/aplicacoes/nova', async (req, res) => {
    try {
        const { criancaId, vacinaId, tipoDose, numeroDose } = req.body;
        
        await prisma.aplicacao.create({
            data: {
                criancaId: parseInt(criancaId),
                vacinaId: parseInt(vacinaId),
                tipoDose,
                numeroDose: parseInt(numeroDose)
            }
        });
        res.redirect('/aplicacoes');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao registrar aplicação.");
    }
});


// Requisito H: Listagem de crianças com filtro dinâmico
app.get('/criancas', async (req, res) => {
    const { sexo, ano } = req.query;
    
    // Objeto de filtro dinâmico
    let filtro: any = {};
    if (sexo) filtro.sexo = sexo;
    if (ano) {
        const anoInt = parseInt(ano as string);
        filtro.dataNascimento = {
            gte: new Date(`${anoInt}-01-01`),
            lte: new Date(`${anoInt}-12-31`)
        };
    }

    const criancas = await prisma.crianca.findMany({
        where: Object.keys(filtro).length > 0 ? filtro : undefined,
        orderBy: { nomeCompleto: 'asc' }
    });

    res.render('lista-criancas', { criancas });
});

// Requisito I: Crianças pendentes de uma dose específica
app.get('/pendentes', async (req, res) => {
    const { vacinaId, numeroDose } = req.query;

    if (!vacinaId || !numeroDose) return res.status(400).send("Filtro inválido.");

    const vacId = parseInt(vacinaId as string);
    const doseNum = parseInt(numeroDose as string);

    // O "Pulo do Gato": Busca crianças que NÃO têm (none) a aplicação desta vacina/dose
    const criancasPendentes = await prisma.crianca.findMany({
        where: {
            aplicacoes: {
                none: {
                    vacinaId: vacId,
                    numeroDose: doseNum
                }
            }
        },
        orderBy: { nomeCompleto: 'asc' }
    });

    res.render('lista-pendentes', { criancas: criancasPendentes });
});