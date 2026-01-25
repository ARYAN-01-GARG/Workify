import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from 'src/common/guards/roles.guard';
import { UserRole } from '@repo/db';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { CompanyQueryDto } from './dto/company-query.dto';
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
  @ApiOperation({
    summary: 'List all companies',
    description: 'Returns a paginated list of companies with search and filters.',
  })
  @ApiResponse({ status: 200, description: 'List of companies retrieved successfully' })
  findAll(@Query() query: CompanyQueryDto) {
    return this.companyService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get company details',
    description: 'Returns detailed information about a specific company.',
  })
  @ApiResponse({ status: 200, description: 'Company details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.RECRUITER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update company details',
    description: 'Updates company information. Only the linked recruiter can update.',
  })
  @ApiResponse({ status: 200, description: 'Company updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request (e.g., Not authorized or Invalid Data)' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  update(@Param('id') id: string, @Req() req: RequestWithUser, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, req.user.id, updateCompanyDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.RECRUITER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete company', description: 'Deletes a company. Only the linked recruiter can delete.' })
  @ApiResponse({ status: 200, description: 'Company deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request (e.g., Not authorized)' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.companyService.remove(id, req.user.id);
  }
}
