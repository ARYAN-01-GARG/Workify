import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from 'src/common/guards/roles.guard';
import { UserRole } from '@repo/db';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { RequestWithUser } from '@repo/shared-types';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Company')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.RECRUITER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'Company created successfully' })
  create(@Req() req: RequestWithUser, @Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(req.user.id, createCompanyDto);
  }

  @Get()
  @Public() // Accessible to all
  @ApiOperation({ summary: 'List all companies' })
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get company details' })
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.RECRUITER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update company details' })
  update(@Param('id') id: string, @Req() req: RequestWithUser, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, req.user.id, updateCompanyDto);
  }
}
