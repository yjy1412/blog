import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { DB_TABLE_NAME } from '../../../modules/common/constants/db-table-name.constant';

export class CreateTableUser1724671539464 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DB_TABLE_NAME.USERS,
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '50',
            isUnique: true,
            comment: '이메일',
          },
          {
            name: 'password',
            type: 'varchar',
            length: '124',
            comment: '비밀번호',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            comment: '이름',
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp with time zone',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(DB_TABLE_NAME.USERS);
  }
}
