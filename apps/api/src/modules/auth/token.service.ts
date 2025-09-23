// src/auth/token.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async createAccessToken(userId: string, companyId: string, email: string, isOwner = false, remember = false) {
    const jti = randomUUID();
    const payload = { sub: userId, companyId, email, isOwner, jti };

    const expiresIn = remember
      ? process.env.ACCESS_EXPIRE_REMEMBER || '4d'
      : process.env.ACCESS_EXPIRE_SHORT || '8h';

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.TOKEN_SECRET || 'default_dev_secret',
      expiresIn,
    });

    return { accessToken, jti, expiresIn };
  }

  decode(token: string) {
    return this.jwtService.decode(token) as any;
  }
  
}
