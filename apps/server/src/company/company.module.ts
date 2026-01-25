import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService], // Exported for Jobs module later
})
export class CompanyModule {}
