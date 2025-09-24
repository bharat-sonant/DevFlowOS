
import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { UsersServiceBase } from "./base/users.service.base";
import { UsersControllerBase } from "./base/users.controller.base";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { CommonService } from "src/common/services/common.service";
import { EmailService } from "src/email/email.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersServiceBase, PrismaService, EmailService, CommonService],
  exports: [UsersService],
})
export class UsersModule {}
