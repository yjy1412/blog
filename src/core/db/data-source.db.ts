import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import {
  ENV_DB_DATABASE_KEY,
  ENV_DB_HOST_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_USERNAME_KEY,
} from '../../modules/common/constants/env-keys.constant';

config();

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
});
