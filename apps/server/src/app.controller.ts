import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';

@Controller()
@ApiTags('Health Check')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @Public()
  @ApiOperation({
    summary: 'Health check',
  })
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
