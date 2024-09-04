import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import {
  ENV_DB_DATABASE_KEY,
  ENV_DB_HOST_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_USERNAME_KEY,
} from '../../modules/common/constants/env-keys.constant';

/**
 * 로컬에서 각 환경 마이그레이션을 위해 사용되는 환경 변수 파일을 설정합니다.
 * 마이그레이션 CLI: `$ NODE_ENV=production npm run migration:run`
 */
const ENV_PATH = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

config({ path: ENV_PATH });

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env[ENV_DB_HOST_KEY],
  port: parseInt(process.env[ENV_DB_PORT_KEY]),
  username: process.env[ENV_DB_USERNAME_KEY],
  password: process.env[ENV_DB_PASSWORD_KEY],
  database: process.env[ENV_DB_DATABASE_KEY],
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: ['dist/core/db/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  logging: process.env.NODE_ENV !== 'production',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
