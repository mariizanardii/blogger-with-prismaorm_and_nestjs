import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  // add comentary
  async create(createCommentDto: CreateCommentDto) {
    const { text, postId, userId } = createCommentDto;

    // val
    const postExists = await this.prisma.post.findUnique({ where: { id: postId } });
    const userExists = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!postExists) throw new HttpException('Post not found.', HttpStatus.BAD_REQUEST);
    if (!userExists) throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);

    return this.prisma.comment.create({
      data: {
        text,
        postId,
        userId,
      },
    });
  }

  async findAll() {
    return await this.prisma.comment.findMany();
  }
  //  list
  async findAllCommentsByPostId(postId: number) {
    const postExists = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!postExists) throw new HttpException('Post not found.', HttpStatus.BAD_REQUEST);

    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        user: true, 
      },
    });
  }

  //update
  async updateComment(commentId: number, newText: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) throw new HttpException('Commentary not found', HttpStatus.BAD_REQUEST);

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { text: newText }, // Apenas o texto é atualizado
    });
  }

  //del
  async deleteComment(commentId: number) {
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId
      },
    });

    if (!comment) throw new HttpException('Commentary not found', HttpStatus.BAD_REQUEST);

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  
  }
}