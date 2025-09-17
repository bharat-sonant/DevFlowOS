// apps/api/src/modules/auth/auth.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  // dummy endpoint for quick testing
  @Public()
  @Get('testlogin')
  testLogin() {
    return this.authService.testLogin();
  }
}
