
import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { UsersServiceBase } from "./users.service.base";
import { CreateUsersDto, UpdateUsersDto, UsersResponseDto } from "@om/shared";

@Controller("users")
export class UsersControllerBase {
  constructor(protected readonly service: UsersServiceBase) {}

  @Post()
  async create(@Body() data: CreateUsersDto): Promise<UsersResponseDto> {
    return this.service.create(data);
  }

  @Get()
  async findMany(): Promise<UsersResponseDto[]> {
    return this.service.findMany();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<UsersResponseDto | null> {
    return this.service.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() data: UpdateUsersDto): Promise<UsersResponseDto> {
    return this.service.update(id, data);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<UsersResponseDto> {
    return this.service.remove(id);
  }
}
