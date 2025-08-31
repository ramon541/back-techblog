type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

interface LogOptions {
    prefix?: string;
    timestamp?: boolean;
    colors?: boolean;
}

class Logger {
    private colors = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        dim: '\x1b[2m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        gray: '\x1b[90m',
    };

    private levelConfig = {
        debug: { emoji: '🐛', color: this.colors.gray, label: 'DEBUG' },
        info: { emoji: 'ℹ️', color: this.colors.blue, label: 'INFO' },
        warn: { emoji: '⚠️', color: this.colors.yellow, label: 'WARN' },
        error: { emoji: '❌', color: this.colors.red, label: 'ERROR' },
        success: { emoji: '✅', color: this.colors.green, label: 'SUCCESS' },
    };

    private formatTimestamp(): string {
        return new Date().toISOString().replace('T', ' ').slice(0, 19);
    }

    private formatMessage(
        level: LogLevel,
        message: string,
        data?: any,
        options: LogOptions = {}
    ): string {
        const config = this.levelConfig[level];
        const useColors = options.colors ?? true;
        const showTimestamp = options.timestamp ?? true;
        const prefix = options.prefix ? `[${options.prefix}]` : '';

        let output = '';

        // Timestamp
        if (showTimestamp) {
            const timestamp = this.formatTimestamp();
            output += useColors
                ? `${this.colors.gray}${timestamp}${this.colors.reset} `
                : `${timestamp} `;
        }

        // Prefix
        if (prefix) {
            output += useColors
                ? `${this.colors.cyan}${prefix}${this.colors.reset} `
                : `${prefix} `;
        }

        // Level indicator
        const levelIndicator = `${config.emoji} ${config.label}`;
        output += useColors
            ? `${config.color}${levelIndicator}${this.colors.reset}: `
            : `${levelIndicator}: `;

        // Message
        output += message;

        // Data (if provided)
        if (data !== undefined) {
            const formattedData =
                typeof data === 'object'
                    ? JSON.stringify(data, null, 2)
                    : String(data);

            output += useColors
                ? `\n${this.colors.dim}${formattedData}${this.colors.reset}`
                : `\n${formattedData}`;
        }

        return output;
    }

    debug(message: string, data?: any, options?: LogOptions): void {
        console.debug(this.formatMessage('debug', message, data, options));
    }

    info(message: string, data?: any, options?: LogOptions): void {
        console.info(this.formatMessage('info', message, data, options));
    }

    warn(message: string, data?: any, options?: LogOptions): void {
        console.warn(this.formatMessage('warn', message, data, options));
    }

    error(message: string, data?: any, options?: LogOptions): void {
        console.error(this.formatMessage('error', message, data, options));
    }

    success(message: string, data?: any, options?: LogOptions): void {
        console.log(this.formatMessage('success', message, data, options));
    }

    // Métodos de conveniência
    http(method: string, path: string, status: number, time?: number): void {
        const statusColor =
            status >= 500 ? 'error' : status >= 400 ? 'warn' : 'success';
        const timeStr = time ? ` (${time}ms)` : '';

        this[statusColor](
            `${method} ${path} - ${status}${timeStr}`,
            undefined,
            { prefix: 'HTTP' }
        );
    }

    database(operation: string, table: string, time?: number): void {
        const timeStr = time ? ` (${time}ms)` : '';
        this.debug(`${operation} on ${table}${timeStr}`, undefined, {
            prefix: 'DB',
        });
    }

    auth(action: string, user?: string): void {
        this.info(`${action}${user ? ` for user: ${user}` : ''}`, undefined, {
            prefix: 'AUTH',
        });
    }

    createModuleLogger(moduleName: string) {
        return {
            debug: (message: string, data?: any) =>
                this.debug(message, data, { prefix: moduleName }),
            info: (message: string, data?: any) =>
                this.info(message, data, { prefix: moduleName }),
            warn: (message: string, data?: any) =>
                this.warn(message, data, { prefix: moduleName }),
            error: (message: string, data?: any) =>
                this.error(message, data, { prefix: moduleName }),
            success: (message: string, data?: any) =>
                this.success(message, data, { prefix: moduleName }),
        };
    }
}

export const logger = new Logger();

export default logger;
