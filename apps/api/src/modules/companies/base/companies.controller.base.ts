
import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { CompaniesServiceBase } from "./companies.service.base";
import { CreateCompaniesDto, UpdateCompaniesDto, CompaniesResponseDto } from "@om/shared";

@Controller("companies")
export class CompaniesControllerBase {
  constructor(protected readonly service: CompaniesServiceBase) {}

  @Post()
  async create(@Body() data: CreateCompaniesDto): Promise<CompaniesResponseDto> {
    return this.service.create(data);
  }

  @Get()
  async findMany(): Promise<CompaniesResponseDto[]> {
    return this.service.findMany();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<CompaniesResponseDto | null> {
    return this.service.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() data: UpdateCompaniesDto): Promise<CompaniesResponseDto> {
    return this.service.update(id, data);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<CompaniesResponseDto> {
    return this.service.remove(id);
  }
}
