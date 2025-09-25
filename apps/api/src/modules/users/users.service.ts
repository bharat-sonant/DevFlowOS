
import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { UsersServiceBase } from "./base/users.service.base";
import { randomUUID } from "crypto";
import { PrismaService } from "prisma/prisma.service";
import { EmailService } from "src/email/email.service";
import { CommonService } from "src/common/services/common.service";
import { CompleteRegistrationDto, UserTokenType } from "@om/shared";

@Injectable()
export class UsersService extends UsersServiceBase {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly commonService: CommonService
  ) {
    super(prisma); // call base constructor
  }

  async inviteUser(email: string, companyId: string, invitedBy: string) {
    // check if already invited or exists
    const existingToken = await this.prisma.user_tokens.findFirst({
      where: { email, type: UserTokenType.INVITE, is_verified: false },
    });

    if (existingToken) {
      throw new BadRequestException('User with this email is already invited');
    }

    // generate token
    const { token, expiresAt } = this.commonService.generateToken(email);

    await this.prisma.user_tokens.create({
      data: {
        email,
        // user_id: invitedBy,
        token,
        type: UserTokenType.INVITE,
        expires_at: expiresAt
      },
    });

    // send invitation email
    const company = await this.prisma.companies.findUnique({
      where: { id: companyId },
    });

    await this.emailService.sendInviteEmail(email, token, (company?.full_name ?? company?.name)!);

    return {
      email,
      companyId,
      invitedBy,
      expiresAt,
    };
  }

  async validateInvite(token: string) {
    const userToken = await this.prisma.user_tokens.findFirst({
      where: {
        token,
        type: UserTokenType.INVITE,
        is_verified: false,
        expires_at: { gt: new Date() },
      },
      include: {
        users: {
          include: {
            companies: true,
          },
        },
      },
    });

    if (!userToken || !userToken.users) {
      return null;
    }

    return {
      email: userToken.email,
      companyName: userToken.users.companies.name,
      companyCode: userToken.users.companies.code,
    };
  }

  // apps/api/src/modules/users/users.service.ts

  async completeRegistration(dto: CompleteRegistrationDto, companyId: string) {
     return this.prisma.$transaction(async (tx) => {
    // 1) Load token and (optionally) its linked user
    const userToken = await tx.user_tokens.findUnique({
      where: { token: dto.token },
      include: { users: true },
    });

    if (!userToken) {
      throw new BadRequestException('Invitation link is invalid or expired');
    }

    if (userToken.type !== UserTokenType.INVITE) {
      throw new BadRequestException('Invalid token type for this operation');
    }
    if (userToken.is_verified) {
      throw new BadRequestException('This invitation link has already been used');
    }
    if (userToken.expires_at <= new Date()) {
      throw new BadRequestException('Invitation link is expired');
    }

    // 2) Validate companyId (fix for FK constraint issue)
    const companyRecord = await tx.companies.findUnique({
      where: { id: companyId },
    });
    if (!companyRecord) {
      throw new BadRequestException('Provided companyId does not exist');
    }

    // 3) Enforce username uniqueness within company
    const existing = await tx.users.findFirst({
      where: {
        company_id: companyId,
        username: dto.username,
      },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('Username already exists within the company');
    }

    // 4) Hash password
    const passwordHash = await this.commonService.hashPassword(dto.password);

    // 5) Create or update user
    let userRecord;
    if (userToken.user_id) {
      userRecord = await tx.users.update({
        where: { id: userToken.user_id },
        data: {
          username: dto.username,
          password_hash: passwordHash,
          full_name: dto.fullName,
          is_active: true,
          updated_at: new Date(),
        },
      });
    } else {
      userRecord = await tx.users.create({
        data: {
          company_id: companyId,
          email: userToken.email,
          username: dto.username,
          password_hash: passwordHash,
          full_name: dto.fullName,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    }

    // 6) Link token -> user and mark token consumed
    await tx.user_tokens.update({
      where: { id: userToken.id },
      data: {
        user_id: userRecord.id,
        is_verified: true,
        used_at: new Date(),
      },
    });

    // 7) Return response
      return {
        user: {
          username: userRecord.username,
          fullName: userRecord.full_name,
          isOwner: userRecord.is_owner,
        }
      };
    }).catch((err) => {
      if (err?.code === 'P2002') {
        throw new ConflictException('Duplicate value conflict (username or email)');
      }
      throw err;
    });
  }

}
