
import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { EmployeesServiceBase } from "./employees.service.base";
import { CreateEmployeesDto, UpdateEmployeesDto, EmployeesResponseDto } from "@om/shared";

@Controller("employees")
export class EmployeesControllerBase {
  constructor(protected readonly service: EmployeesServiceBase) {}

  @Post()
  async create(@Body() data: CreateEmployeesDto): Promise<EmployeesResponseDto> {
    return this.service.create(data);
  }

  @Get()
  async findMany(): Promise<EmployeesResponseDto[]> {
    return this.service.findMany();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<EmployeesResponseDto | null> {
    return this.service.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() data: UpdateEmployeesDto): Promise<EmployeesResponseDto> {
    return this.service.update(id, data);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<EmployeesResponseDto> {
    return this.service.remove(id);
  }
}
