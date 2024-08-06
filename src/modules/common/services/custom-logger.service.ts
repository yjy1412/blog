import { LoggerService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import {
  ENV_LOG_LEVEL_KEY,
  ENV_NODE_ENV_KEY,
} from '../constants/env-keys.constant';

enum LogLevelEnum {
  INFO = 'info',
  ERROR = 'error',
  WARN = 'warn',
  DEBUG = 'debug',
}

interface LogComponent {
  timestamp: string;
  level: LogLevelEnum;
  message: string;
  ms: string;
  logContext: string;
  additionalLogData?: string | object;
}

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    this.logger = winston.createLogger({
      /**
       * 최소 로그 레벨입니다.
       */
      level: this.configService.get<string>(ENV_LOG_LEVEL_KEY) || 'debug',
      /**
       * 로그 출력 형식입니다.
       */
      transports:
        this.configService.get<string>(ENV_NODE_ENV_KEY) === 'production'
          ? new winston.transports.Console({ format: winston.format.json() })
          : new winston.transports.Console({
              format: this.generateLogFormatForConsole(),
            }),
    });
  }

  private colorizeLogFormat(level: string, target: string) {
    const winstonColorizer = winston.format.colorize({
      colors: {
        error: 'bold redBG',
        warn: 'yellow',
        info: 'green',
        debug: 'blue',
      },
    });

    return winstonColorizer.colorize(level, target);
  }

  private generateLogFormatForConsole() {
    return winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.ms(),
      winston.format.printf(
        ({
          timestamp,
          level,
          message,
          ms,
          logContext,
          additionalLogData,
        }: LogComponent) => {
          const logLevelFormat = this.colorizeLogFormat(
            level,
            level.toUpperCase(),
          );
          const logMessageFormat = this.colorizeLogFormat(level, message);
          const logMsFormat = this.colorizeLogFormat(LogLevelEnum.DEBUG, ms);

          /**
           * 예시) 2024-08-04 22:06:48 [INFO][NestApplication] Nest application successfully started +0ms
           */
          let logMessage = `${timestamp} [${logLevelFormat}][${logContext}] ${logMessageFormat} ${logMsFormat}`;

          if (additionalLogData) {
            const addtionalLogDataTitle = `${this.colorizeLogFormat(LogLevelEnum.WARN, '[AdditionalLogData]')}`;
            const addtionalLogDataBody = `${this.colorizeLogFormat(LogLevelEnum.WARN, JSON.stringify(additionalLogData, null, 2)).replace(/\\n/g, '\n')}`;

            logMessage += ` \n\n ${addtionalLogDataTitle} \n\n ${addtionalLogDataBody} \n`;
          }

          return logMessage;
        },
      ),
    );
  }

  log(
    message: LogComponent['message'],
    logContext: LogComponent['logContext'],
    additionalLogData?: LogComponent['additionalLogData'],
  ) {
    this.logger.log('info', message, { logContext, additionalLogData });
  }

  error(
    message: LogComponent['message'],
    logContext: LogComponent['logContext'],
    additionalLogData?: LogComponent['additionalLogData'],
  ) {
    this.logger.log('error', message, { logContext, additionalLogData });
  }

  warn(
    message: LogComponent['message'],
    logContext: LogComponent['logContext'],
    additionalLogData?: LogComponent['additionalLogData'],
  ) {
    this.logger.log('warn', message, { logContext, additionalLogData });
  }

  debug(
    message: LogComponent['message'],
    logContext: LogComponent['logContext'],
    additionalLogData?: LogComponent['additionalLogData'],
  ) {
    this.logger.log('debug', message, { logContext, additionalLogData });
  }
}
