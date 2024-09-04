import { Controller, Get } from '@nestjs/common';
import { Public } from './modules/common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @Public()
  ping(): string {
    return 'pong';
  }
}
