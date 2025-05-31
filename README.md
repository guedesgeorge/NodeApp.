# Sistema de Cadastro de Usuários e Dispositivos ⚡

Este projeto é uma aplicação web desenvolvida com Node.js, com persistência de dados em banco de dados online. O objetivo principal é permitir que usuários possam se cadastrar, autenticar e gerenciar dispositivos elétricos de forma prática e segura.

# 🚀 Funcionalidades

 ✅ Cadastro de usuário com senha criptografada🔐 Login com sessão autenticada🏠 Página inicial com boas-vindas📦 Cadastro de dispositivos elétricos (nome, horas de uso, potência)📋 Listagem dos dispositivos do usuário🗑️ Exclusão de conta e dispositivos vinculados📃 Visualização da política de privacidade e perfil

# 🛠️ Tecnologias Utilizadas

Node.js (v18+)

Express.js

MongoDB Atlas (banco de dados online)

Mongoose (ODM para MongoDB)

EJS (Embedded JavaScript Templates)

bcrypt (criptografia de senhas)

express-session & connect-flash (sessões e mensagens temporárias)

# 🧱 Estrutura do Projeto

app.js: Arquivo principal com configuração de rotas, conexão com banco e lógica de negócio.

models/Usuario.js e models/Dispositivo.js: Modelos de dados (separáveis).

views/: Páginas .ejs renderizadas pelo servidor.

public/: Arquivos estáticos (CSS, imagens, etc.).

package.json: Dependências e scripts de inicialização.

# 📁 Estrutura das Views (EJS)

login.ejs – Tela de login com exibição de mensagens flash.

cadastro.ejs – Formulário de cadastro de novos usuários.

home.ejs – Tela principal após login.

cadastrar_dispositivo.ejs – Formulário para registrar dispositivo.

consultar_dispositivos.ejs – Lista de dispositivos cadastrados.

perfil.ejs – Perfil do usuário logado.

privacy_policy.ejs – Exibição da política de privacidade.

# 💾 Banco de Dados (MongoDB Atlas)

A conexão é feita utilizando uma URL segura de banco de dados online. Exemplo:

const mongoUri = 'mongodb+srv://usuario:senha@cluster.mongodb.net/nomeBanco?retryWrites=true&w=majority';

Modelos

Usuário
{
  username: String,
  passwordHash: String
}
Dispositivos
{
  nome: String,
  horas: Number,
  potencia: Number,
  dono: ObjectId
}

# 🧪 Como Rodar o Projeto

# 1. Clone o repositório
https://github.com/guedesgeorge/NodeApp
cd nome-do-repositorio

# 2. Instale as dependências
npm install

# 3. Configure a URL do MongoDB em app.js (ou use dotenv)

# 4. Inicie o servidor
npm start

# 5. Acesse em
http://localhost:3000
