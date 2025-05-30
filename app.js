
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const app = express();

// Configurações básicas
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'chave_secreta_segura',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

// Middleware para flash e sessão acessíveis nas views
app.use((req, res, next) => {
    res.locals.flash = req.flash();
    res.locals.session = req.session;
    next();
});

// --- Conexão com MongoDB ---
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/meuApp';

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar MongoDB:', err));

// --- Schemas e Models ---
const usuarioSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    passwordHash: String
});

const dispositivoSchema = new mongoose.Schema({
    nome: String,
    horas: Number,
    potencia: Number,
    dono: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
const Dispositivo = mongoose.model('Dispositivo', dispositivoSchema);

// --- Rotas ---

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const usuario = await Usuario.findOne({ username });
    if (usuario && await bcrypt.compare(password, usuario.passwordHash)) {
        req.session.userId = usuario._id;
        req.session.username = usuario.username;
        req.flash('success', 'Login bem-sucedido!');
        return res.redirect('/home');
    } else {
        req.flash('danger', 'Usuário ou senha incorretos.');
        return res.redirect('/');
    }
});

app.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

app.post('/cadastrar', async (req, res) => {
    const { username, password, acceptPrivacy } = req.body;

    if (!acceptPrivacy) {
        req.flash('warning', 'Você deve aceitar a Política de Privacidade para se cadastrar.');
        return res.redirect('/cadastro');
    }

    const usuarioExistente = await Usuario.findOne({ username });
    if (usuarioExistente) {
        req.flash('warning', 'Usuário já existe.');
        return res.redirect('/cadastro');
    }

    const hash = await bcrypt.hash(password, 10);
    const novoUsuario = new Usuario({ username, passwordHash: hash });
    await novoUsuario.save();

    req.flash('success', 'Cadastro realizado com sucesso!');
    res.redirect('/');
});

app.get('/home', (req, res) => {
    if (!req.session.userId) {
        req.flash('warning', 'Você precisa fazer login primeiro.');
        return res.redirect('/');
    }
    res.render('home', { username: req.session.username });
});

app.get('/logout', (req, res) => {
    req.flash('info', 'Você saiu com sucesso.');
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
            return res.status(500).send('Erro ao sair do sistema.');
        }
        res.redirect('/');
    });
});

app.get('/cadastrar_dispositivo', (req, res) => {
    if (!req.session.userId) {
        req.flash('warning', 'Faça login para cadastrar dispositivos.');
        return res.redirect('/');
    }
    res.render('cadastrar_dispositivo');
});

app.post('/cadastrar_dispositivo', async (req, res) => {
    if (!req.session.userId) {
        req.flash('warning', 'Faça login para cadastrar dispositivos.');
        return res.redirect('/');
    }

    const { nome, horas, potencia } = req.body;
    const novoDispositivo = new Dispositivo({
        nome,
        horas: Number(horas),
        potencia: Number(potencia),
        dono: req.session.userId
    });

    await novoDispositivo.save();
    req.flash('success', 'Dispositivo cadastrado com sucesso!');
    res.redirect('/consultar_dispositivos');
});

app.get('/consultar_dispositivos', async (req, res) => {
    if (!req.session.userId) {
        req.flash('warning', 'Faça login para acessar os dispositivos.');
        return res.redirect('/');
    }

    const dispositivos = await Dispositivo.find({ dono: req.session.userId });
    res.render('consultar_dispositivos', { dispositivos });
});

app.get('/privacy_policy', (req, res) => {
    res.render('privacy_policy');
});

app.get('/perfil', (req, res) => {
    if (!req.session.userId) {
        req.flash('warning', 'Faça login para acessar seu perfil.');
        return res.redirect('/');
    }
    res.render('perfil', { username: req.session.username });
});

app.post('/excluir_conta', async (req, res) => {
    if (!req.session.userId) {
        req.flash('warning', 'Faça login para excluir sua conta.');
        return res.redirect('/');
    }

    await Usuario.findByIdAndDelete(req.session.userId);
    await Dispositivo.deleteMany({ dono: req.session.userId });

    req.flash('info', 'Sua conta foi excluída com sucesso.');
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
            return res.status(500).send('Erro ao excluir a conta.');
        }
        res.redirect('/');
    });
});

// --- Correção fundamental: process.env.PORT ---
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});