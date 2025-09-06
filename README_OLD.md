# 📝 TechBlog Backend API

> Uma API RESTful robusta para um blog de tecnologia, construída com Node.js, TypeScript, Express e Prisma, seguindo princípios de Clean Architecture e padrões modernos de desenvolvimento.

## � Sumário

-   [🚀 Tecnologias](#-tecnologias)
-   [🏗️ Arquitetura](#️-arquitetura)
-   [🗃️ Modelo de Dados](#️-modelo-de-dados)
-   [🛠️ Configuração e Instalação](#️-configuração-e-instalação)
-   [📚 Scripts Disponíveis](#-scripts-disponíveis)
-   [🔧 Funcionalidades Implementadas](#-funcionalidades-implementadas)
-   [📊 API Endpoints](#-api-endpoints)
-   [💡 Exemplos de Uso](#-exemplos-de-uso)
-   [🚧 Roadmap](#-roadmap)
-   [👨‍💻 Autor](#-autor)

---

## �🚀 Tecnologias

-   **Node.js 18+** - Runtime JavaScript/TypeScript
-   **TypeScript 5.9** - Tipagem estática e segurança de código
-   **Express 5.1** - Framework web minimalista e flexível
-   **Prisma 6.15** - ORM moderno com type-safety
-   **MySQL** - Sistema de gerenciamento de banco de dados
-   **Bcrypt** - Hash seguro de senhas
-   **Zod** - Validação de dados e schemas TypeScript-first
-   **TSX** - TypeScript execution e hot-reload

## 🏗️ Arquitetura

### Padrões Implementados

-   **Result Pattern** - Tratamento funcional de erros sem exceptions
-   **Repository Pattern** - Abstração da camada de dados
-   **Service Layer** - Lógica de negócio centralizada
-   **Controller Layer** - Interface HTTP/REST
-   **Dependency Injection** - Inversão de dependências
-   **Clean Architecture** - Separação clara de responsabilidades

### Estrutura do Projeto

```
back-techblog/
├── src/
│   ├── app.ts                    # Configuração do Express
│   ├── server.ts                 # Inicialização do servidor
│   ├── config/                   # Configurações da aplicação
│   │   ├── database.ts           # Configuração Prisma + logs
│   │   └── env.ts                # Validação de variáveis de ambiente
│   ├── middlewares/              # Middlewares customizados
│   │   ├── errorHandler.middleware.ts    # Tratamento global de erros
│   │   └── requestLogging.middleware.ts  # Logging de requisições
│   ├── modules/                # Módulos da aplicação (Domain-driven)
│   │   ├── auth/               # Módulo de autenticação
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.schema.ts  # Validações Zod
│   │   │   └── auth.model.d.ts # Tipos TypeScript
│   │   └── users/              # Módulo de usuários
│   │       ├── user.controller.ts
│   │       ├── user.service.ts
│   │       ├── user.repository.ts
│   │       ├── user.routes.ts
│   │       ├── user.schema.ts
│   │       └── user.model.d.ts
│   ├── routes/                  # Roteamento principal
│   │   └── index.ts
│   ├── types/                   # Tipos globais
│   │   └── controller.type.d.ts
│   ├── utils/                  # Utilitários compartilhados
│   │   ├── logger.ts           # Sistema de logs estruturado
│   │   ├── password.ts         # Utilitários de criptografia
│   │   └── result.ts           # Result Pattern + ApplicationException
│   └── generated/              # Código gerado pelo Prisma
├── prisma/
│   ├── schema.prisma           # Schema do banco de dados
│   └── migrations/             # Migrações do banco
├── tsconfig.json               # Configuração TypeScript
├── package.json                # Dependencies e scripts
└── .env.example                # Template de variáveis de ambiente
```

## 🗃️ Modelo de Dados

### Entidades Principais

#### User (Usuário)

```typescript
{
  id: string           # UUID único
  name: string         # Nome do usuário
  email: string        # Email único (constraint de unicidade)
  password: string     # Senha hasheada com bcrypt
  avatar?: string      # URL do avatar (opcional)
  deletedAt?: Date     # Soft delete timestamp
  createdAt: Date      # Data de criação (auto)
  updatedAt: Date      # Data de atualização (auto)

  // Relacionamentos
  articles: Article[]  # Artigos do usuário
  comments: Comment[]  # Comentários do usuário
}
```

#### Article (Artigo)

```typescript
{
  id: string           # UUID único
  title: string        # Título do artigo
  content: string      # Conteúdo em markdown/texto
  authorId: string     # FK para User
  deletedAt?: Date     # Soft delete timestamp
  createdAt: Date      # Data de criação (auto)
  updatedAt: Date      # Data de atualização (auto)

  // Relacionamentos
  author: User         # Autor do artigo
  tags: ArticleTag[]   # Tags do artigo (many-to-many)
  comments: Comment[]  # Comentários do artigo
}
```

#### Tag (Etiqueta)

```typescript
{
  id: string           # UUID único
  name: string         # Nome da tag (único)
  deletedAt?: Date     # Soft delete timestamp
  createdAt: Date      # Data de criação (auto)

  // Relacionamentos
  articles: ArticleTag[] # Artigos com esta tag
}
```

#### Comment (Comentário)

```typescript
{
  id: string           # UUID único
  content: string      # Conteúdo do comentário
  articleId: string    # FK para Article
  userId: string       # FK para User
  parentId?: string    # FK para Comment (comentários aninhados)
  deletedAt?: Date     # Soft delete timestamp
  createdAt: Date      # Data de criação (auto)

  // Relacionamentos
  article: Article     # Artigo comentado
  user: User          # Autor do comentário
  parent?: Comment    # Comentário pai (se é resposta)
  replies: Comment[]  # Respostas ao comentário
}
```

#### ArticleTag (Relacionamento Many-to-Many)

```typescript
{
  articleId: string    # FK para Article
  tagId: string        # FK para Tag
  deletedAt?: Date     # Soft delete timestamp

  // Chave composta: [articleId, tagId]
}
```

### Características do Modelo

-   **UUIDs**: Identificadores únicos universais para todas as entidades
-   **Soft Delete**: Exclusão lógica com timestamp (preserva dados)
-   **Timestamps**: Criação e atualização automáticas
-   **Relacionamentos**: Foreign keys com cascade delete
-   **Constraints**: Unicidade em emails e nomes de tags
-   **Comentários Aninhados**: Suporte a threads de discussão

## 🛠️ Configuração e Instalação

### Pré-requisitos

-   **Node.js 18+** - [Download](https://nodejs.org/)
-   **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/)
-   **Yarn** ou **NPM** - Gerenciador de pacotes

### 1. Clone e instale dependências

```bash
# Clone o repositório
git clone https://github.com/ramon541/back-techblog.git
cd back-techblog

# Instale as dependências
yarn install
# ou
npm install
```

### 2. Configure o banco de dados

```bash
# Crie o banco de dados MySQL
mysql -u root -p
CREATE DATABASE techblog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
nano .env
```

**Arquivo `.env`:**

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/techblog"

# Application
PORT=3000

# Security
BCRYPT_SALT_ROUNDS=12
```

### 4. Execute as migrações do banco

```bash
# Gere o cliente Prisma
yarn prisma:gen

# Execute as migrações
yarn prisma:dev

# (Opcional) Visualize os dados
yarn prisma studio
```

### 5. Inicie o servidor

```bash
# Modo desenvolvimento (hot-reload)
yarn dev

# Build para produção
yarn build
node dist/server.js
```

**✅ Servidor rodando em:** `http://localhost:3000`

## 📚 Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev              # Inicia servidor com hot-reload
yarn build            # Compila TypeScript para JavaScript

# Banco de dados
yarn prisma:gen       # Gera cliente Prisma
yarn prisma:dev       # Cria/aplica migrações em dev
yarn prisma:reset     # Reset completo do banco
yarn prisma:deploy    # Aplica migrações em produção
yarn seed             # Popula banco com dados de exemplo

# Utilitários
yarn prisma studio    # Interface visual do banco
yarn prisma db pull   # Sincroniza schema com banco existente
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

## 🏗️ Arquitetura

### Padrões Implementados

-   **Result Pattern** - Tratamento funcional de erros sem exceptions
-   **Repository Pattern** - Abstração da camada de dados
-   **Service Layer** - Lógica de negócio centralizada
-   **Controller Layer** - Interface HTTP/REST
-   **Dependency Injection** - Inversão de dependências
-   **Clean Architecture** - Separação clara de responsabilidades

### Fluxo de Dados

```
HTTP Request → Middleware → Controller → Service → Repository → Database
                                ↓
HTTP Response ← Middleware ← Controller ← Service ← Repository ← Database
```

### Result Pattern Detalhado

**Estrutura do Result:**

```typescript
type Result<T, E = ApplicationException> =
    | { success: true; data: T; message: string; statusCode: number }
    | {
          success: false;
          data: null;
          error: string | string[];
          statusCode: number;
      };
```

**ApplicationErrorEnum - Tipos de Erro Padronizados:**

```typescript
enum ApplicationErrorEnum {
    // Client Errors (4xx)
    RequiredField = 'REQUIRED_FIELD', // 400 - Campo obrigatório
    InvalidField = 'INVALID_FIELD', // 400 - Campo inválido
    ValidationError = 'VALIDATION_ERROR', // 400 - Dados inválidos
    Unauthorized = 'UNAUTHORIZED', // 401 - Não autorizado
    Forbidden = 'FORBIDDEN', // 403 - Acesso negado
    NotFound = 'NOT_FOUND', // 404 - Recurso não encontrado
    Conflict = 'CONFLICT', // 409 - Conflito de dados

    // Server Errors (5xx)
    InfrastructureError = 'INFRASTRUCTURE_ERROR', // 500 - Erro interno
    DatabaseError = 'DATABASE_ERROR', // 500 - Erro no banco
    ExternalServiceError = 'EXTERNAL_SERVICE_ERROR', // 502 - Erro externo
}
```

**Métodos Disponíveis do Result:**

```typescript
// ✅ Sucesso
Result.success(data, message?, statusCode?)  // Genérico
Result.ok(data, message?)                    // 200 OK
Result.created(data, message?)               // 201 Created

// ❌ Erro - Nova Sintaxe Simplificada
Result.error(ApplicationErrorEnum.NotFound)                    // Mensagem padrão
Result.error(ApplicationErrorEnum.NotFound, 'Custom message')  // Mensagem customizada
Result.error(ApplicationErrorEnum.ValidationError, ['erro1', 'erro2'])  // Múltiplas mensagens

// ❌ Também aceita string/array diretamente
Result.error('Erro customizado', statusCode?)
Result.error(['Erro 1', 'Erro 2'], statusCode?)
```

### Exemplo de Uso do Result Pattern

```typescript
// Service Layer - Nova Sintaxe
export const userService = {
    async create(data: CreateUserDTO): Promise<Result<UserResponseDTO>> {
        try {
            const existingUser = await userRepository.findByEmail(data.email);

            // ✅ Nova sintaxe com ApplicationErrorEnum
            if (existingUser) {
                return Result.error(
                    ApplicationErrorEnum.Conflict,
                    'Usuário já cadastrado com esse email'
                );
            }

            const user = await userRepository.create(data);
            return Result.created(user, 'Usuário criado com sucesso');
        } catch (error) {
            // ✅ Uso direto do enum
            return Result.error(
                ApplicationErrorEnum.InfrastructureError,
                'Erro ao criar usuário'
            );
        }
    },

    async get(id: string): Promise<Result<UserResponseDTO>> {
        try {
            const user = await userRepository.findById({ id });

            // ✅ Sintaxe limpa sem mensagem customizada (usa padrão)
            if (!user) return Result.error(ApplicationErrorEnum.NotFound);

            return Result.ok(user);
        } catch {
            return Result.error(ApplicationErrorEnum.InfrastructureError);
        }
    },
};

// Controller Layer
export const userController = {
    async create(req: Request, res: Response) {
        const validatedData = createUserSchema.parse(req.body);
        const result = await userService.create(validatedData);

        // Result já vem com statusCode apropriado automaticamente
        return res.status(result.statusCode).json(result);
    },
};
```

**Vantagens da Nova Implementação:**

-   ✅ **Sintaxe Limpa**: `Result.error(ApplicationErrorEnum.NotFound)`
-   ✅ **Type Safety**: Enum previne erros de digitação
-   ✅ **Consistência**: Status codes automáticos por tipo de erro
-   ✅ **Mensagens Padrão**: Fallback automático para mensagens em português
-   ✅ **Flexibilidade**: Aceita mensagens customizadas e arrays
-   ✅ **Manutenibilidade**: Centralização dos tipos de erro

### 🔧 Funcionalidades Implementadas

#### ✅ Sistema Completo de Usuários

-   **CRUD completo** - Create, Read, Update, Delete
-   **Registro e autenticação** - Login/registro com validação
-   **Soft delete** - Desativação/reativação de contas
-   **Validação de email** - Prevenção de duplicatas
-   **Upload de avatar** - Suporte a URLs de imagem
-   **Busca flexível** - Por nome ou email
-   **Paginação** - Lista de usuários paginada

#### ✅ Sistema Completo de Artigos

-   **CRUD completo** - Criação, leitura, atualização e exclusão
-   **Relacionamento com tags** - Many-to-many através de ArticleTag
-   **Busca avançada** - Por título, conteúdo ou tags
-   **Filtro por tags** - Listagem de artigos por tag específica
-   **Paginação** - Lista paginada com skip/take
-   **Sincronização de tags** - Automática ao criar/atualizar artigos

#### ✅ Sistema Completo de Tags

-   **CRUD completo** - Gerenciamento completo de tags
-   **Validação de unicidade** - Prevenção de tags duplicadas
-   **Relacionamento automático** - Associação com artigos
-   **Busca por nome** - Localização rápida de tags

#### ✅ Sistema Completo de Comentários

-   **CRUD completo** - Criação, leitura, atualização e exclusão
-   **Relacionamentos** - Com artigos e usuários
-   **Comentários aninhados** - Suporte a respostas (parentId)
-   **Busca e filtros** - Por artigo, usuário ou conteúdo

#### ✅ Sistema de Autenticação Robusto

-   **Login seguro** - Validação de credenciais
-   **Hash de senhas** - Bcrypt com salt configurável
-   **Validação de status** - Verificação de contas ativas
-   **Registro completo** - Criação de novos usuários

#### ✅ Arquitetura e Padrões Avançados

-   **Result Pattern** - Tratamento funcional de erros
-   **ApplicationException** - Sistema de erros tipados e padronizados
-   **Clean Architecture** - Separação clara de responsabilidades
-   **Repository Pattern** - Abstração da camada de dados
-   **Service Layer** - Lógica de negócio centralizada
-   **Dependency Injection** - Inversão de dependências

#### ✅ Validação e Segurança

-   **Schemas Zod** - Validação TypeScript-first para todas as entidades
-   **Sanitização automática** - Remoção de dados sensíveis
-   **Type Safety** - Tipagem estrita em toda aplicação
-   **Error Handling** - Middleware global de tratamento de erros
-   **Request Logging** - Log estruturado de todas as requisições

#### ✅ Banco de Dados e Performance

-   **Prisma ORM** - Type-safe database access
-   **Migrações versionadas** - Controle de versão do schema
-   **Relacionamentos complexos** - Many-to-many, One-to-many
-   **Soft delete universal** - Em todas as entidades
-   **UUIDs** - Identificadores únicos para segurança
-   **Connection pooling** - Gerenciamento otimizado de conexões
-   **Database logging** - Logs detalhados de queries

#### ✅ Observabilidade e Monitoramento

-   **Logging estruturado** - Sistema de logs customizado
-   **Performance tracking** - Tempo de execução de operações
-   **Error tracking** - Logs detalhados de erros
-   **Request monitoring** - Acompanhamento de requisições HTTP

#### ✅ Funcionalidades Avançadas

-   **Busca flexível** - Busca por múltiplos campos com OR
-   **Paginação inteligente** - Skip/take com contagem total
-   **Seed de dados** - Script para popular banco com dados realistas
-   **Many-to-many helpers** - Funções auxiliares para relacionamentos
-   **Sincronização automática** - Tags são sincronizadas automaticamente

## 📊 API Endpoints

### 🔐 Autenticação

```http
POST   /api/auth/login       # Login com email/senha
POST   /api/auth/register    # Registro de novo usuário
```

### 👤 Usuários

```http
GET    /api/users           # Listar usuários (com paginação e busca)
GET    /api/users/:id       # Buscar usuário por ID
POST   /api/users           # Criar usuário
PUT    /api/users/:id       # Atualizar usuário
DELETE /api/users/:id       # Soft delete usuário
```

### 📝 Artigos

```http
GET    /api/articles        # Listar artigos (com paginação, busca e filtro por tag)
GET    /api/articles/:id    # Buscar artigo por ID
POST   /api/articles        # Criar artigo
PUT    /api/articles/:id    # Atualizar artigo
DELETE /api/articles/:id    # Soft delete artigo
```

### 🏷️ Tags

```http
GET    /api/tags            # Listar tags
GET    /api/tags/:id        # Buscar tag por ID
POST   /api/tags            # Criar tag
PUT    /api/tags/:id        # Atualizar tag
DELETE /api/tags/:id        # Soft delete tag
```

### 💬 Comentários

```http
GET    /api/comments        # Listar comentários (com filtros)
GET    /api/comments/:id    # Buscar comentário por ID
POST   /api/comments        # Criar comentário
PUT    /api/comments/:id    # Atualizar comentário
DELETE /api/comments/:id    # Soft delete comentário
```

### Parâmetros de Query (Busca e Paginação)

```http
# Paginação
?take=10&skip=0

# Busca flexível
?search=termo

# Filtro por tag (somente artigos)
?tagId=uuid-da-tag
```

### Respostas Padronizadas

**Sucesso:**

```json
{
    "success": true,
    "data": {
        /* objeto retornado */
    },
    "message": "Operação realizada com sucesso",
    "statusCode": 200
}
```

**Erro:**

```json
{
    "success": false,
    "data": null,
    "error": "Mensagem de erro específica"
}
```

---

## 💡 Exemplos de Uso

### 🔐 Autenticação

#### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@email.com",
    "password": "123456"
  }'
```

**Resposta de sucesso:**

```json
{
    "success": true,
    "data": {
        "user": {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "name": "Admin User",
            "email": "admin@email.com",
            "avatar": null
        }
    },
    "message": "Login realizado com sucesso",
    "statusCode": 200
}
```

#### Registro

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Novo Usuário",
    "email": "novo@email.com",
    "password": "123456"
  }'
```

### 👤 Usuários

#### Listar usuários com paginação e busca

```bash
curl 'http://localhost:3000/api/users?search=admin&take=5&skip=0'
```

**Resposta:**

```json
{
    "success": true,
    "data": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "name": "Admin User",
            "email": "admin@email.com",
            "avatar": null,
            "createdAt": "2025-09-06T12:00:00.000Z",
            "updatedAt": "2025-09-06T12:00:00.000Z"
        }
    ],
    "pagination": {
        "total": 1,
        "take": 5,
        "skip": 0
    },
    "message": "Usuários listados com sucesso",
    "statusCode": 200
}
```

### 📝 Artigos

#### Criar artigo com tags

```bash
curl -X POST http://localhost:3000/api/articles \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Introdução ao TypeScript",
    "content": "TypeScript é uma linguagem que adiciona tipagem estática ao JavaScript...",
    "authorId": "550e8400-e29b-41d4-a716-446655440000",
    "tagIds": ["tag-uuid-1", "tag-uuid-2"]
  }'
```

#### Listar artigos com filtro por tag

```bash
curl 'http://localhost:3000/api/articles?tagId=tag-uuid-typescript&take=3'
```

### 🏷️ Tags

#### Criar tag

```bash
curl -X POST http://localhost:3000/api/tags \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "TypeScript"
  }'
```

### 💬 Comentários

#### Adicionar comentário

```bash
curl -X POST http://localhost:3000/api/comments \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "Excelente artigo sobre TypeScript!",
    "articleId": "article-uuid",
    "userId": "user-uuid"
  }'
```

### ❌ Exemplo de Erro

**Erro de validação:**

```json
{
    "success": false,
    "data": null,
    "error": "Email é obrigatório",
    "statusCode": 400
}
```

**Erro de autenticação:**

```json
{
    "success": false,
    "data": null,
    "error": "Credenciais inválidas",
    "statusCode": 401
}
```

**Erro de recurso não encontrado:**

````json
{
  "success": false,
  "data": null,
  "error": "Usuário não encontrado",
  "statusCode": 404
}

## 🚧 Roadmap

### ✅ Funcionalidades Implementadas (100% Completas)

#### 🏗️ **Arquitetura Sólida**
-   **Result Pattern Avançado** - Tratamento de erros funcional com ApplicationErrorEnum
-   **Clean Architecture** - Separação clara: Controllers → Services → Repositories
-   **Type Safety Total** - TypeScript estrito em toda aplicação
-   **Dependency Injection** - Inversão de dependências implementada

#### � **Sistema de Autenticação Completo**
-   **Login e Registro** - Endpoints `/api/auth/login` e `/api/auth/register`
-   **Validação de Credenciais** - Verificação segura com bcrypt
-   **Schemas Zod** - Validação robusta de dados de entrada
-   **Status de Conta** - Verificação de contas ativas/inativas

#### 👤 **CRUD Completo de Usuários**
-   **Operações Completas** - Create, Read, Update, Delete
-   **Busca Flexível** - Por nome ou email com OR queries
-   **Paginação Avançada** - Skip/take com contagem total
-   **Soft Delete** - Exclusão lógica preservando dados
-   **Validação de Email** - Unicidade e formato

#### 📝 **Sistema de Artigos Avançado**
-   **CRUD Completo** - Todas operações implementadas
-   **Many-to-Many com Tags** - Relacionamento através de ArticleTag
-   **Sincronização Automática** - Tags são atualizadas automaticamente
-   **Busca Inteligente** - Por título, conteúdo e tags
-   **Filtros por Tag** - Listagem focada por categoria

#### 🏷️ **Gerenciamento de Tags**
-   **CRUD Completo** - Criação, leitura, atualização, exclusão
-   **Unicidade Garantida** - Prevenção de duplicatas
-   **Relacionamento Automático** - Associação transparente com artigos

#### 💬 **Sistema de Comentários**
-   **CRUD Completo** - Todas operações disponíveis
-   **Comentários Aninhados** - Suporte a threads (parentId)
-   **Relacionamentos Múltiplos** - Com artigos e usuários
-   **Busca e Filtros** - Por artigo, usuário ou conteúdo

#### 🗃️ **Banco de Dados Robusto**
-   **Prisma ORM** - Type-safe com cliente gerado
-   **Migrações Versionadas** - Controle completo de versões
-   **UUIDs em Tudo** - Identificadores únicos e seguros
-   **Soft Delete Universal** - Em todas as entidades
-   **Relacionamentos Complexos** - One-to-many e many-to-many

#### 🛡️ **Segurança e Validação**
-   **Schemas Zod Completos** - Para todas as entidades
-   **ApplicationErrorEnum** - Padronização de erros
-   **Sanitização Automática** - Remoção de dados sensíveis
-   **Error Handling Global** - Middleware centralizado

#### 📊 **Observabilidade Total**
-   **Logging Estruturado** - Sistema customizado de logs
-   **Request Monitoring** - Todas requisições logadas
-   **Database Logging** - Queries e performance
-   **Error Tracking** - Rastreamento detalhado

#### 🚀 **DevOps e Tooling**
-   **Seed Script Realista** - Dados de exemplo consistentes
-   **Hot Reload** - Desenvolvimento com tsx watch
-   **Build System** - Compilação TypeScript otimizada
-   **Database Tools** - Prisma Studio e management

## 📈 Estatísticas do Projeto

-   **📁 Linhas de Código**: ~3.000+ linhas TypeScript
-   **🏗️ Arquivos**: 35+ arquivos organizados em módulos
-   **🧪 Cobertura**: Result Pattern em 100% das operações
-   **🔒 Type Safety**: 100% TypeScript strict mode
-   **📦 Módulos**: 5 módulos principais (users, articles, tags, comments, auth)
-   **🗃️ Entidades**: 5 entidades com relacionamentos complexos
-   **🚀 Performance**: Queries otimizadas com Prisma ORM

### Estrutura de Arquivos por Módulo

```
📂 src/modules/
├── 👤 users/          # 6 arquivos - CRUD completo
├── 📝 articles/       # 6 arquivos - Sistema de artigos
├── 🏷️ tags/           # 6 arquivos - Gerenciamento de tags
├── 💬 comments/       # 6 arquivos - Sistema de comentários
├── 🔐 auth/           # 5 arquivos - Autenticação
└── 🔗 articleTags/    # 4 arquivos - Relacionamento M:N
```

---

## � Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

### MIT License

```
Copyright (c) 2025 Ramon Monteiro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[...full license text...]
```

## 🙏 Agradecimentos

-   **Prisma Team** - Pelo excelente ORM
-   **Express.js** - Framework web robusto
-   **TypeScript** - Type safety incrível
-   **Zod** - Validação de dados elegante
-   **Bcrypt** - Segurança em passwords

## �👨‍💻 Autor

<div align="center">

**Ramon Monteiro**

[![GitHub](https://img.shields.io/badge/GitHub-ramon541-black?style=for-the-badge&logo=github)](https://github.com/ramon541)
[![Email](https://img.shields.io/badge/Email-ramondiasmonteiro@gmail.com-red?style=for-the-badge&logo=gmail)](mailto:ramondiasmonteiro@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/ramondiasmonteiro)

</div>

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

![GitHub Stars](https://img.shields.io/github/stars/ramon541/back-techblog?style=social)
![GitHub Forks](https://img.shields.io/github/forks/ramon541/back-techblog?style=social)
![GitHub Issues](https://img.shields.io/github/issues/ramon541/back-techblog?style=social)

**🚀 Built with ❤️ and TypeScript**

</div>
````
