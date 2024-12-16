import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
 
 
  async create(data: Prisma.CommentCreateInput) {
    return await this.prisma.comment.create({ data });
  }

  async findAll() {
    return await this.prisma.comment.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.comment.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.CommentUpdateInput) {
    return await this.prisma.comment.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.comment.delete({ where: { id } });
  }


}
