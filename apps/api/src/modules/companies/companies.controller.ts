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
    // @Query("email") email: string,
  ) {

    if (!token) {
      return { success: false, error: 'missing_params' };
    }

    try {
      const verifiedData = await this.service.verifyEmailToken(token);
       return {
      success: true,
      email: verifiedData.email,
      tokenId: verifiedData.tokenId,
    };
    } catch (error: any) {
      // Error: Redirect to error page with specific error type
      let errorType = 'verification_failed';
      if (error.message.includes('expired')) {
        errorType = 'token_expired';
      } else if (
        error.message.includes('invalid') ||
        error.message.includes('malformed')
      ) {
        errorType = 'token_invalid';
      } else if (error.message.includes('already used')) {
        errorType = 'token_used';
      } else if (error.message.includes('not found')) {
        errorType = 'token_not_found';
      }
      return { success: false, error: errorType };
    }
  }
}
