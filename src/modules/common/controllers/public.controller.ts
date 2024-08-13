import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('public')
export class PublicController {
  @Post('images')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(@UploadedFile() image: Express.Multer.File) {
    if (!image) {
      throw new BadRequestException('업로드할 이미지 파일을 찾을 수 없습니다.');
    }

    return { uploadFilename: image.filename };
  }
}
