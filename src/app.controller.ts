import { Controller, Get } from '@nestjs/common';
import { Public } from './modules/common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor() {}

  @Get('ping')
  @Public()
  ping(): string {
    return 'ok';
  }
}
