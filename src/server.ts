import express from 'express';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { requestLoggingMiddleware } from './middlewares/requestLogging.middleware.js';

const serverLogger = logger.createModuleLogger('SERVER');

const app = express();

// Request logging middleware
app.use(requestLoggingMiddleware);

// Basic middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(env.PORT, () => {
    serverLogger.success('Middlewares loaded successfully');
    console.log('\n');
    serverLogger.success(`Server running on http://localhost:${env.PORT}`);
    console.log('\n\n');
});
