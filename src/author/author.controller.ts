import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthorService } from './author.service';


@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  create(@Body() data) {
    return this.authorService.create(data);
  }

  @Get()
  findAll() {
    return this.authorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data) {
    return this.authorService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorService.remove(+id);
  }
}
