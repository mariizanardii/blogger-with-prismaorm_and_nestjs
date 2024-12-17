import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(private readonly prisma: PrismaService) {}


  async create(createAuthorDto: CreateAuthorDto) {
    const { surname, completeName, tags, is_a_user } = createAuthorDto;

    const existingAuthor = await this.prisma.author.findFirst({
      where: { completeName },
    });

    if (existingAuthor) {
      throw new HttpException('Author already exists', HttpStatus.BAD_REQUEST);
    }

    return await this.prisma.author.create({
      data: {
        surname,
        completeName,
        tags,
        is_a_user,
      },
    });
  }

 
  async findAll() {
    return await this.prisma.author.findMany({
      include: { posts: true }, 
    });
  }

  async findOne(id: number) {
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: { posts: true },  
    });

    if (!author) {
      throw new HttpException('Author not found', HttpStatus.BAD_REQUEST);
    }

    return author;
  }

 
  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      throw new HttpException('Author not found', HttpStatus.BAD_REQUEST);
    }

    return await this.prisma.author.update({
      where: { id },
      data: { ...updateAuthorDto },
    });
  }
 
   async remove(id: number) {
     const author = await this.prisma.author.findUnique({
      where: { id },
      include: { posts: true },  
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

     await this.prisma.post.deleteMany({
      where: { authorId: id },
    });

    return await this.prisma.author.delete({
      where: { id },
    });
  }
}
