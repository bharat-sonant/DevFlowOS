import { Controller, Get, Post, Body, Param, Delete, Put } from "@nestjs/common";
import { EmployeesServiceBase } from "./employees.service.base";
import { CreateEmployeesDto, UpdateEmployeesDto } from "@om/shared";

@Controller("employees")
export class EmployeesControllerBase {
  constructor(private readonly service: EmployeesServiceBase) {}

  @Post()
  create(@Body() data: CreateEmployeesDto) {
    return this.service.create(data);
  }

  @Get()
  findMany() {
    return this.service.findMany();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() data: UpdateEmployeesDto) {
    return this.service.update(id, data);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
