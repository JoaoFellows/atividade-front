# 🛍️ Sistema de compras online com JSON Server
Este projeto é um sistema de e-commerce básico utilizando Next.js no frontend e JSON Server como mock API para simular um banco de dados.

# 📦 Pré-requisitos
Antes de iniciar, certifique-se de ter:

Node.js instalado (recomendado: versão LTS)

npm instalado (vem com o Node.js)

json-server (será executado via npx, não precisa instalar globalmente)

Vá até a raiz do projeto e instale as dependências com:

`npm install`

# 🚀 Como rodar o projeto

1. Inicie a mock API (JSON Server)
No terminal, vá até a pasta onde está o db.json e rode:


`cd src/api`
`npx json-server db.json`

O JSON Server ficará disponível em:

http://localhost:3000

⚠️ Isso garante que a aplicação Next.js usará a próxima porta (3001) para evitar conflitos.

2. Volte para a raiz do projeto e rode a aplicação Next.js com o comando:

`npm run dev`

A aplicação estará disponível em:

http://localhost:3001