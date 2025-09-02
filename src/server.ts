import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import app from './app.js';

const serverLogger = logger.createModuleLogger('SERVER');

app.listen(env.PORT, () => {
    serverLogger.success('Middlewares loaded successfully');
    console.log('\n');
    serverLogger.success(`Server running on http://localhost:${env.PORT}`);
    console.log('\n\n');
});
