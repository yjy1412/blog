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
  additionalLogData?: object;
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
          /**
           * 콘솔에 출력될 로그 메시지 포맷을 결정합니다.
           * 로그 레벨에 따라 출력될 로그 message의 색이 결정됩니다.
           */
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
            const addtionalLogDataBody = `${this.colorizeLogFormat(LogLevelEnum.WARN, JSON.stringify(additionalLogData, null, 2))}`;

            logMessage += ` \n\n ${addtionalLogDataTitle} \n\n ${addtionalLogDataBody} \n`;
          }

          return logMessage;
        },
      ),
    );
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, logContext: string, additionalLogData?: object) {
    this.logger.log('info', message, { logContext, additionalLogData });
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, logContext: string, additionalLogData?: object) {
    this.logger.log('error', message, { logContext, additionalLogData });
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, logContext: string, additionalLogData?: object) {
    this.logger.log('warn', message, { logContext, additionalLogData });
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any, logContext: string, additionalLogData?: object) {
    this.logger.log('debug', message, { logContext, additionalLogData });
  }
}
