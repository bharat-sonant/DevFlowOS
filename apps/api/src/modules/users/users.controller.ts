
import { Controller } from "@nestjs/common";
import { UsersControllerBase } from "./base/users.controller.base";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController extends UsersControllerBase {
  constructor(protected readonly service: UsersService) {
    super(service);
  }

  // ✅ Add custom endpoints here
}
