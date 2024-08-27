import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { DB_TABLE_NAME } from '../../../modules/common/constants/db-table-name.constant';

export class CreateTableUserChatMappings1724732202947
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DB_TABLE_NAME.CHAT_USER_MAPPINGS,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'chat_id',
            type: 'int',
            comment: '채팅방 ID',
          },
          {
            name: 'user_id',
            type: 'int',
            comment: '사용자 ID',
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
        foreignKeys: [
          {
            columnNames: ['chat_id'],
            referencedTableName: DB_TABLE_NAME.CHATS,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['user_id'],
            referencedTableName: DB_TABLE_NAME.USERS,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(DB_TABLE_NAME.CHAT_USER_MAPPINGS);
  }
}
