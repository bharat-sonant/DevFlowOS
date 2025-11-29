
import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { UserTokensServiceBase } from "./base/user_tokens.service.base";
import { UserTokensControllerBase } from "./base/user_tokens.controller.base";
import { UserTokensService } from "./user_tokens.service";
import { UserTokensController } from "./user_tokens.controller";

@Module({
  controllers: [UserTokensController],
  providers: [UserTokensService, UserTokensServiceBase, PrismaService],
  exports: [UserTokensService],
})
export class UserTokensModule {}
