# 🏗️ TechBlog Backend - API RESTful Completa

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.15-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

> **API RESTful completa para blog de tecnologia com arquitetura limpa, comentários hierárquicos, busca avançada e sistema de paginação inteligente.**

## 📋 Sobre o Projeto

O **TechBlog Backend** é uma API RESTful robusta e completa para gerenciar um blog de tecnologia, desenvolvida com foco em **escalabilidade**, **manutenibilidade** e **qualidade de código**. O projeto implementa **Clean Architecture**, padrões modernos de desenvolvimento e features avançadas como sistema de comentários hierárquicos, busca com filtros, paginação inteligente e upload de imagens.

### ✨ Funcionalidades Principais

-   📝 **Gestão de Artigos** - Criação e busca avançada com suporte a imagens
-   🏷️ **Sistema de Tags** - Organização por categorias com relacionamento M:N otimizado
-   💬 **Comentários Hierárquicos** - Sistema completo com respostas aninhadas
-   🔍 **Busca Avançada** - Filtros combinados por termo, tag e paginação inteligente
-   🌐 **CORS Configurado** - Pronto para integração com qualquer frontend
-   📊 **Paginação Inteligente** - Metadata completa (hasNext, hasPrev, totalPages)
-   🖼️ **Suporte a Imagens** - URLs validadas para artigos e avatares de usuários
-   🔒 **Soft Delete** - Exclusão lógica preservando integridade referencial
-   📋 **Logging Estruturado** - Sistema modular com diferentes níveis por contexto

### 🎯 Objetivos do Projeto

1. **Demonstrar Best Practices** - Arquitetura limpa e padrões de qualidade
2. **Escalabilidade** - Estrutura preparada para crescimento
3. **Manutenibilidade** - Código limpo, tipado e bem documentado
4. **Type Safety** - 100% TypeScript com validação robusta
5. **Developer Experience** - Hot reload, logging e debugging otimizados

---

## 🎯 Decisões Técnicas e Justificativas

### Stack Principal

#### **Node.js + TypeScript**

-   **Decisão**: Utilizar TypeScript como linguagem principal
-   **Justificativa**:
    -   Type safety em tempo de compilação reduz bugs em produção
    -   Melhor IntelliSense e refactoring
    -   Facilita manutenção em projetos de médio/grande porte
    -   Comunidade ativa e ecossistema maduro

#### **Express.js 5.1**

-   **Decisão**: Framework web minimalista
-   **Justificativa**:
    -   Flexibilidade para implementar arquitetura customizada
    -   Performance comprovada em produção
    -   Vasto ecossistema de middlewares
    -   Controle total sobre estrutura de rotas

#### **Prisma ORM**

-   **Decisão**: ORM moderno com geração de tipos
-   **Justificativa**:
    -   Type safety automático baseado no schema
    -   Migrations versionadas e confiáveis
    -   Query builder intuitivo e performático
    -   Excelente integração com TypeScript
    -   Schema declarativo facilita evolução do banco

#### **MySQL**

-   **Decisão**: Banco relacional estabelecido
-   **Justificativa**:
    -   Relacionamentos complexos entre entidades (artigos, tags, comentários)
    -   ACID compliance para consistência de dados
    -   Performance comprovada para aplicações web
    -   Ferramentas maduras de backup e monitoramento

---

## 🏛️ Arquitetura e Padrões de Design

### Clean Architecture

O projeto implementa uma variação de Clean Architecture com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────┐
│                    Controllers                          │
│              (HTTP/REST Interface)                      │
├─────────────────────────────────────────────────────────┤
│                     Services                            │
│               (Business Logic)                          │
├─────────────────────────────────────────────────────────┤
│                   Repositories                          │
│              (Data Access Layer)                        │
├─────────────────────────────────────────────────────────┤
│                   Database                              │
│               (MySQL + Prisma)                          │
└─────────────────────────────────────────────────────────┘
```

#### **Controllers**

-   **Responsabilidade**: Interface HTTP, validação de entrada, formatação de resposta
-   **Justificativa**: Isolamento da lógica de apresentação
-   **Implementação**: Thin controllers que delegam para services

#### **Services**

-   **Responsabilidade**: Regras de negócio, orquestração, transformação de dados
-   **Justificativa**: Centralização da lógica de negócio, facilitando testes unitários
-   **Implementação**: Pure functions quando possível, uso do Result Pattern

#### **Repositories**

-   **Responsabilidade**: Acesso a dados, queries, persistência
-   **Justificativa**: Abstração do banco de dados, facilita testes e troca de tecnologia
-   **Implementação**: Interface consistente independente da fonte de dados

### Padrões Implementados

#### **1. Result Pattern**

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

-   **Decisão**: Eliminar exceptions para controle de fluxo
-   **Justificativa**:
    -   Força tratamento explícito de erros
    -   Melhora previsibilidade do código
    -   Facilita debugging e logging
    -   Type safety para cenários de erro
-   **Implementação**: Enum para categorização de erros + mensagens padronizadas

#### **2. Repository Pattern**

-   **Decisão**: Abstração da camada de dados
-   **Justificativa**:
    -   Facilita testes unitários com mocks
    -   Permite troca de ORM/banco sem impacto
    -   Centraliza queries e otimizações
    -   Interface limpa para services

#### **3. Dependency Injection**

-   **Decisão**: Inversão de dependências manual
-   **Justificativa**:
    -   Facilita testes isolados
    -   Reduz acoplamento entre camadas
    -   Flexibilidade para diferentes ambientes
    -   Sem overhead de frameworks complexos

---

## 📂 Organização do Código

### Estrutura Modular

```
src/
├── modules/                    # Organização por domínio
│   ├── users/                 # Módulo completo de usuários
│   │   ├── user.controller.ts # Interface HTTP
│   │   ├── user.service.ts    # Lógica de negócio
│   │   ├── user.repository.ts # Acesso a dados
│   │   ├── user.routes.ts     # Rotas específicas
│   │   ├── user.schema.ts     # Validações Zod
│   │   └── user.model.d.ts    # Tipos TypeScript
│   ├── articles/              # Módulo de artigos
│   ├── tags/                  # Módulo de tags
│   ├── comments/              # Módulo de comentários
│   ├── auth/                  # Módulo de autenticação
│   └── articleTags/           # Relacionamento M:N
├── config/                    # Configurações centralizadas
├── middlewares/               # Middlewares customizados
├── types/                     # Tipos globais
├── utils/                     # Utilitários compartilhados
└── routes/                    # Agregação de rotas
```

#### **Organização por Domínio**

-   **Decisão**: Módulos auto-contidos por funcionalidade
-   **Justificativa**:
    -   **Alta coesão**: Código relacionado fica junto
    -   **Baixo acoplamento**: Módulos independentes
    -   **Facilita evolução**: Adicionar features não impacta outros módulos
    -   **Team scalability**: Times podem trabalhar em módulos específicos

#### **Convenções de Nomenclatura**

-   **Arquivos**: `entity.layer.ts` (ex: `user.service.ts`)
-   **Interfaces**: `IEntityAction` (ex: `ICreateUserDTO`)
-   **Enums**: `EntityEnum` (ex: `ApplicationErrorEnum`)
-   **Constantes**: `UPPER_SNAKE_CASE`

---

## 🔧 Implementações Específicas

### Sistema de Validação

```typescript
export const createUserSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6),
});
```

#### **Zod para Validação**

-   **Decisão**: Schema validation TypeScript-first
-   **Justificativa**:
    -   Inferência automática de tipos
    -   Validação em runtime e compile time
    -   Mensagens de erro personalizadas
    -   Composição e reutilização de schemas
-   **Implementação**: Schemas específicos por operação (create, update, etc.)

### Tratamento de Erros

```typescript
export enum ApplicationErrorEnum {
    RequiredField = 'REQUIRED_FIELD',
    NotFound = 'NOT_FOUND',
    Conflict = 'CONFLICT',
    // ... outros erros categorizados
}
```

#### **Sistema de Erros Padronizado**

-   **Decisão**: Enum para categorização + mensagens padrão
-   **Justificativa**:
    -   Consistência nas respostas da API
    -   Status codes automáticos por tipo
    -   Facilita internacionalização
    -   Previne erros de digitação
-   **Implementação**: Mapeamento automático erro → status code → mensagem

### Relacionamentos Complexos

```prisma
model ArticleTag {
    articleId String
    tagId     String
    deletedAt DateTime?

    @@id([articleId, tagId])
}
```

#### **Many-to-Many com Soft Delete**

-   **Decisão**: Tabela de junção explícita com soft delete
-   **Justificativa**:
    -   Controle granular sobre relacionamentos
    -   Histórico de associações
    -   Performance em queries complexas
    -   Flexibilidade para adicionar metadados
-   **Implementação**: Helpers para sincronização automática de tags

### Logging e Observabilidade

```typescript
export const logger = {
    info: (message: string, meta?: any) => {
        /* structured logging */
    },
    error: (message: string, error?: Error) => {
        /* error tracking */
    },
    // ... outros níveis
};
```

#### **Sistema de Logs Estruturado**

-   **Decisão**: Logging estruturado com metadados
-   **Justificativa**:
    -   Facilita debugging em produção
    -   Integração com ferramentas de APM
    -   Performance tracking
    -   Auditoria de operações
-   **Implementação**: Logs por camada + request/response tracking

---

## 🔒 Segurança e Performance

### Segurança

-   **Soft Delete**: Preservação de dados para auditoria
-   **UUIDs**: Identificadores não sequenciais
-   **Password Hashing**: Bcrypt com salt configurável
-   **Input Validation**: Sanitização em todas as entradas
-   **Type Safety**: Prevenção de erros em runtime

### Performance

-   **Connection Pooling**: Gerenciamento eficiente de conexões
-   **Selective Queries**: `select` específicos evitam overfetching
-   **Pagination**: Skip/take para listas grandes
-   **Indexes**: Automáticos em foreign keys e campos únicos
-   **Query Optimization**: Prisma queries otimizadas

---

## 🚀 Escalabilidade e Extensibilidade

### Preparação para Crescimento

1. **Modular Architecture**: Fácil adição de novos módulos
2. **Interface Segregation**: Contratos pequenos e específicos
3. **Configuration Management**: Centralized env config
4. **Database Migrations**: Versionamento seguro do schema
5. **Error Monitoring**: Sistema preparado para APM tools

### Facilidade de Manutenção

1. **Clean Code**: Código auto-documentado
2. **Type Safety**: Refactoring seguro
3. **Consistent Patterns**: Padrões repetíveis
4. **Comprehensive Logging**: Debugging facilitado
5. **Separation of Concerns**: Responsabilidades bem definidas

---

## 📊 Métricas do Projeto

-   **📁 Linhas de Código**: ~3.000+ linhas TypeScript
-   **🏗️ Módulos**: 5 módulos principais bem estruturados
-   **🔒 Type Safety**: 100% TypeScript strict mode
-   **🧪 Error Handling**: Result Pattern em 100% das operações
-   **🗃️ Entidades**: 5 entidades com relacionamentos complexos
-   **⚡ Performance**: Queries otimizadas com selective loading

Este projeto demonstra a aplicação prática de padrões modernos de desenvolvimento, priorizando qualidade, manutenibilidade e escalabilidade em um contexto real de aplicação backend.

---

## 🔗 Stack Tecnológica

| Tecnologia     | Versão | Uso                 | Justificativa                      |
| -------------- | ------ | ------------------- | ---------------------------------- |
| **Node.js**    | 18+    | Runtime JavaScript  | LTS com performance otimizada      |
| **TypeScript** | 5.9    | Linguagem principal | Type safety + DX superior          |
| **Express.js** | 5.1    | Framework web       | Flexibilidade + ecosystem maduro   |
| **Prisma**     | 6.15   | ORM + Client        | Type-safe + migrations automáticas |
| **MySQL**      | 8.0+   | Banco de dados      | ACID + relacionamentos complexos   |
| **Zod**        | Latest | Validação de schema | TypeScript-first validation        |
| **Bcrypt**     | 6.0    | Hash de senhas      | Segurança comprovada               |
| **CORS**       | 2.8.5  | Cross-origin        | Integração frontend                |
| **TSX**        | 4.20.5 | Hot reload dev      | DX otimizada                       |

### 🔧 Dependências por Categoria

#### **Produção**

-   `@prisma/client` - Cliente gerado automaticamente
-   `prisma` - CLI e runtime
-   `express` - Framework web minimalista
-   `cors` - Middleware cross-origin
-   `bcrypt` - Hash seguro de senhas
-   `zod` - Validação TypeScript-first

#### **Desenvolvimento**

-   `typescript` - Compilador TS
-   `tsx` - TypeScript executor + hot reload
-   `@types/*` - Definições de tipos para JavaScript libs

### 📦 Scripts Npm Disponíveis

```bash
# Desenvolvimento
yarn dev              # Servidor com hot-reload (tsx watch)
yarn build            # Build TypeScript para produção

# Database
yarn prisma:gen       # Gerar cliente Prisma
yarn prisma:dev       # Aplicar migrations em desenvolvimento
yarn prisma:reset     # Reset completo do banco
yarn prisma:deploy    # Deploy migrations em produção
yarn seed             # Popular banco com dados de exemplo

# Pós-instalação
yarn postinstall      # Auto-executa prisma:dev + prisma:gen
```

---

## 🛠️ Como Executar o Projeto

### 📋 Pré-requisitos

-   **Node.js** 18+ (LTS recomendado)
-   **MySQL** 8.0+ ou **Docker** para containerização
-   **Yarn** (recomendado) ou **NPM**
-   **Git** para clonagem do repositório

### 🚀 Instalação Rápida

```bash
# 1. Clone o repositório
git clone https://github.com/ramon541/back-techblog.git
cd back-techblog

# 2. Instale as dependências
yarn install
# O postinstall irá executar automaticamente:
# - yarn prisma:dev (migrações)
# - yarn prisma:gen (geração do cliente)

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 4. (Opcional) Popule com dados de exemplo
yarn seed

# 5. Inicie o servidor de desenvolvimento
yarn dev
```

### 🔧 Configuração Manual (Alternativa)

Se preferir executar passo a passo:

```bash
# Após instalar dependências:
yarn prisma:dev       # Aplicar migrações
yarn prisma:gen       # Gerar cliente Prisma
yarn seed             # Popular com dados de exemplo
yarn dev              # Iniciar servidor
```

### 🌍 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL="mysql://usuario:senha@localhost:3306/techblog"

# Servidor
PORT=3000

# Segurança
BCRYPT_SALT_ROUNDS=12
```

### ✅ Verificação da Instalação

Após executar `yarn dev`, você deve ver:

```
2025-09-08 12:00:00 [ENV] ✅ SUCCESS: All environment variables loaded successfully
2025-09-08 12:00:00 [SERVER] ✅ SUCCESS: Middlewares loaded successfully
2025-09-08 12:00:00 [SERVER] ✅ SUCCESS: Server running on http://localhost:3000
2025-09-08 12:00:00 [DATABASE] ✅ SUCCESS: Database connected successfully
```

### 🧪 Testando a API

```bash
# Teste básico de conectividade
curl http://localhost:3000/api/articles

# Se o seed foi executado, deve retornar artigos
curl http://localhost:3000/api/users
```

---

## 📊 API Endpoints Completos

### 🔐 Autenticação

```http
POST /api/auth/login    # Login com email/senha
```

### 👥 Usuários

```http
GET    /api/users           # Listar usuários
GET    /api/users/:id       # Buscar usuário específico
POST   /api/users/create    # Criar novo usuário
PUT    /api/users/:id       # Atualizar usuário
DELETE /api/users/:id       # Remover usuário (soft delete)
```

### 📝 Artigos

```http
GET    /api/articles           # Listar todos os artigos
GET    /api/articles/search    # Busca avançada (?term=react&tagId=uuid&page=1&limit=10)
GET    /api/articles/:id       # Buscar artigo específico
POST   /api/articles/create    # Criar novo artigo
PUT    /api/articles/:id       # Atualizar artigo
DELETE /api/articles/:id       # Remover artigo (soft delete)
```

### 🏷️ Tags

```http
GET    /api/tags           # Listar todas as tags
GET    /api/tags/:id       # Buscar tag específica
POST   /api/tags/create    # Criar nova tag
PUT    /api/tags/:id       # Atualizar tag
DELETE /api/tags/:id       # Remover tag (soft delete)
```

### 💬 Comentários

```http
GET    /api/comments                    # Listar comentários principais
GET    /api/comments/article/:articleId # Buscar comentários de um artigo (com respostas aninhadas)
GET    /api/comments/:id               # Buscar comentário específico
GET    /api/comments/:id/replies       # Buscar respostas de um comentário
POST   /api/comments/create            # Criar novo comentário ou resposta
PUT    /api/comments/:id               # Atualizar comentário
DELETE /api/comments/:id               # Remover comentário (soft delete)
```

### 📋 Recursos Especiais

#### **Busca Avançada de Artigos**

```http
GET /api/articles/search?term=react&tagId=uuid&page=1&limit=10
```

-   Busca por título
-   Filtro por tag específica
-   Paginação com metadata completa
-   Ordenação por data de criação

#### **Comentários Hierárquicos**

```http
GET /api/comments/article/:articleId
```

-   Retorna comentários principais com respostas aninhadas
-   Inclui dados do usuário (nome, avatar)
-   Ordenação: comentários principais por data DESC, respostas por data ASC
-   Soft delete aplicado em toda a hierarquia

---

## 💡 Exemplos de Uso Completos

### 🔐 Autenticação

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "fred.marques@email.com",
    "password": "123456"
  }'
```

### 👤 Criar Usuário com Avatar

```bash
curl -X POST http://localhost:3000/api/users/create \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456",
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  }'
```

### 📝 Criar Artigo com Imagem e Tags

```bash
curl -X POST http://localhost:3000/api/articles/create \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Guia Completo de React Hooks",
    "content": "React Hooks revolucionaram a forma como desenvolvemos componentes...",
    "image": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600",
    "authorId": "uuid-do-autor",
    "tagIds": ["react-tag-uuid", "javascript-tag-uuid", "frontend-tag-uuid"]
  }'
```

### 🔍 Busca Avançada de Artigos

```bash
# Buscar artigos sobre React
curl "http://localhost:3000/api/articles/search?term=react&page=1&limit=5"

# Buscar artigos de uma tag específica
curl "http://localhost:3000/api/articles/search?tagId=frontend-tag-uuid&page=1&limit=10"

# Busca combinada
curl "http://localhost:3000/api/articles/search?term=javascript&tagId=frontend-tag-uuid&page=1&limit=5"
```

### 💬 Sistema de Comentários

```bash
# Criar comentário principal
curl -X POST http://localhost:3000/api/comments/create \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "Excelente artigo sobre React Hooks!",
    "articleId": "artigo-uuid",
    "userId": "usuario-uuid"
  }'

# Criar resposta a um comentário
curl -X POST http://localhost:3000/api/comments/create \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "Concordo totalmente!",
    "articleId": "artigo-uuid",
    "userId": "outro-usuario-uuid",
    "parentId": "comentario-pai-uuid"
  }'

# Buscar todos os comentários de um artigo (com respostas aninhadas)
curl "http://localhost:3000/api/comments/article/artigo-uuid"
```

### 📊 Resposta de Sucesso com Paginação

```json
{
    "success": true,
    "data": {
        "items": [
            {
                "id": "uuid",
                "title": "Artigo de Exemplo",
                "content": "Conteúdo...",
                "image": "https://example.com/image.jpg",
                "createdAt": "2025-09-08T12:00:00Z",
                "tags": [
                    {
                        "tagId": "tag-uuid",
                        "tag": { "name": "React" }
                    }
                ]
            }
        ],
        "meta": {
            "page": 1,
            "limit": 10,
            "total": 25,
            "totalPages": 3,
            "hasNext": true,
            "hasPrev": false
        }
    },
    "message": "Artigos encontrados com sucesso",
    "statusCode": 200
}
```

### 💬 Resposta de Comentários Hierárquicos

```json
{
    "success": true,
    "data": [
        {
            "id": "comment-uuid",
            "content": "Ótimo artigo!",
            "createdAt": "2025-09-08T12:00:00Z",
            "user": {
                "id": "user-uuid",
                "name": "João Silva",
                "avatar": "https://example.com/avatar.jpg"
            },
            "replies": [
                {
                    "id": "reply-uuid",
                    "content": "Concordo!",
                    "createdAt": "2025-09-08T12:30:00Z",
                    "user": {
                        "id": "user2-uuid",
                        "name": "Maria Santos",
                        "avatar": "https://example.com/avatar2.jpg"
                    }
                }
            ]
        }
    ],
    "message": "Comentários do artigo buscados com sucesso",
    "statusCode": 200
}
```

### ❌ Resposta de Erro com Validação

```json
{
    "success": false,
    "data": null,
    "error": "Validation error",
    "details": [
        "Título deve ter no mínimo 3 caracteres",
        "Um artigo deve ter no mínimo 1 tags"
    ],
    "statusCode": 400
}
```

---

## 🔍 Modelo de Dados

### Entidades Principais

```prisma
model User {
  id        String    @id @default(uuid())
  name      String
  email     String    @unique
  password  String
  avatar    String?
  deletedAt DateTime? @map("deleted_at")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  articles  Article[]
  comments  Comment[]
  @@map("users")
}

model Article {
  id        String    @id @default(uuid())
  title     String
  content   String    @db.Text
  image     String?
  authorId  String    @map("author_id")
  deletedAt DateTime? @map("deleted_at")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  author   User         @relation(fields: [authorId], references: [id])
  tags     ArticleTag[]
  comments Comment[]
  @@map("articles")
}

model Tag {
  id        String    @id @default(uuid())
  name      String    @unique
  deletedAt DateTime? @map("deleted_at")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  articles ArticleTag[]
  @@map("tags")
}

model ArticleTag {
  articleId String    @map("article_id")
  tagId     String    @map("tag_id")
  deletedAt DateTime? @map("deleted_at")

  article Article @relation(fields: [articleId], references: [id])
  tag     Tag     @relation(fields: [tagId], references: [id])

  @@id([articleId, tagId])
  @@map("article_tags")
}

model Comment {
  id        String    @id @default(uuid())
  content   String    @db.Text
  articleId String    @map("article_id")
  userId    String    @map("user_id")
  parentId  String?   @map("parent_id")
  deletedAt DateTime? @map("deleted_at")
  createdAt DateTime  @default(now()) @map("created_at")

  article Article   @relation(fields: [articleId], references: [id])
  user    User      @relation(fields: [userId], references: [id])
  parent  Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies Comment[] @relation("CommentReplies")

  @@map("comments")
}
```

---

## 🗄️ Dados de Exemplo (Seed)

O projeto inclui um sistema completo de seed com dados realistas para desenvolvimento e testes:

### 👥 Usuários Pré-cadastrados

Todos os usuários têm senha: **`123456`**

| Nome                | Email                     | Avatar                                                                                                |
| ------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Fred Marques**    | fred.marques@email.com    | [Avatar](https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face) |
| **Carlos Henrique** | carlos.henrique@email.com | [Avatar](https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face) |
| **Carlos Eduardo**  | carlos.eduardo@email.com  | [Avatar](https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face) |
| **Geovana Rocha**   | geovana.rocha@email.com   | [Avatar](https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face) |

### 📝 Artigos de Exemplo

8 artigos técnicos sobre:

-   **Agronegócio** - A Revolução da Grão Direto no setor
-   **DevOps** - CI/CD em Ambientes Ágeis, Práticas para Times Distribuídos
-   **Backend** - Importância de NoSQL em Sistemas Escaláveis
-   **Cloud** - Kubernetes e Orquestração de Contêineres
-   **Segurança** - Desafios em Arquiteturas Serverless
-   **Frontend** - Evolução com Frameworks Modernos (React, Angular, Vue)

### 🏷️ Tags Organizadas

Categorias técnicas incluem:

-   **Tecnologias**: React, NoSQL, Kubernetes, Serverless
-   **Metodologias**: CI/CD, DevOps, Agilidade
-   **Domínios**: Grão Direto, Agronegócio, Frontend, Backend
-   **Conceitos**: Escalabilidade, Colaboração, Segurança, Cloud

### 💬 Comentários Interativos

-   Comentários principais em cada artigo
-   Respostas aninhadas demonstrando threading
-   Diferentes autores interagindo entre si
-   Timestamps realistas para demonstração

### 🚀 Executar Seed

```bash
# Popular banco com todos os dados
yarn seed

# O que será criado:
# ✅ 4 usuários com avatares do Unsplash
# ✅ 8 artigos técnicos com imagens
# ✅ 12 tags categorizadas
# ✅ 24 relacionamentos artigo-tag
# ✅ 10+ comentários com respostas aninhadas
```

### 🔄 Reset e Recriar

```bash
# Limpar tudo e recriar do zero
yarn prisma:reset
yarn seed
```

---

## 👨‍💻 Autor

**Ramon Monteiro** - Desenvolvedor focado em arquitetura de software, clean code e boas práticas de desenvolvimento.

[![GitHub](https://img.shields.io/badge/GitHub-ramon541-black?style=for-the-badge&logo=github)](https://github.com/ramon541)
[![Email](https://img.shields.io/badge/Email-ramondiasmonteiro@gmail.com-red?style=for-the-badge&logo=gmail)](mailto:ramondiasmonteiro@gmail.com)

---

_Esta documentação reflete as decisões técnicas e arquiteturais tomadas durante o desenvolvimento, servindo como referência para futuras evoluções do projeto._
