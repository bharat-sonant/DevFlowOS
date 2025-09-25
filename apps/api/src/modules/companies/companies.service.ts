import { EmailService } from 'src/email/email.service';
import { CommonService } from 'src/common/services/common.service';

import { Injectable } from '@nestjs/common';
import { CompaniesServiceBase } from './base/companies.service.base';
import { PrismaService } from 'prisma/prisma.service';
import * as crypto from 'crypto';
import { UserTokenType } from '@om/shared';

@Injectable()
export class CompaniesService extends CompaniesServiceBase {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly CommonService: CommonService,
    private readonly EmailService:EmailService,
  ) {
    super(prisma);
  }

  async preRegister(email: string) {

     // 1. Check if user already exists globally
  const existingUser = await this.prisma.users.findFirst({
  where: { email },
});

  if (existingUser) {
    return {
      success: false,
      message: 'Email already registered',
      email,
    };
  }

    // 2. Check if there’s an unverified pre-registration token already
  const existingToken = await this.prisma.user_tokens.findFirst({
    where: { email, type: UserTokenType.VERIFICATION, is_verified: false },
  });
  if (existingToken) {
    return {
      success: false,
      message: 'Company already pre-registered',
      email,
      companyId: existingToken.id,
    };
  }

    const { token, expiresAt } = this.CommonService.generateToken(email);

      const userToken = await this.prisma.user_tokens.create({
       data: {
      email,
      is_verified: false,
      type: UserTokenType.VERIFICATION,
      token,
      expires_at: expiresAt,
    },
    });

    // 6. Generate verification link
  const verificationUrl = `${
    process.env.BASE_URL || 'http://localhost:3001'
  }/companies/auth/verify-email?token=${encodeURIComponent(token)}`;

  // 7. Send email (🔥 missing in your code)
  await this.EmailService.sendVerificationEmail(email, token);


    // 8. Return response
  return {
    success: true,
    message: 'Company pre-registered successfully. Please check your email to verify.',
    email,
    companyId: userToken.id,
    verificationUrl, // optionally for debugging
  };
  }

  // Verify email with token
  async verifyEmailToken(token: string) {

    // Find the token in database
    const userToken = await this.prisma.user_tokens.findFirst({
      where: {
        token: token,
        type: UserTokenType.VERIFICATION,
      },
    });

    if (!userToken) {
      throw new Error('Token not found in database');
    }

    if (userToken.is_verified) {
      throw new Error('Token already used');
    }

    // Verify HMAC signature and timestamp
  const verification = this.CommonService.verifyToken(token, userToken.email);

  if (!verification.valid) {
    throw new Error(`Token verification failed: ${verification.reason}`);
  }

  // Double-check database expiration
  if (new Date() > userToken.expires_at) throw new Error('Token expired');

  // Mark as verified
  const updatedToken = await this.prisma.user_tokens.update({
    where: { id: userToken.id },
    data: { is_verified: true },
  });

  return {
    message: 'Email verified successfully',
    email: updatedToken.email,
    verified: true,
    tokenId: updatedToken.id,
  };
  }

}