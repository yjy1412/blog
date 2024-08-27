import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { DB_TABLE_NAME } from '../../../modules/common/constants/db-table-name.constant';

export class CreateTablePosts1724671665285 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: DB_TABLE_NAME.POSTS,
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '100',
            comment: '제목',
          },
          {
            name: 'content',
            type: 'text',
            comment: '내용',
          },
          {
            name: 'like_count',
            type: 'int',
            default: 0,
            comment: '좋아요 수',
          },
          {
            name: 'comment_count',
            type: 'int',
            default: 0,
            comment: '댓글 수',
          },
          {
            name: 'author_id',
            type: 'bigint',
            comment: '작성자 ID',
          },
          {
            name: 'images',
            type: 'jsonb',
            isNullable: true,
            comment: '업로드 이미지 경로 리스트',
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
            columnNames: ['author_id'],
            referencedTableName: DB_TABLE_NAME.USERS,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(DB_TABLE_NAME.POSTS);
  }
}
