
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { CreateUsersDto, UpdateUsersDto, UsersResponseDto } from "@om/shared";

@Injectable()
export class UsersServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async create(data: CreateUsersDto): Promise<UsersResponseDto> {
    const prismaData: any = { ...data };
    
    if (prismaData.hasOwnProperty("company_id")) {
      const v = prismaData["company_id"];
      if (v !== undefined && v !== null) {
        prismaData["companies"] = { connect: { id: v } };
      }
      delete prismaData["company_id"];
    }
    const created = await this.prisma.users.create({ data: prismaData });
    return created as unknown as UsersResponseDto;
  }

  async findMany(): Promise<UsersResponseDto[]> {
    return this.prisma.users.findMany() as unknown as UsersResponseDto[];
  }

  async findOne(id: string): Promise<UsersResponseDto | null> {
    return this.prisma.users.findUnique({ where: { id } }) as unknown as UsersResponseDto;
  }

  async update(id: string, data: UpdateUsersDto): Promise<UsersResponseDto> {
    const prismaData: any = { ...data };
    
    if (prismaData.hasOwnProperty("company_id")) {
      const v = prismaData["company_id"];
      if (v !== undefined && v !== null) {
        prismaData["companies"] = { connect: { id: v } };
      }
      delete prismaData["company_id"];
    }
    return this.prisma.users.update({ where: { id }, data: prismaData }) as unknown as UsersResponseDto;
  }

  async remove(id: string): Promise<UsersResponseDto> {
    return this.prisma.users.delete({ where: { id } }) as unknown as UsersResponseDto;
  }
}
