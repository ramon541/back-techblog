import { PrismaClient } from '../src/generated/prisma/index.js';
import bcrypt from 'bcrypt';
import { logger } from '../src/utils/logger.js';

const prisma = new PrismaClient();
const seedLogger = logger.createModuleLogger('SEED');

//= =================================================================================
const articlesData = [
    {
        title: 'A Revolução da Grão Direto no Agronegócio',
        author: 'Fred Marques',
        content:
            'A Grão Direto tem transformado o setor agrícola ao introduzir tecnologia de ponta para conectar produtores e compradores de grãos. A plataforma utiliza algoritmos avançados para recomendar preços baseados em dados de mercado em tempo real. Além disso, sua interface amigável e acessível facilita negociações seguras e rápidas. Baseada em Uberaba, Minas Gerais, a empresa continua a liderar a digitalização do agronegócio no Brasil, fortalecendo toda a cadeia produtiva com inovações tecnológicas.',
        tags: ['Grão Direto', 'Tecnologia', 'Agronegócio'],
    },
    {
        title: 'Implementando CI/CD em Ambientes Ágeis',
        author: 'Carlos Henrique',
        content:
            'A prática de integração contínua (CI) e entrega contínua (CD) tem se tornado essencial no desenvolvimento de software moderno. Ferramentas como Jenkins, GitHub Actions e CircleCI permitem automatizar a pipeline de deploy, garantindo entregas mais rápidas e com menor probabilidade de erros. No contexto de projetos ágeis, a adoção de CI/CD não só melhora a qualidade do código como também aumenta a confiança entre as equipes de desenvolvimento e operações. Com pipelines bem configuradas, é possível reduzir significativamente o tempo de entrega de novas funcionalidades.',
        tags: ['CI/CD', 'DevOps', 'Agilidade'],
    },
    {
        title: 'A Importância de Bancos de Dados NoSQL em Sistemas Escaláveis',
        author: 'Carlos Eduardo',
        content:
            'Com o crescimento exponencial de dados, bancos de dados NoSQL, como MongoDB, Cassandra e DynamoDB, têm se destacado por sua flexibilidade e escalabilidade. Diferente dos bancos de dados relacionais, os NoSQL permitem armazenar grandes volumes de dados não estruturados, sendo ideais para aplicações modernas como redes sociais, plataformas de e-commerce e sistemas de recomendação. O uso correto dessas tecnologias pode melhorar a performance e garantir a disponibilidade do sistema mesmo sob alta demanda.',
        tags: ['NoSQL', 'Banco de Dados', 'Escalabilidade'],
    },
    {
        title: 'Como Kubernetes Revolucionou a Orquestração de Contêineres',
        author: 'Geovana Rocha',
        content:
            'Kubernetes se tornou a principal solução para orquestração de contêineres, permitindo a implantação, escalabilidade e gerenciamento de aplicações de forma eficiente. Empresas de todos os portes têm adotado essa tecnologia devido à sua capacidade de garantir alta disponibilidade e resiliência. A configuração de clusters em Kubernetes também facilita o monitoramento de recursos e a automatização de tarefas, como balanceamento de carga e escalonamento automático. Para quem busca modernizar suas operações, Kubernetes é uma escolha indispensável.',
        tags: ['Kubernetes', 'Contêineres', 'Orquestração'],
    },
    {
        title: 'Os Desafios da Segurança em Arquiteturas Serverless',
        author: 'Carlos Henrique',
        content:
            'As arquiteturas serverless oferecem muitas vantagens, como redução de custos e facilidade de escalabilidade. No entanto, também trazem desafios únicos de segurança. A ausência de servidores físicos não elimina a necessidade de proteger endpoints, gerenciar permissões e garantir que as funções lambdas estejam livres de vulnerabilidades. Ferramentas como AWS Lambda, Azure Functions e Google Cloud Functions exigem boas práticas de configuração e monitoramento contínuo para evitar ataques como injeção de código ou acesso não autorizado.',
        tags: ['Serverless', 'Segurança', 'Cloud'],
    },
    {
        title: 'Práticas de DevOps para Times Distribuídos',
        author: 'Carlos Eduardo',
        content:
            'A colaboração em times distribuídos pode ser um desafio, mas práticas de DevOps ajudam a alinhar objetivos e acelerar entregas. Ferramentas como Docker, Kubernetes e Terraform garantem ambientes consistentes para desenvolvimento e produção, enquanto plataformas de comunicação como Slack e Microsoft Teams mantêm a equipe conectada. A automação de tarefas rotineiras também é fundamental para que os desenvolvedores se concentrem em tarefas críticas, promovendo um fluxo de trabalho mais eficiente.',
        tags: ['DevOps', 'Colaboração', 'Times Distribuídos'],
    },
    {
        title: 'A Evolução do Desenvolvimento Frontend com Frameworks Modernos',
        author: 'Geovana Rocha',
        content:
            'Nos últimos anos, o desenvolvimento frontend passou por uma grande evolução graças a frameworks como React, Angular e Vue.js. Essas ferramentas permitem a criação de interfaces dinâmicas e responsivas com maior facilidade, melhorando a experiência do usuário final. Além disso, a adoção de conceitos como componentização e state management trouxe mais organização ao código, facilitando a manutenção e a escalabilidade de projetos.',
        tags: ['Frontend', 'Frameworks', 'React'],
    },
    {
        title: 'O Futuro do Agronegócio com a Grão Direto',
        author: 'Fred Marques',
        content:
            'A Grão Direto continua a liderar a transformação digital no agronegócio brasileiro. A empresa não apenas conecta compradores e vendedores, mas também utiliza tecnologias como aprendizado de máquina e análise preditiva para otimizar transações. Com sede em Uberaba, Minas Gerais, a agtech está na vanguarda das inovações, trazendo mais eficiência e sustentabilidade ao setor. O uso de dados para prever tendências de mercado e gerenciar estoques em tempo real é uma das principais contribuições da Grão Direto.',
        tags: ['Grão Direto', 'Inovação', 'Agronegócio'],
    },
];

//= =================================================================================
function nameToEmail(name: string): string {
    return (
        name
            .toLowerCase()
            .replace(/\s+/g, '.')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') + '@email.com'
    );
}

//= =================================================================================
async function main() {
    seedLogger.info('Iniciando seed do banco de dados...');

    seedLogger.info('Limpando dados existentes...');
    await prisma.articleTag.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.article.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();

    seedLogger.info('Criando usuários...');

    const hashedPassword = await bcrypt.hash('123456', 10);
    const uniqueAuthors = [
        ...new Set(articlesData.map((article) => article.author)),
    ];

    const usersMap = new Map();

    for (const authorName of uniqueAuthors) {
        const email = nameToEmail(authorName);

        const user = await prisma.user.create({
            data: {
                name: authorName,
                email: email,
                password: hashedPassword,
            },
        });

        usersMap.set(authorName, user);
        seedLogger.debug(`     ${authorName} - ${email}`);
    }

    seedLogger.info('Criando tags...');

    const allTags = articlesData.flatMap((article) => article.tags);
    const uniqueTags = [...new Set(allTags)];

    const tagsMap = new Map();

    for (const tagName of uniqueTags) {
        const tag = await prisma.tag.create({
            data: { name: tagName },
        });

        tagsMap.set(tagName, tag);
        seedLogger.debug(`     ${tagName}`);
    }

    const articles: Array<
        ReturnType<typeof prisma.article.create> extends Promise<infer T>
            ? T & { tags: string[] }
            : never
    > = [];

    for (const articleData of articlesData) {
        const author = usersMap.get(articleData.author);

        const article = await prisma.article.create({
            data: {
                title: articleData.title,
                content: articleData.content,
                authorId: author.id,
            },
        });

        articles.push({
            ...article,
            tags: articleData.tags,
        });

        seedLogger.debug(`     ${articleData.title}`);
    }

    seedLogger.info('Criando relações entre artigos e tags...');

    let articleTagCount = 0;

    for (const article of articles) {
        for (const tagName of article.tags) {
            const tag = tagsMap.get(tagName);

            await prisma.articleTag.create({
                data: {
                    articleId: article.id,
                    tagId: tag.id,
                },
            });

            articleTagCount++;
        }
    }

    seedLogger.info('💬 Criando comentários de exemplo...');

    const commentsData = [
        {
            content:
                'Excelente artigo! A Grão Direto realmente está revolucionando o agronegócio brasileiro.',
            articleIndex: 0,
            authorName: 'Carlos Henrique',
        },
        {
            content:
                'Muito útil! Já estou implementando CI/CD no meu projeto seguindo essas práticas.',
            articleIndex: 1,
            authorName: 'Fred Marques',
        },
        {
            content:
                'NoSQL realmente faz a diferença em aplicações que precisam de alta escalabilidade.',
            articleIndex: 2,
            authorName: 'Geovana Rocha',
        },
        {
            content:
                'Kubernetes mudou completamente a forma como trabalhamos com contêineres.',
            articleIndex: 3,
            authorName: 'Carlos Eduardo',
        },
        {
            content:
                'Segurança em serverless é realmente um tópico que merece atenção especial.',
            articleIndex: 4,
            authorName: 'Geovana Rocha',
        },
        {
            content:
                'Times distribuídos são o futuro, e DevOps é essencial para isso funcionar.',
            articleIndex: 5,
            authorName: 'Fred Marques',
        },
        {
            content:
                'React realmente transformou o desenvolvimento frontend. Excelente overview!',
            articleIndex: 6,
            authorName: 'Carlos Henrique',
        },
        {
            content:
                'Parabéns pela visão sobre o futuro do agronegócio. A Grão Direto está no caminho certo!',
            articleIndex: 7,
            authorName: 'Carlos Eduardo',
        },
    ];

    for (const commentData of commentsData) {
        const article = articles[commentData.articleIndex];
        const user = usersMap.get(commentData.authorName);

        await prisma.comment.create({
            data: {
                content: commentData.content,
                articleId: article.id,
                userId: user.id,
            },
        });

        seedLogger.debug(`     Comentário no artigo "${article.title}"`);
    }

    seedLogger.info('💬 Criando respostas aos comentários...');

    const comments = await prisma.comment.findMany();

    await prisma.comment.create({
        data: {
            content:
                'Obrigado pelo feedback! Realmente acreditamos que a tecnologia pode transformar o agronegócio.',
            articleId: comments[0].articleId,
            userId: usersMap.get('Fred Marques').id,
            parentId: comments[0].id,
        },
    });

    await prisma.comment.create({
        data: {
            content:
                'Fico feliz em saber! Se tiver alguma dúvida durante a implementação, pode perguntar.',
            articleId: comments[1].articleId,
            userId: usersMap.get('Carlos Henrique').id,
            parentId: comments[1].id,
        },
    });

    seedLogger.info('✅ Seed executada com sucesso!');
    seedLogger.info(`📊 Dados criados:`);
    seedLogger.info(`   - ${uniqueAuthors.length} usuários`);
    seedLogger.info(`   - ${uniqueTags.length} tags`);
    seedLogger.info(`   - ${articles.length} artigos`);
    seedLogger.info(`   - ${articleTagCount} relações artigo-tag`);
    seedLogger.info(
        `   - ${commentsData.length + 2} comentários (incluindo respostas)`
    );

    seedLogger.info(`\n👥 Usuários criados:`);
    for (const authorName of uniqueAuthors) {
        const email = nameToEmail(authorName);
        seedLogger.info(`   - ${authorName} (${email}) - senha: 123456`);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        logger.error('Erro ao executar seed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
