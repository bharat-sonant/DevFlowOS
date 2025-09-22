// apps/api/src/modules/auth/auth.controller.ts
import { Controller, Post, Body, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '@om/shared';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Get('validate-company')
  async validateCompany(@Query('companyCode') companyCode: string) {
    return this.authService.validateCompany(companyCode);
  }

  @Public()
   @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

}
