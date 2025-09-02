import { PrismaClient } from '../generated/prisma/index.js';
import { logger } from '../utils/logger.js';

// Logger específico para o banco de dados
const dbLogger = logger.createModuleLogger('DATABASE');

const prisma = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
});

// Event listeners para capturar logs do Prisma
prisma.$on('query', (e) => {
    dbLogger.debug(`Query executed (${e.duration}ms)`, {
        query: e.query,
        params: e.params,
        target: e.target,
    });
});

prisma.$on('info', (e) => {
    dbLogger.info(e.message, {
        target: e.target,
        timestamp: e.timestamp,
    });
});

prisma.$on('warn', (e) => {
    dbLogger.warn(e.message, {
        target: e.target,
        timestamp: e.timestamp,
    });
});

prisma.$on('error', (e) => {
    dbLogger.error(e.message, {
        target: e.target,
        timestamp: e.timestamp,
    });
});

// Log de conexão
prisma
    .$connect()
    .then(() => {
        dbLogger.success('Database connected successfully');
    })
    .catch((error) => {
        dbLogger.error('Failed to connect to database', {
            error: error.message,
            stack: error.stack,
        });
    });

// Log de desconexão no processo de encerramento
process.on('beforeExit', async () => {
    await prisma.$disconnect();
    dbLogger.info('Database disconnected');
});

export default prisma;
