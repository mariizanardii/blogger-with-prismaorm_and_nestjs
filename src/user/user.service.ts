import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

 
  async create(data: Prisma.UserCreateInput) {
    const userWithEmail = await this.prisma.user.findUnique ({
      where: {email: data.email},
    });

    if (userWithEmail){
      throw new HttpException ('This mail is already register.', HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.user.create({data});
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({where: {id}});

    if (!user){
      throw new HttpException ('User not found!', HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    const user = await this.prisma.user.findUnique({where: {id}});
    
    if (!user){
      throw new HttpException ("User not found!", HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({where: {id}});
    
    if (!user){
      throw new HttpException ("User not found!", HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.user.delete({ where: { id } });
  }

}