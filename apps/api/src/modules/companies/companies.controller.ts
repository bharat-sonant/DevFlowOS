import { CompaniesControllerBase } from './base/companies.controller.base';
import { CompaniesService } from './companies.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from '../auth/public.decorator';

@ApiBearerAuth('access-token')
@Controller('companies')
export class CompaniesController extends CompaniesControllerBase {
  constructor(protected readonly service: CompaniesService) {
    super(service);
  }

  // ✅ Add custom endpoints here
  @Public()
  @Post('pre-register')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
      required: ['email'],
    },
  })
  async preRegister(@Body() body: { email: string }) {
    const result = await this.service.preRegister(body.email);
    if (!result) {
      throw new BadRequestException('Company could not be pre-registered.');
    }
    return result;
  }

  // ✅ Email verification endpoint (redirects to frontend)
  @Public()
  @Get('/auth/verify-email')
  async verifyEmail(
    @Query('token') token: string,
  ) {
      return await this.service.verifyEmailToken(token)
    }
  }
