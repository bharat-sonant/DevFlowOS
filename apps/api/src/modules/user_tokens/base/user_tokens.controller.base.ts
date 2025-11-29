
import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { UserTokensServiceBase } from "./user_tokens.service.base";
import { CreateUserTokensDto, UpdateUserTokensDto, UserTokensResponseDto } from "@om/shared";

@Controller("user_tokens")
export class UserTokensControllerBase {
  constructor(protected readonly service: UserTokensServiceBase) {}

  @Post()
  async create(@Body() data: CreateUserTokensDto): Promise<UserTokensResponseDto> {
    return this.service.create(data);
  }

  @Get()
  async findMany(): Promise<UserTokensResponseDto[]> {
    return this.service.findMany();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<UserTokensResponseDto | null> {
    return this.service.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() data: UpdateUserTokensDto): Promise<UserTokensResponseDto> {
    return this.service.update(id, data);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<UserTokensResponseDto> {
    return this.service.remove(id);
  }
}
