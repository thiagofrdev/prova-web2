// ==========================================
// 1. IMPORTAÇÕES E CONFIGURAÇÕES INICIAIS
// ==========================================
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

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