import { Body, Controller, Post, Req, UnauthorizedException } from "@nestjs/common";
import { UsersControllerBase } from "./base/users.controller.base";
import { UsersService } from "./users.service";
import { Request } from 'express';
import { InviteUserDto } from "@om/shared";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth('access-token') 
@Controller("users")
export class UsersController extends UsersControllerBase {
  constructor(protected readonly usersService: UsersService) {
    super(usersService);
  }

  @Post('invite')
  async inviteUser(@Req() req: Request, @Body() dto: InviteUserDto) {
    const { sub: userId, companyId, isOwner } = req.user as any;
    if (!isOwner) {
      throw new UnauthorizedException('Only company owners can invite users');
    }

    return this.usersService.inviteUser(dto.email, companyId, userId);
  }
}
