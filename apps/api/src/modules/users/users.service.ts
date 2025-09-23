
import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersServiceBase } from "./base/users.service.base";
import { randomUUID } from "crypto";
import { PrismaService } from "prisma/prisma.service";
import { EmailService } from "src/email/email.service";
import { CommonService } from "src/common/services/common.service";
import { UserTokenType } from "@om/shared";

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
        user_id: invitedBy,
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
console.log('userToken: ', userToken);
    if (!userToken || !userToken.users) {
      return null;
    }

    return {
      email: userToken.email,
      companyId: userToken.users.companies.id,
      companyName: userToken.users.companies.name,
      companyCode: userToken.users.companies.code,
    };
  }

}
