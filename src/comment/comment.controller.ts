import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get('post/:postId')
  async findAllCommentsByPostId(@Param('postId') postId: number) {
    return this.commentService.findAllCommentsByPostId(Number(postId));
  }

  @Patch(':id')
  async updateComment(@Param('id') id: number, @Body('text') newText: string) {
    return this.commentService.updateComment(Number(id), newText);
  }

  @Delete(':id/')
  async deleteComment(@Param('id') id: number){
    return this.commentService.deleteComment(Number(id));
  }
}