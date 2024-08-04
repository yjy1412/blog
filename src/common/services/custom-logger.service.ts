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
        ({ timestamp, level, message, ms }: LogComponent) => {
          return `${timestamp} [${this.colorizeLogFormat(level, level.toUpperCase())}] ${message} ${this.colorizeLogFormat(LogLevelEnum.DEBUG, ms)}`;
        },
      ),
    );
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    this.logger.log('info', message, ...optionalParams);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    this.logger.log('error', message, ...optionalParams);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    this.logger.log('warn', message, ...optionalParams);
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any, ...optionalParams: any[]) {
    this.logger.log('debug', message, ...optionalParams);
  }
}
