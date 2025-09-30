import { BadRequestException, Body, Controller, Get, Post, Query, Req, UnauthorizedException } from "@nestjs/common";
import { UsersControllerBase } from "./base/users.controller.base";
import { UsersService } from "./users.service";
import { Request } from 'express';
import { CompleteRegistrationDto, InviteUserDto, ValidateInviteDto } from "@om/shared";
import { ApiBearerAuth, ApiExtraModels, ApiQuery } from "@nestjs/swagger";
import { Public } from "../auth/public.decorator";

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

  @Public()
  @Get('validate-invite')
  @ApiQuery({ name: 'token', type: String, required: true })
  async validateInvite(@Query('token') token: string) {
    // console.log('query.token: ', token);

    if (!token) {
      throw new BadRequestException('Token is required!');
    }

    const result = await this.usersService.validateInvite(token);

    if (!result) {
      throw new BadRequestException('Invitation link is invalid or expired');
    }

    return {
      companyName: result.companyName,
      companyCode: result.companyCode,
      email: result.email,
      companyId : result.companyId
    };
  }

  @Public()
  @Post('complete-registration')
  async completeRegistration(@Body() dto: CompleteRegistrationDto) {
    // const { sub: userId, companyId, isOwner } = req.user as any;
    // console.log('dto',dto)
    // console.log('company id', companyId)

      const result = await this.usersService.completeRegistration(dto, dto.companyId);
    if (!result) {
      throw new BadRequestException('Invalid or expired token');
    }
    return result;
  }
}
