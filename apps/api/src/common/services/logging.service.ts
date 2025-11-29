import { Injectable, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService {
    private readonly baseDir = path.join(process.cwd(), 'logs');
    private readonly enabledLevels: Set<LogLevel>;
    private readonly logToConsole: boolean;

    constructor() {
        const levels =
            process.env.LOG_LEVELS?.split(',').map(l => l.trim().toLowerCase()) || ['error'];
        this.enabledLevels = new Set(levels as LogLevel[]);

        this.logToConsole = process.env.LOG_TO_CONSOLE === 'true';
    }

    private getLogFile(level: LogLevel): string {
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        let folderName: string = level;

        // Rename "log" level folder to "info"
        if (level === 'log') {
            folderName = 'info';
        }

        const folder = path.join(this.baseDir, folderName);
        fs.mkdirSync(folder, { recursive: true });
        return path.join(folder, `${date}.log`);
    }


    private writeLog(level: LogLevel, context: string, message: string, stack?: string) {
        if (!this.enabledLevels.has(level)) return;

        const logEntry = `[${new Date().toISOString()}] [${level.toUpperCase()}] [${context}] ${message}\n${stack ?? ''}\n`;

        // Write to file
        const logFile = this.getLogFile(level);
        fs.appendFileSync(logFile, logEntry, 'utf8');

        // Optional console output
        if (this.logToConsole) {
            switch (level) {
                case 'error':
                    console.error(logEntry);
                    break;
                case 'warn':
                    console.warn(logEntry);
                    break;
                case 'log':
                    console.log(logEntry);
                    break;
                case 'debug':
                    console.debug(logEntry);
                    break;
                case 'verbose':
                    console.info(logEntry);
                    break;
            }
        }
    }

    error(context: string, message: string, stack?: string) {
        this.writeLog('error', context, message, stack);
    }

    warn(context: string, message: string) {
        this.writeLog('warn', context, message);
    }

    log(context: string, message: string) {
        this.writeLog('log', context, message);
    }

    debug(context: string, message: string) {
        this.writeLog('debug', context, message);
    }

    verbose(context: string, message: string) {
        this.writeLog('verbose', context, message);
    }
}
