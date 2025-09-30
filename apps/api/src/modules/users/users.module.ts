
import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { UsersServiceBase } from "./base/users.service.base";
import { UsersControllerBase } from "./base/users.controller.base";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { CommonService } from "src/common/services/common.service";
import { EmailService } from "src/email/email.service";
import { TokenService } from "../auth/token.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

@Module({
   imports: [
      PassportModule.register({ defaultStrategy: 'token' }),
      JwtModule.register({
        secret: process.env.TOKEN_SECRET,
        signOptions: { expiresIn: process.env.ACCESS_EXPIRE_SHORT || '15m' },
      }),
    ],
  controllers: [UsersController],
  providers: [UsersService, UsersServiceBase, PrismaService, EmailService, CommonService, TokenService],
  exports: [UsersService],
})
export class UsersModule {}
