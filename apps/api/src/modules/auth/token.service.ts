// src/auth/token.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async createAccessToken(userId: string, email: string, remember = false) {
    const jti = randomUUID();
    const payload = { sub: userId, email, jti };

    const expiresIn = remember
      ? process.env.ACCESS_EXPIRE_REMEMBER || '4d'
      : process.env.ACCESS_EXPIRE_SHORT || '15m';

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
