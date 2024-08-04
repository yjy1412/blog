import { BadRequestException, Module } from '@nestjs/common';
import { PaginationService } from './services/pagination.service';
import { PublicController } from './controllers/public.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_TEMP_PATH } from './constants/path.constant';
import { CustomLoggerService } from './services/logger.service';

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
        destination: function (req, file, cb) {
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
