import { z } from 'zod';
import { logger } from '../utils/logger.js';

const envLogger = logger.createModuleLogger('ENV');

//= =================================================================================
try {
    if (typeof process.loadEnvFile === 'function') {
        process.loadEnvFile('.env');
        envLogger.debug('.env file loaded using native Node.js');
    } else {
        const { config } = await import('dotenv');
        config();
        envLogger.debug('.env file loaded using dotenv');
    }
} catch (error) {
    envLogger.warn('Could not load .env file, using system variables');
}

//= =================================================================================
const envSchema = z.object({
    PORT: z.coerce.number().min(1).max(65535).default(3000),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    BCRYPT_SALT_ROUNDS: z.coerce.number().min(4).max(15).default(12),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    envLogger.error('Environment variables configuration error');

    const errors = result.error.format();

    Object.entries(errors).forEach(([key, value]) => {
        if (key !== '_errors' && value && typeof value === 'object') {
            const fieldErrors = (value as any)._errors;
            if (fieldErrors && fieldErrors.length > 0) {
                console.error(`  🔸 ${key}:`);
                fieldErrors.forEach((error: string) => {
                    console.error(`     ↳ ${error}`);
                });
                console.error('');
            }
        }
    });

    console.error('📋 Expected variables:');
    Object.keys(envSchema.shape).forEach((key) => {
        const hasValue = process.env[key] !== undefined;
        const status = hasValue ? '✅' : '❌';
        const value = hasValue
            ? key.includes('SECRET')
                ? '[HIDDEN]'
                : process.env[key]
            : 'not defined';
        console.error(`  ${status} ${key}: ${value}`);
    });

    envLogger.error(
        'Please check if .env file exists and contains all required variables'
    );
    process.exit(1);
}

envLogger.success('All environment variables loaded successfully');

export const env = result.data;

export type Env = typeof env;
