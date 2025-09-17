// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { TokenService } from './token.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string, companyId: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        company_id_email: {
          company_id: companyId, // must come from login input
          email,
        },
      },
    });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password_hash ?? '');
    if (!ok) return null;
    const { password: _p, ...safe } = user as any;
    return safe;
  }

  async login(
    email: string,
    password: string,
    companyId: string,
    remember = false,
  ) {
    const user = await this.prisma.users.findUnique({
      where: {
        company_id_email: {
          company_id: companyId, // must come from login input
          email,
        },
      },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password_hash ?? '');
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.tokenService.createAccessToken(user.id, user.email, remember);
  }

  async testLogin() {
    // hardcoded fake user
    const fakeUserId = '00000000-0000-0000-0000-000000000001';
    const fakeEmail = 'dummy@example.com';

    // always issues a valid token, no DB check
    return this.tokenService.createAccessToken(fakeUserId, fakeEmail, false);
  }
}
