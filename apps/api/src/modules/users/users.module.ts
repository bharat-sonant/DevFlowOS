
import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { UsersServiceBase } from "./base/users.service.base";
import { UsersControllerBase } from "./base/users.controller.base";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersServiceBase, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
