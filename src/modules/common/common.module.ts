import {
  BadRequestException,
  InternalServerErrorException,
  Module,
} from '@nestjs/common';
import { PaginationService } from './services/pagination.service';
import { PublicController } from './controllers/public.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import {
  PUBLIC_POST_IMAGE_PATH,
  PUBLIC_TEMP_PATH,
} from './constants/path.constant';
import { CustomLoggerService } from './services/custom-logger.service';
import { promises as fs } from 'fs';

@Module({
  imports: [
    MulterModule.register({
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);

        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(
            new BadRequestException(
              'jpg/jpeg/png 파일만 업로드 할 수 있습니다.',
            ),
            false,
          );
        }

        return cb(null, true);
      },
      storage: multer.diskStorage({
        destination: async (req, file, cb) => {
          try {
            await fs.mkdir(PUBLIC_TEMP_PATH, { recursive: true });
            await fs.mkdir(PUBLIC_POST_IMAGE_PATH, { recursive: true });
          } catch (err) {
            throw new InternalServerErrorException(
              '업로드 저장 경로를 생성하는데 실패했습니다.',
            );
          }

          cb(null, PUBLIC_TEMP_PATH);
        },
        filename: function (req, file, cb) {
          cb(null, `${uuidv4()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [PublicController],
  providers: [PaginationService, CustomLoggerService],
  exports: [PaginationService, CustomLoggerService],
})
export class CommonModule {}
