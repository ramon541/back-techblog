# 📝 TechBlog Backend API

> Uma API RESTful moderna para um blog de tecnologia, construída com Node.js, TypeScript, Express e Prisma.

## 🚀 Tecnologias

-   **Node.js** - Runtime JavaScript
-   **TypeScript** - Tipagem estática
-   **Express** - Framework web
-   **Prisma** - ORM moderno
-   **MySQL** - Banco de dados
-   **Bcrypt** - Hash de senhas
-   **Zod** - Validação de dados

## 📁 Estrutura do Projeto

```
src/
├── app.ts                     # Configuração principal do Express
├── server.ts                  # Inicialização do servidor
├── config/                    # Configurações da aplicação
│   ├── database.ts           # Configuração do banco de dados
│   └── env.ts                # Variáveis de ambiente
├── core/                     # Núcleo da aplicação
│   └── domain/
│       └── entities/         # Entidades de domínio
├── middlewares/              # Middlewares customizados
├── modules/                  # Módulos da aplicação
│   ├── auth/                 # Autenticação
│   └── users/                # Gerenciamento de usuários
├── routes/                   # Roteamento principal
├── utils/                    # Utilitários
│   ├── logger.ts            # Sistema de logs
│   ├── password.ts          # Utilitários de senha
│   └── result.ts            # Pattern Result para tratamento de erros
└── generated/                # Código gerado pelo Prisma
```

## 🗃️ Modelo de Dados

### User (Usuário)

```typescript
{
  id: string           # UUID único
  name: string         # Nome do usuário
  email: string        # Email único
  password: string     # Senha hasheada
  avatar?: string      # URL do avatar (opcional)
  deletedAt?: Date     # Soft delete
  createdAt: Date      # Data de criação
  updatedAt: Date      # Data de atualização
}
```

### Article (Artigo)

```typescript
{
  id: string           # UUID único
  title: string        # Título do artigo
  content: string      # Conteúdo completo
  authorId: string     # ID do autor
  deletedAt?: Date     # Soft delete
  createdAt: Date      # Data de criação
  updatedAt: Date      # Data de atualização
}
```

### Tag (Etiqueta)

```typescript
{
  id: string           # UUID único
  name: string         # Nome da tag (único)
  deletedAt?: Date     # Soft delete
  createdAt: Date      # Data de criação
}
```

### Comment (Comentário)

```typescript
{
  id: string           # UUID único
  content: string      # Conteúdo do comentário
  articleId: string    # ID do artigo
  userId: string       # ID do usuário
  parentId?: string    # ID do comentário pai (para respostas)
  deletedAt?: Date     # Soft delete
  createdAt: Date      # Data de criação
}
```

## 🛠️ Configuração e Instalação

### Pré-requisitos

-   Node.js (versão 18+)
-   MySQL
-   Yarn ou NPM

### 1. Clone o repositório

```bash
git clone https://github.com/ramon541/back-techblog.git
cd back-techblog
```

### 2. Instale as dependências

```bash
yarn install
# ou
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="mysql://usuario:senha@localhost:3306/techblog"

# Application
PORT=3000
NODE_ENV=development

# JWT (quando implementado)
JWT_SECRET=sua_chave_secreta_super_segura
JWT_EXPIRES_IN=24h
```

### 4. Configure o banco de dados

```bash
# Gerar o cliente Prisma
yarn prisma:gen

# Executar migrações
yarn prisma:dev

# (Opcional) Reset do banco de dados
yarn prisma:reset
```

### 5. Inicie o servidor

```bash
yarn dev
```

O servidor estará rodando em `http://localhost:3000`

## 📚 Scripts Disponíveis

```bash
yarn dev           # Inicia o servidor em modo desenvolvimento
yarn build         # Compila o TypeScript para JavaScript
yarn prisma:gen    # Gera o cliente Prisma
yarn prisma:dev    # Executa migrações em desenvolvimento
yarn prisma:reset  # Reset completo do banco de dados
yarn prisma:deploy # Deploy de migrações em produção
```

## 🏗️ Arquitetura

### Padrões Utilizados

#### 1. **Result Pattern**

Sistema de tratamento de erros sem exceptions:

```typescript
type Result<T, E = string> =
    | { success: true; data: T }
    | { success: false; error: E };
```

#### 2. **Repository Pattern**

Abstração da camada de dados para facilitar testes e manutenção.

#### 3. **Service Layer**

Camada de negócio que contém as regras de negócio da aplicação.

#### 4. **Controller Layer**

Camada de apresentação que lida com requisições HTTP.

### Fluxo de Dados

```
HTTP Request → Controller → Service → Repository → Database
                   ↓
HTTP Response ← Controller ← Service ← Repository ← Database
```

## 🔧 Funcionalidades Implementadas

### Módulo de Usuários

-   ✅ Registro de usuários
-   ✅ Hash de senhas com bcrypt
-   ✅ Validação de dados com Zod
-   ✅ Soft delete (desativação de contas)
-   ✅ Reativação de contas

### Módulo de Autenticação

-   🚧 Login de usuários (em desenvolvimento)
-   🚧 Middleware de autenticação (planejado)

### Sistema de Logs

-   ✅ Middleware de logging de requisições
-   ✅ Logger customizável

## 🚧 Roadmap

### Próximas Funcionalidades

-   [ ] CRUD de artigos
-   [ ] Sistema de tags
-   [ ] Sistema de comentários
-   [ ] Upload de imagens
-   [ ] Busca e filtros
-   [ ] Paginação
-   [ ] Rate limiting

## 👨‍💻 Autor

**Ramon Monteiro**

-   GitHub: [@ramon541](https://github.com/ramon541)
-   Email: ramondiasmonteiro@gmail.com

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
