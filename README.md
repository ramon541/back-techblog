# 🏗️ TechBlog Backend - Documentação Técnica

## 📋 Concepção do Projeto

### Visão Geral

O **TechBlog Backend** foi concebido como uma API RESTful robusta para gerenciar um blog de tecnologia, priorizando **escalabilidade**, **manutenibilidade** e **qualidade de código**. O projeto foi arquitetado seguindo princípios de **Clean Architecture** e padrões modernos de desenvolvimento, com foco na experiência do desenvolvedor e na facilidade de evolução do sistema.

### Objetivos do Projeto

1. **Demonstrar Best Practices** - Implementar padrões de arquitetura e código de alta qualidade
2. **Escalabilidade** - Estrutura preparada para crescimento e novas funcionalidades
3. **Manutenibilidade** - Código limpo, bem documentado e fácil de modificar
4. **Type Safety** - Aproveitamento máximo do TypeScript para prevenir erros
5. **Observabilidade** - Sistema de logs e monitoramento para ambiente de produção

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

## 🎓 Lições Aprendidas e Trade-offs

### Decisões Bem-Sucedidas

-   **Result Pattern**: Eliminou bugs silenciosos de null/undefined
-   **Modular Organization**: Facilitou desenvolvimento paralelo
-   **TypeScript Strict**: Preveniu classes inteiras de bugs
-   **Prisma**: Acelerou desenvolvimento com type safety

### Trade-offs Aceitos

-   **Verbosidade**: Mais código para maior segurança
-   **Learning Curve**: Padrões específicos requerem aprendizado
-   **Over-engineering**: Alguns padrões podem ser overkill para projetos pequenos

### Melhorias Futuras

-   **JWT Authentication**: Sistema de tokens mais robusto
-   **Caching Layer**: Redis para performance
-   **Unit Tests**: Cobertura completa de testes
-   **API Documentation**: OpenAPI/Swagger
-   **Monitoring**: APM e health checks

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

## 🔗 Tecnologias e Versões

| Tecnologia | Versão | Justificativa                        |
| ---------- | ------ | ------------------------------------ |
| Node.js    | 18+    | LTS com performance otimizada        |
| TypeScript | 5.9    | Latest features + stability          |
| Express    | 5.1    | Modern version com melhorias         |
| Prisma     | 6.15   | Type-safe ORM com features avançadas |
| MySQL      | 8.0+   | Relacionamentos complexos            |
| Zod        | Latest | Schema validation TypeScript-first   |
| Bcrypt     | Latest | Hashing seguro de senhas             |
| TSX        | Latest | Hot reload para desenvolvimento      |

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos

-   Node.js 18+
-   MySQL 8.0+
-   Yarn ou NPM

### Instalação

```bash
# Clone o repositório
git clone https://github.com/ramon541/back-techblog.git
cd back-techblog

# Instale dependências
yarn install

# Configure variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Configure o banco de dados
yarn prisma:dev
yarn prisma:gen

# Popule com dados de exemplo
yarn seed

# Inicie o servidor
yarn dev
```

### Scripts Disponíveis

```bash
yarn dev              # Desenvolvimento com hot-reload
yarn build            # Build para produção
yarn prisma:gen       # Gera cliente Prisma
yarn prisma:dev       # Executa migrações
yarn prisma:reset     # Reset do banco
yarn seed             # Popula dados de exemplo
yarn prisma studio    # Interface visual do banco
```

---

## 📊 API Endpoints

### Autenticação

-   `POST /api/auth/login` - Login de usuário

### Usuários

-   `GET /api/users` - Listar usuários
-   `GET /api/users/:id` - Buscar usuário
-   `POST /api/users` - Criar usuário
-   `PUT /api/users/:id` - Atualizar usuário
-   `DELETE /api/users/:id` - Remover usuário

### Artigos

-   `GET /api/articles` - Listar artigos
-   `GET /api/articles/:id` - Buscar artigo
-   `POST /api/articles` - Criar artigo
-   `PUT /api/articles/:id` - Atualizar artigo
-   `DELETE /api/articles/:id` - Remover artigo

### Tags

-   `GET /api/tags` - Listar tags
-   `POST /api/tags` - Criar tag
-   `PUT /api/tags/:id` - Atualizar tag
-   `DELETE /api/tags/:id` - Remover tag

### Comentários

-   `GET /api/comments` - Listar comentários
-   `POST /api/comments` - Criar comentário
-   `PUT /api/comments/:id` - Atualizar comentário
-   `DELETE /api/comments/:id` - Remover comentário

---

## 💡 Exemplos de Uso

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email": "admin@email.com", "password": "123456"}'
```

### Criar Artigo

```bash
curl -X POST http://localhost:3000/api/articles \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Meu Artigo",
    "content": "Conteúdo do artigo...",
    "image": "https://example.com/image.jpg",
    "authorId": "uuid-do-autor",
    "tagIds": ["uuid-tag1", "uuid-tag2"]
  }'
```

### Resposta de Sucesso

```json
{
    "success": true,
    "data": {
        /* dados retornados */
    },
    "message": "Operação realizada com sucesso",
    "statusCode": 200
}
```

### Resposta de Erro

```json
{
    "success": false,
    "data": null,
    "error": "Mensagem de erro específica",
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

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Convenções

-   Use Conventional Commits
-   Mantenha TypeScript strict mode
-   Siga os padrões Result Pattern
-   Adicione testes para novas funcionalidades

---

## 👨‍💻 Autor

**Ramon Monteiro** - Desenvolvedor focado em arquitetura de software, clean code e boas práticas de desenvolvimento.

[![GitHub](https://img.shields.io/badge/GitHub-ramon541-black?style=for-the-badge&logo=github)](https://github.com/ramon541)
[![Email](https://img.shields.io/badge/Email-ramondiasmonteiro@gmail.com-red?style=for-the-badge&logo=gmail)](mailto:ramondiasmonteiro@gmail.com)

---

_Esta documentação reflete as decisões técnicas e arquiteturais tomadas durante o desenvolvimento, servindo como referência para futuras evoluções do projeto._
