import { CustomLoggerService } from '../../modules/common/services/custom-logger.service';
import { dataSource } from './data-source.db';
import { postCommentsSeed } from './seeds/post-comments.seed';
import { postsSeed } from './seeds/posts.seed';
import { usersSeed } from './seeds/users.seed';

export const generateSeed = async (loggerService: CustomLoggerService) => {
  dataSource.initialize().then(async (dataSource) => {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await usersSeed(dataSource);
      await postsSeed(dataSource);
      await postCommentsSeed(dataSource);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      loggerService.error(
        '데이터 시드 생성 과정 중 에러가 발생했습니다.',
        generateSeed.name,
        error.stack,
      );
    } finally {
      await queryRunner.release();
    }
  });
};
