
import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersServiceBase } from "./base/users.service.base";
import { randomUUID } from "crypto";
import { PrismaService } from "prisma/prisma.service";
import { EmailService } from "src/email/email.service";
import { CommonService } from "src/common/services/common.service";

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
      where: { email, type: 'INVITE', is_verified: false },
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
        type: 'INVITE',
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
}
