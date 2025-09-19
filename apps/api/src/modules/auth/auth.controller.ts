// apps/api/src/modules/auth/auth.controller.ts
import { Controller, Post, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';
import { RegisterDto } from '@om/shared';

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
  @Post('login')
  async login(
    @Body()
    dto: {
      email: string;
      password: string;
      companyId: string;
      remember?: boolean;
    },
  ) {
    return this.authService.login(
      dto.email,
      dto.password,
      dto.companyId,
      !!dto.remember,
    );
  }

}
