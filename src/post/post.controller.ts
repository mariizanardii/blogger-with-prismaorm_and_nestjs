import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';


@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() data) {
    return this.postService.create(data);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }
 
  @Get('findPostsByAuthorId/:authorId')
  findPostsByAuthorId(@Param('authorId') author: string) {
    return this.postService.findPostsByAuthorId(+author);
  }

  @Get(':title')
  findByTitle(@Param(':title') title: string) {
    return this.postService.findOne(+title);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data) {
    return this.postService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }


}
