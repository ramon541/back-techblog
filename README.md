# 📝 TechBlog Backend API

> Uma API RESTful robusta para um blog de tecnologia, construída com Node.js, TypeScript, Express e Prisma, seguindo princípios de Clean Architecture e padrões modernos de desenvolvimento.

## 🚀 Tecnologias

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

## 🔧 Funcionalidades Implementadas

### 🔐 Sistema de Autenticação

-   ✅ **Login de usuários** - Validação de credenciais
-   ✅ **Hash de senhas** - Bcrypt com salt configurável
-   ✅ **Validação de dados** - Schemas Zod para entrada
-   🚧 **JWT Tokens** - Geração e validação (em desenvolvimento)
-   🚧 **Middleware de auth** - Proteção de rotas (planejado)

### 👤 Gerenciamento de Usuários

-   ✅ **CRUD completo** - Create, Read, Update, Delete
-   ✅ **Registro de usuários** - Validação e sanitização
-   ✅ **Soft delete** - Desativação/reativação de contas
-   ✅ **Validação de email** - Prevenção de duplicatas
-   ✅ **Upload de avatar** - Suporte a URLs de imagem
-   ✅ **Paginação** - Lista de usuários paginada

### 🛡️ Segurança e Validação

-   ✅ **Result Pattern** - Tratamento funcional de erros
-   ✅ **ApplicationException** - Sistema de erros tipados
-   ✅ **Validação Zod** - Schemas TypeScript-first
-   ✅ **Sanitização** - Remoção de dados sensíveis
-   ✅ **Error Handler** - Middleware global de erros
-   ✅ **Type Safety** - Tipagem estrita TypeScript

### � Observabilidade

-   ✅ **Logging estruturado** - Sistema de logs customizado
-   ✅ **Request logging** - Middleware de requisições HTTP
-   ✅ **Database logging** - Logs de queries Prisma
-   ✅ **Performance tracking** - Tempo de execução
-   ✅ **Error tracking** - Logs detalhados de erros

### �️ Banco de Dados

-   ✅ **Prisma ORM** - Type-safe database access
-   ✅ **Migrações** - Versionamento do schema
-   ✅ **Relacionamentos** - Foreign keys e joins
-   ✅ **Soft delete** - Exclusão lógica
-   ✅ **UUID** - Identificadores únicos
-   ✅ **Connection pooling** - Gerenciamento de conexões

## 📊 API Endpoints

### Usuários

```http
POST   /api/users/create     # Criar usuário
GET    /api/users           # Listar usuários
GET    /api/users/:id       # Buscar usuário por ID
PUT    /api/users/:id       # Atualizar usuário
DELETE /api/users/:id       # Soft delete usuário
```

### Autenticação

```http
POST   /api/auth/login      # Login com email/senha
```

### Artigos (planejado)

```http
POST   /api/articles        # Criar artigo
GET    /api/articles        # Listar artigos
GET    /api/articles/:id    # Buscar artigo por ID
PUT    /api/articles/:id    # Atualizar artigo
DELETE /api/articles/:id    # Deletar artigo
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
    "error": "Mensagem de erro específica",
    "statusCode": 400
}
```

## 🚧 Roadmap

### ✅ Recentemente Implementado

-   **🔐 Sistema de Login** - Autenticação com email/senha completa
-   **📝 Auth Controller** - Endpoint `/api/auth/login` funcional
-   **🛠️ Result Pattern Aprimorado** - Sintaxe `Result.error(ApplicationErrorEnum.NotFound)`
-   **🔧 Error Handler** - Integração com ApplicationErrorEnum
-   **📋 Auth Schemas** - Validação Zod para credenciais de login
-   **🏗️ Auth Service** - Validação de credenciais e status de conta

### Funcionalidades Planejadas

#### 📝 Sistema de Artigos

-   [ ] **CRUD de Artigos** - Criar, ler, atualizar, deletar
-   [ ] **Editor Markdown** - Suporte completo a markdown
-   [ ] **Upload de Imagens** - Gerenciamento de mídia
-   [ ] **Slug URLs** - URLs amigáveis para SEO
-   [ ] **Versioning** - Histórico de edições

#### 🏷️ Sistema de Tags

-   [ ] **Gerenciamento de Tags** - CRUD completo
-   [ ] **Tag Suggestions** - Sugestões automáticas
-   [ ] **Popular Tags** - Rankings e estatísticas
-   [ ] **Tag Filtering** - Filtros avançados

#### 💬 Sistema de Comentários

-   [ ] **Comentários Aninhados** - Threads de discussão
-   [ ] **Moderação** - Sistema de aprovação
-   [ ] **Markdown Support** - Formatação nos comentários
-   [ ] **Notifications** - Notificações de respostas

#### 🔍 Busca e Filtros

-   [ ] **Full-text Search** - Busca avançada
-   [ ] **Elasticsearch** - Engine de busca robusta
-   [ ] **Filters & Sorting** - Múltiplos critérios
-   [ ] **Search Analytics** - Métricas de busca

#### 📊 Analytics e Métricas

-   [ ] **View Tracking** - Contagem de visualizações
-   [ ] **User Analytics** - Métricas de usuário
-   [ ] **Performance Monitoring** - APM integration
-   [ ] **Admin Dashboard** - Painel administrativo

#### 🚀 Performance e Escala

-   [ ] **Caching** - Redis para cache
-   [ ] **CDN Integration** - Distribuição de conteúdo
-   [ ] **Database Optimization** - Índices e queries
-   [ ] **Load Balancing** - Distribuição de carga

#### 🧪 Qualidade e Testes

-   [ ] **Unit Tests** - Testes unitários (Jest)
-   [ ] **Integration Tests** - Testes de integração
-   [ ] **E2E Tests** - Testes end-to-end
-   [ ] **API Documentation** - Swagger/OpenAPI
-   [ ] **Code Coverage** - Cobertura de testes

#### 📱 Integrações

-   [ ] **Email Service** - SendGrid/Nodemailer
-   [ ] **File Storage** - AWS S3/Cloudinary
-   [ ] **Monitoring** - Sentry/DataDog
-   [ ] **CI/CD** - GitHub Actions
-   [ ] **Docker** - Containerização

### Padrões de Commit

Utilizamos [Conventional Commits](https://conventionalcommits.org/):

```bash
:sparkles: feat: nova funcionalidade
:bug: fix: correção de bug
:recycle: refactor: refatoração de código
:memo: docs: documentação
:white_check_mark: test: testes
:art: style: formatação
:zap: perf: performance
```

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
