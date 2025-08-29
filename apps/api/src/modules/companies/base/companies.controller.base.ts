import { Controller, Get, Post, Body, Param, Delete, Put } from "@nestjs/common";
import { CompaniesServiceBase } from "./companies.service.base";
import { CreateCompaniesDto, UpdateCompaniesDto } from "@om/shared";

@Controller("companies")
export class CompaniesControllerBase {
  constructor(private readonly service: CompaniesServiceBase) {}

  @Post()
  create(@Body() data: CreateCompaniesDto) {
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
  update(@Param("id") id: string, @Body() data: UpdateCompaniesDto) {
    return this.service.update(id, data);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
