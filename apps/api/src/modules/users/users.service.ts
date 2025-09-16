
import { Injectable } from "@nestjs/common";
import { UsersServiceBase } from "./base/users.service.base";

@Injectable()
export class UsersService extends UsersServiceBase {
  // Add custom business logic here
}
