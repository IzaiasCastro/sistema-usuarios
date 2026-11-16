Antes de começar, certifique-se de ter instalado em sua máquina:

* [Node.js](https://nodejs.org/) (versão 18 ou superior)

```

npm install
npm start
🚀 Como Rodar a Aplicação Localmente
```

Para o funcionamento completo, é necessário iniciar o **Back-end** e o **Front-end**. Abra **dois terminais** (Prompt de Comando, PowerShell ou terminal do VS Code).

### 1. Iniciando o Back-end (API + Banco de Dados)

No **primeiro terminal**, acesse a pasta `backend`, instale as dependências e inicie o servidor:

```
cd backend
```

> ✅ Quando o servidor iniciar com sucesso, aparecerá a mensagem:
>
> `Servidor API rodando em http://localhost:3000`
>
> *(Mantenha este terminal aberto).*

### 2. Iniciando o Front-end (Interface Web)

> ⚠️ **Importante:** Não abra o arquivo `index.html` com duplo clique (`file:///`), pois os navegadores bloqueiam módulos JavaScript (`type="module"`) por política de segurança (CORS). Utilize um servidor HTTP local conforme uma das opções abaixo:

#### Opção A: Usando Node.js (`npx serve`) — Recomendado

No **segundo terminal**, entre na pasta `frontend` e execute:

```
cd frontend
npx serve -l 5500

```

*(Se o terminal perguntar `Ok to proceed? (y)`, digite `y` e pressione **Enter**).*

#### Opção B: Usando Python

Caso tenha Python instalado, entre na pasta `frontend` e execute:

```
cd frontend
python -m http.server 5500

```

#### Opção C: Usando a extensão Live Server (VS Code)

1. Instale a extensão **Live Server** no VS Code.

2. Clique com o botão direito em `frontend/index.html` e selecione **"Open with Live Server"**.

### 3. Acessando no Navegador

Com ambos os servidores rodando, abra seu navegador e acesse:

👉 **http://localhost:5500**

## 🔌 Endpoints da API

| Método | Rota | Acesso | Descrição | 
| ----- | ----- | ----- | ----- | 
| `POST` | `/api/auth/register` | Público | Cadastra um novo usuário | 
| `POST` | `/api/auth/login` | Público | Autentica o usuário e retorna o Token JWT | 
| `GET` | `/api/users` | Privado (JWT) | Lista todos os usuários cadastrados | 
| `PUT` | `/api/users/:id` | Privado (JWT) | Atualiza os dados de um usuário | 
| `DELETE` | `/api/users/:id` | Privado (JWT) | Remove um usuário pelo ID | 
