
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { CreateUserTokensDto, UpdateUserTokensDto, UserTokensResponseDto } from "@om/shared";

@Injectable()
export class UserTokensServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async create(data: CreateUserTokensDto): Promise<UserTokensResponseDto> {
    const prismaData: any = { ...data };
    
    const created = await this.prisma.user_tokens.create({ data: prismaData });
    return created as unknown as UserTokensResponseDto;
  }

  async findMany(): Promise<UserTokensResponseDto[]> {
    return this.prisma.user_tokens.findMany() as unknown as UserTokensResponseDto[];
  }

  async findOne(id: string): Promise<UserTokensResponseDto | null> {
    return this.prisma.user_tokens.findUnique({ where: { id } }) as unknown as UserTokensResponseDto;
  }

  async update(id: string, data: UpdateUserTokensDto): Promise<UserTokensResponseDto> {
    const prismaData: any = { ...data };
    
    return this.prisma.user_tokens.update({ where: { id }, data: prismaData }) as unknown as UserTokensResponseDto;
  }

  async remove(id: string): Promise<UserTokensResponseDto> {
    return this.prisma.user_tokens.delete({ where: { id } }) as unknown as UserTokensResponseDto;
  }
}
