
import { Controller } from "@nestjs/common";
import { UserTokensControllerBase } from "./base/user_tokens.controller.base";
import { UserTokensService } from "./user_tokens.service";

@Controller("user_tokens")
export class UserTokensController extends UserTokensControllerBase {
  constructor(protected readonly service: UserTokensService) {
    super(service);
  }

  // ✅ Add custom endpoints here
}
