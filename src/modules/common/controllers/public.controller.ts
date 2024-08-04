import {
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
    return { uploadFilename: image.filename };
  }
}
