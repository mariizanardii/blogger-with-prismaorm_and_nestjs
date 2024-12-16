import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
 
  async create(data: Prisma.PostCreateInput) {
    //validando se os campos obrigatorios estão nulos.
    if (!data.title || !data.text || !data.author) {
      throw new HttpException('Fill in all required fields', HttpStatus.BAD_REQUEST);
    } 
    // Validando se o authorId é válido AuthorCreateNestedOneWithoutPostsInput
    const authorId = (data.author as Prisma.AuthorCreateNestedOneWithoutPostsInput).connect?.id;

    if (!authorId) {
      throw new HttpException('Invalid authorId: Author not found', HttpStatus.BAD_REQUEST);
    }
    
    const authorExists = await this.prisma.author.findUnique({
      where: { id: authorId },
    });

    if (!authorExists) {
      throw new HttpException('Invalid authorId: Author not found', HttpStatus.BAD_REQUEST);
    }
    
    // valida se ja existe pub com esste titulo
    const duplicateTitle = await this.prisma.post.findFirst({
      where: { title: data.title },
    });

    if (duplicateTitle) {
      throw new HttpException('Duplicate post!!', HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.post.create({ data });
  }
  
  async findAll() {
    return await this.prisma.post.findMany();
  }

  async findOne(id: number) {
    const findPost = await this.prisma.post.findUnique({where: {id}});

    if (!findPost){
      throw new HttpException ('Post not found', HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.post.findUnique({ where: { id } });
  }

  // procura post pelo titulo
  async findByTitle(title: string) {
    if (!title) {
      throw new HttpException('Title is required', HttpStatus.BAD_REQUEST);
    }
    const postByTitle = await this.prisma.post.findFirst({
      where: { title },
    });
    if (!postByTitle) {
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    }
    return postByTitle;
  }
  //procura post pelo author (nome)
  async findPostsByAuthor(author: string) {
    if (!author) {
      throw new HttpException('Author name is required', HttpStatus.BAD_REQUEST);
    }
      const authorData = await this.prisma.author.findFirst({
      where: { completeName: author },
    });
  
    if (!authorData) {
      throw new HttpException('no posts by this author were found', HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.post.findMany({
      where: { authorId: authorData.id },
    });
  }

// fim adds
  async update(id: number, data: Prisma.PostUpdateInput) {
    const findPost = await this.prisma.post.findUnique({where: {id}});

    if (!findPost){
      throw new HttpException ('Post not found', HttpStatus.BAD_REQUEST);
    }

    //validando se os campos obrigatorios estão nulos.
    if (!data.title || !data.text || !data.author) {
      throw new HttpException('Fill in all required fields', HttpStatus.BAD_REQUEST);
    } 
    // Validando se o authorId é válido AuthorCreateNestedOneWithoutPostsInput
    const authorId = (data.author as Prisma.AuthorCreateNestedOneWithoutPostsInput).connect?.id;

    if (!authorId) {
      throw new HttpException('Invalid authorId: Author not found', HttpStatus.BAD_REQUEST);
    }
    
    const authorExists = await this.prisma.author.findUnique({
      where: { id: authorId },
    });

    if (!authorExists) {
      throw new HttpException('Invalid authorId: Author not found', HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.post.update({ where: { id }, data });
  }

  async remove(id: number) {
    const findPost = await this.prisma.post.findUnique({where: {id}});
  if (!findPost){
    throw new HttpException ('Post not found', HttpStatus.BAD_REQUEST);
  }
    return await this.prisma.post.delete({ where: { id } });
  }
}
