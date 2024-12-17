import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePostDto): Promise<PostResponseDto> {
    if (!data.title || !data.text || !data.authorId) {
      throw new HttpException('Fill in all required fields', HttpStatus.BAD_REQUEST);
    }

    const authorExists = await this.prisma.author.findUnique({
      where: { id: data.authorId },
    });

    if (!authorExists) {
      throw new HttpException('Invalid authorId: Author not found', HttpStatus.BAD_REQUEST);
    }

    const duplicateTitle = await this.prisma.post.findFirst({
      where: { title: data.title },
    });

    if (duplicateTitle) {
      throw new HttpException('Duplicate post!!', HttpStatus.BAD_REQUEST);
    }

    const post = await this.prisma.post.create({
      data,
    });

    return post;
  }

  async findAll(): Promise<PostResponseDto[]> {
    return this.prisma.post.findMany();
  }

  async findOne(id: number): Promise<PostResponseDto> {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    }

    return post;
  }

  async findByTitle(title: string): Promise<PostResponseDto> {
    if (!title) {
      throw new HttpException('Title is required', HttpStatus.BAD_REQUEST);
    }

    const post = await this.prisma.post.findFirst({ where: { title } });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    }

    return post;
  }

  async findPostsByAuthorId(authorId: number): Promise<PostResponseDto[]> {
    if (!authorId) {
      throw new HttpException('Author ID is required', HttpStatus.BAD_REQUEST);
    }
  
    const authorExists = await this.prisma.author.findUnique({
      where: { id: authorId },
    });
  
    if (!authorExists) {
      throw new HttpException('Author not found', HttpStatus.BAD_REQUEST);
    }
  
    return this.prisma.post.findMany({ where: { authorId } });
  }

  async update(id: number, data: UpdatePostDto): Promise<PostResponseDto> {
    const findPost = await this.prisma.post.findUnique({ where: { id } });

    if (!findPost) {
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    }

    if (data.authorId) {
      const authorExists = await this.prisma.author.findUnique({
        where: { id: data.authorId },
      });

      if (!authorExists) {
        throw new HttpException('Invalid authorId: Author not found', HttpStatus.BAD_REQUEST);
      }
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data,
    });

    return updatedPost;
  }

  async remove(id: number): Promise<PostResponseDto> {
    const findPost = await this.prisma.post.findUnique({ where: { id } });

    if (!findPost) {
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.post.delete({ where: { id } });
  }
}